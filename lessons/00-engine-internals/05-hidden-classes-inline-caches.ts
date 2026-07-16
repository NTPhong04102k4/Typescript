// Companion code for ./05-hidden-classes-inline-caches.md
import { performance } from 'perf_hooks';

// --- Hidden classes ---
//
// V8 assigns every object an internal "hidden class" (V8 calls it a "Map",
// unrelated to JS `Map`) based on its shape: the set of property keys AND
// the order they were added in. Two objects built with the same keys in
// the same order share a hidden class and get fast, offset-based property
// access; objects with different key sets/orders get different hidden
// classes. This registry models that by keying on `Object.keys(obj).join(',')`
// (JS objects preserve insertion order for string keys), assigning a new
// numeric id to each distinct shape it has never seen before.
export class HiddenClassRegistry {
  private readonly shapeToId = new Map<string, number>();
  private nextId = 0;

  static shapeSignature(obj: object): string {
    return Object.keys(obj).join(',');
  }

  /** Returns the (possibly newly assigned) hidden-class id for `obj`'s current shape. */
  idFor(obj: object): number {
    const signature = HiddenClassRegistry.shapeSignature(obj);
    let id = this.shapeToId.get(signature);
    if (id === undefined) {
      id = this.nextId++;
      this.shapeToId.set(signature, id);
    }
    return id;
  }

  get shapeCount(): number {
    return this.shapeToId.size;
  }
}

// --- Inline caches ---
//
// A call site that repeatedly reads the same property (e.g. `p.x` inside a
// loop) keeps an "inline cache" of which hidden class(es) it has seen.
// V8's real states: uninitialized -> monomorphic (1 shape) ->
// polymorphic (2-4 shapes) -> megamorphic (5+ shapes, falls back to a
// slower generic lookup).
export type InlineCacheState = 'uninitialized' | 'monomorphic' | 'polymorphic' | 'megamorphic';

export class InlineCacheSimulator {
  private readonly seenClassIds = new Set<number>();

  constructor(private readonly registry: HiddenClassRegistry) {}

  /** Simulates one property-access call site seeing `obj`; returns the resulting IC state. */
  record(obj: object): InlineCacheState {
    this.seenClassIds.add(this.registry.idFor(obj));
    return this.state;
  }

  get state(): InlineCacheState {
    const n = this.seenClassIds.size;
    if (n === 0) return 'uninitialized';
    if (n === 1) return 'monomorphic';
    if (n <= 4) return 'polymorphic';
    return 'megamorphic';
  }
}

// --- Shape-friendly vs shape-unfriendly construction ---

export interface Point {
  readonly x: number;
  readonly y: number;
}

/** Every object is built with the same `{ x, y }` insertion order: one shared hidden class. */
export function createPointsConsistentOrder(n: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < n; i++) {
    points.push({ x: i, y: i * 2 }); // always x then y
  }
  return points;
}

/** Half the objects are built `{ x, y }`, half `{ y, x }`: two distinct hidden classes. */
export function createPointsTwoShapes(n: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      points.push({ x: i, y: i * 2 });
    } else {
      const p = { y: i * 2, x: i }; // reversed insertion order -> different shape
      points.push(p);
    }
  }
  return points;
}

export function sumX(points: readonly Point[]): number {
  let total = 0;
  for (const p of points) total += p.x;
  return total;
}

export function timeIt(fn: () => void): number {
  const start = performance.now();
  fn();
  return performance.now() - start;
}

/**
 * Demonstrates that `delete` + re-add changes an object's shape even though
 * its final key SET is unchanged: deleting `y` then reassigning it moves
 * `y` to the end of insertion order, producing a different shape signature
 * (V8 additionally demotes the object to slow "dictionary mode" on delete,
 * which this simplified model does not simulate -- see the .md).
 */
export function demonstrateDeletionEffect(registry: HiddenClassRegistry): {
  originalId: number;
  afterId: number;
  shapeChanged: boolean;
} {
  const obj: Record<string, number> = { x: 1, y: 2, z: 3 };
  const originalId = registry.idFor(obj);
  delete obj.y;
  obj.y = 20;
  const afterId = registry.idFor(obj);
  return { originalId, afterId, shapeChanged: originalId !== afterId };
}

// --- LeetCode 705. Design HashSet (Easy) ---
// https://leetcode.com/problems/design-hashset/
// A hand-built bucket hash table -- the same fallback mechanism V8 uses
// internally (a "dictionary") once an object stops being hidden-class-friendly.
export class MyHashSet {
  private static readonly BUCKET_COUNT = 1000;
  private readonly buckets: number[][] = Array.from({ length: MyHashSet.BUCKET_COUNT }, () => []);

  private hash(key: number): number {
    return key % MyHashSet.BUCKET_COUNT;
  }

  add(key: number): void {
    const bucket = this.buckets[this.hash(key)];
    if (!bucket.includes(key)) bucket.push(key);
  }

  remove(key: number): void {
    const bucket = this.buckets[this.hash(key)];
    const index = bucket.indexOf(key);
    if (index !== -1) bucket.splice(index, 1);
  }

  contains(key: number): boolean {
    return this.buckets[this.hash(key)].includes(key);
  }
}

// --- LeetCode 706. Design HashMap (Easy) ---
// https://leetcode.com/problems/design-hashmap/
export class MyHashMap {
  private static readonly BUCKET_COUNT = 1000;
  private readonly buckets: Array<Array<[number, number]>> = Array.from(
    { length: MyHashMap.BUCKET_COUNT },
    () => []
  );

  private hash(key: number): number {
    return key % MyHashMap.BUCKET_COUNT;
  }

  put(key: number, value: number): void {
    const bucket = this.buckets[this.hash(key)];
    const entry = bucket.find((pair) => pair[0] === key);
    if (entry) entry[1] = value;
    else bucket.push([key, value]);
  }

  get(key: number): number {
    const bucket = this.buckets[this.hash(key)];
    const entry = bucket.find((pair) => pair[0] === key);
    return entry ? entry[1] : -1;
  }

  remove(key: number): void {
    const bucket = this.buckets[this.hash(key)];
    const index = bucket.findIndex((pair) => pair[0] === key);
    if (index !== -1) bucket.splice(index, 1);
  }
}

// --- LeetCode 49. Group Anagrams (Medium) ---
// https://leetcode.com/problems/group-anagrams/
// Groups by a canonical (sorted-letters) key in a Map -- Map keys are
// compared by value, so this sidesteps hidden-class shape concerns entirely
// (unlike grouping into a plain object keyed by dynamic strings).
export function groupAnagrams(strs: readonly string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const s of strs) {
    const key = [...s].sort().join('');
    const group = groups.get(key);
    if (group) group.push(s);
    else groups.set(key, [s]);
  }
  return [...groups.values()];
}

// Exercise: Implement `stateAfterCalls`, which replays a call site seeing
// `shapes` in order (using a fresh registry) and returns the final
// InlineCacheState.
export function stateAfterCallsStub(_shapes: readonly object[]): InlineCacheState {
  throw new Error('not implemented');
}
// Solution:
export function stateAfterCalls(shapes: readonly object[]): InlineCacheState {
  const registry = new HiddenClassRegistry();
  const ic = new InlineCacheSimulator(registry);
  let state: InlineCacheState = 'uninitialized';
  for (const shape of shapes) state = ic.record(shape);
  return state;
}

// Exercise: Implement `sharesHiddenClass`, returning whether two objects
// would be assigned the same hidden class id by `registry`.
export function sharesHiddenClassStub(_a: object, _b: object, _registry: HiddenClassRegistry): boolean {
  throw new Error('not implemented');
}
// Solution:
export function sharesHiddenClass(a: object, b: object, registry: HiddenClassRegistry): boolean {
  return registry.idFor(a) === registry.idFor(b);
}

// --- run ---
if (require.main === module) {
  const registry = new HiddenClassRegistry();
  const p1 = { x: 1, y: 2 };
  const p2 = { x: 3, y: 4 };
  const p3 = { y: 5, x: 6 }; // reversed order -> different shape

  console.assert(registry.idFor(p1) === registry.idFor(p2), 'same key order should share a hidden class');
  console.assert(registry.idFor(p1) !== registry.idFor(p3), 'reversed key order should get a different hidden class');
  console.assert(sharesHiddenClass(p1, p2, registry), 'sharesHiddenClass should agree with idFor');
  console.assert(!sharesHiddenClass(p1, p3, registry), 'sharesHiddenClass should detect the shape mismatch');

  const ic = new InlineCacheSimulator(registry);
  console.assert(ic.state === 'uninitialized', 'a fresh call site starts uninitialized');
  console.assert(ic.record({ a: 1 }) === 'monomorphic', '1 distinct shape -> monomorphic');
  console.assert(ic.record({ a: 1, b: 2 }) === 'polymorphic', '2 distinct shapes -> polymorphic');
  console.assert(ic.record({ a: 1, b: 2, c: 3 }) === 'polymorphic', '3 distinct shapes -> still polymorphic');
  console.assert(ic.record({ a: 1, b: 2, c: 3, d: 4 }) === 'polymorphic', '4 distinct shapes -> still polymorphic');
  console.assert(ic.record({ a: 1, b: 2, c: 3, d: 4, e: 5 }) === 'megamorphic', '5 distinct shapes -> megamorphic');

  console.assert(
    stateAfterCalls([{ x: 1 }, { x: 2 }, { x: 3 }]) === 'monomorphic',
    'three identically-shaped objects should stay monomorphic'
  );

  const deletionResult = demonstrateDeletionEffect(new HiddenClassRegistry());
  console.assert(deletionResult.shapeChanged, 'delete + re-add should change the shape signature');

  const consistent = createPointsConsistentOrder(50_000);
  const twoShapes = createPointsTwoShapes(50_000);
  console.assert(sumX(consistent) === sumX([...consistent]), 'sumX should be deterministic');
  const consistentTime = timeIt(() => sumX(consistent));
  const twoShapesTime = timeIt(() => sumX(twoShapes));
  console.log(`consistent-shape sumX: ${consistentTime.toFixed(3)}ms, two-shape sumX: ${twoShapesTime.toFixed(3)}ms`);

  const set = new MyHashSet();
  set.add(1);
  set.add(2);
  console.assert(set.contains(1) === true && set.contains(3) === false, 'MyHashSet contains should be accurate');
  set.remove(2);
  console.assert(set.contains(2) === false, 'MyHashSet remove should delete the key');

  const map = new MyHashMap();
  map.put(1, 100);
  map.put(2, 200);
  console.assert(map.get(1) === 100 && map.get(3) === -1, 'MyHashMap get should be accurate');
  map.remove(1);
  console.assert(map.get(1) === -1, 'MyHashMap remove should delete the key');

  const grouped = groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);
  const groupSizes = grouped.map((g) => g.length).sort((a, b) => a - b);
  console.assert(groupSizes.join(',') === '1,2,3', 'groupAnagrams should produce groups of size 1 ("bat"), 2 ("tan","nat"), 3 ("eat","tea","ate")');

  console.log('05-hidden-classes-inline-caches: all assertions passed');
}
