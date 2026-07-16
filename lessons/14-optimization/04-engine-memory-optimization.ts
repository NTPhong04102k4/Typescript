// Companion code for ./04-engine-memory-optimization.md
//
// Algorithmic optimization (lessons 01-03) fixes the Big-O; engine-aware
// optimization fixes the constant factor. These are the highest-leverage
// habits for hot JavaScript, all rooted in topic 00 (Engine Internals):
//   - Monomorphic object shapes  -> topic 00, lesson 05 (hidden classes)
//   - Typed arrays for hot loops -> topic 00, lesson 04 (elements kinds)
//   - Avoiding holey arrays       -> topic 00, lesson 04 (packed vs holey)
//   - Map vs plain object         -> topic 00, lesson 05 (dictionary mode)
// The functions below are all correctness-checkable; the performance claims
// live in the companion .md (wall-clock timing is too flaky to assert on).

/** A 2-D point. Built only via createPoint so every instance shares one shape. */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/**
 * Monomorphic factory: always assigns keys in the same order ({ x, y }), so
 * all points share a single V8 hidden class and reads like `p.x` at a hot
 * call site stay monomorphic (fixed-offset, no shape check). Building objects
 * with varying key order or key sets would force polymorphic/megamorphic
 * lookups. See topic 00, lesson 05 (hidden-classes-inline-caches).
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Hot loop over uniformly-shaped points. Because every element came from
 * createPoint, the `p.x`/`p.y` reads hit a monomorphic inline cache.
 */
export function totalManhattanFromOrigin(points: readonly Point[]): number {
  let total = 0;
  for (const p of points) {
    total += Math.abs(p.x) + Math.abs(p.y);
  }
  return total;
}

/**
 * Copy numbers into an Int32Array: a contiguous, unboxed 32-bit integer
 * buffer with a fixed elements kind. For integer-heavy hot loops this beats a
 * regular number[] — no boxing, no elements-kind escalation, cache-friendly
 * stride. See topic 00, lesson 04 (array-memory-layout).
 */
export function toInt32Array(nums: readonly number[]): Int32Array {
  const arr = new Int32Array(nums.length);
  for (let i = 0; i < nums.length; i++) {
    arr[i] = nums[i];
  }
  return arr;
}

/** Tight sum over a typed array — the shape of a numeric hot loop. */
export function sumInt32(arr: Int32Array): number {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

/**
 * Build a PACKED array by pushing sequentially: no gaps, so V8 keeps it in
 * the fast PACKED_SMI_ELEMENTS kind. Prefer this over the holey builder below
 * whenever you fill an array front-to-back.
 */
export function buildPackedSquares(n: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    out.push(i * i);
  }
  return out;
}

/**
 * Same VALUES as buildPackedSquares, but `new Array(n)` allocates a HOLEY
 * backing store up front, so every read carries a hole-check (and can fall to
 * a prototype-chain lookup). Included as the anti-pattern to contrast with the
 * packed builder. See topic 00, lesson 04 (packed vs holey).
 */
export function buildHoleyThenFill(n: number): number[] {
  const out = new Array<number>(n); // holey the moment it is created
  for (let i = 0; i < n; i++) {
    out[i] = i * i;
  }
  return out;
}

/**
 * Frequency counter using a Map — the right choice for dynamic, unknown-ahead
 * keys: Map is purpose-built for that, whereas accumulating on a plain object
 * risks dictionary-mode demotion and prototype-key collisions ("__proto__").
 * See topic 00, lesson 05.
 */
export function frequenciesWithMap(items: readonly string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  return counts;
}

/**
 * The same tally on a plain object. Fine for a small, fixed set of known keys
 * (monomorphic shape), but for arbitrary string keys prefer the Map version.
 * Uses a null-prototype object to avoid inherited-key surprises.
 */
export function frequenciesWithObject(items: readonly string[]): Record<string, number> {
  const counts: Record<string, number> = Object.create(null);
  for (const item of items) {
    counts[item] = (counts[item] ?? 0) + 1;
  }
  return counts;
}

// Exercise: dot product of two equal-length Int32Arrays, in one tight loop.
export function dotProductStub(_a: Int32Array, _b: Int32Array): number {
  throw new Error('not implemented');
}
// Solution:
export function dotProduct(a: Int32Array, b: Int32Array): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

// Exercise: return the most frequent string (ties -> the earliest to reach
// its max count), or null for empty input. Use a Map for the tally.
export function mostFrequentStub(_items: readonly string[]): string | null {
  throw new Error('not implemented');
}
// Solution:
export function mostFrequent(items: readonly string[]): string | null {
  const counts = frequenciesWithMap(items);
  let best: string | null = null;
  let bestCount = 0;
  for (const [item, count] of counts) {
    if (count > bestCount) {
      best = item;
      bestCount = count;
    }
  }
  return best;
}

// --- run ---
if (require.main === module) {
  const points = [createPoint(1, 2), createPoint(-3, 4), createPoint(0, -5)];
  console.assert(totalManhattanFromOrigin(points) === 15, 'manhattan total = 3 + 7 + 5 = 15');
  console.assert(totalManhattanFromOrigin([]) === 0, 'empty point list totals 0');

  const typed = toInt32Array([1, 2, 3, 4, 5]);
  console.assert(typed instanceof Int32Array, 'toInt32Array returns an Int32Array');
  console.assert(sumInt32(typed) === 15, 'sum of 1..5 in Int32Array = 15');
  console.assert(sumInt32(toInt32Array([])) === 0, 'empty typed array sums to 0');

  // Packed and holey builders must produce identical values (only layout differs).
  const packed = buildPackedSquares(6);
  const holey = buildHoleyThenFill(6);
  console.assert(JSON.stringify(packed) === JSON.stringify([0, 1, 4, 9, 16, 25]), 'packed squares 0..5');
  console.assert(JSON.stringify(packed) === JSON.stringify(holey), 'packed and holey builders agree on values');

  // Map and object tallies must agree.
  const items = ['a', 'b', 'a', 'c', 'b', 'a'];
  const mapCounts = frequenciesWithMap(items);
  const objCounts = frequenciesWithObject(items);
  console.assert(mapCounts.get('a') === 3 && mapCounts.get('b') === 2 && mapCounts.get('c') === 1, 'Map tally');
  console.assert(objCounts['a'] === 3 && objCounts['b'] === 2 && objCounts['c'] === 1, 'object tally');
  console.assert(mostFrequent(items) === 'a', 'most frequent item is "a"');
  console.assert(mostFrequent([]) === null, 'empty input has no most-frequent item');

  console.assert(dotProduct(toInt32Array([1, 2, 3]), toInt32Array([4, 5, 6])) === 32, 'dot product = 4+10+18 = 32');

  console.log('04-engine-memory-optimization: all assertions passed');
}
