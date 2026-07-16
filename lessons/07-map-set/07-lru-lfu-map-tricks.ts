// Companion code for ./07-lru-lfu-map-tricks.md

// --- LeetCode 146. LRU Cache (Medium) ---
// https://leetcode.com/problems/lru-cache/
// JS Map preserves insertion order, and re-inserting an existing key moves
// it to the end of that order. That's exactly what an LRU cache needs:
// delete + set on access marks a key as most-recently-used, and the first
// key in iteration order is always the least-recently-used one to evict.
export class LRUCache<K, V> {
  private readonly capacity: number;
  private readonly store = new Map<K, V>();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get size(): number {
    return this.store.size;
  }

  get(key: K): V | undefined {
    if (!this.store.has(key)) return undefined;
    const value = this.store.get(key) as V;
    this.store.delete(key);
    this.store.set(key, value); // re-insert: now most-recently-used
    return value;
  }

  put(key: K, value: V): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.capacity) {
      const leastRecentlyUsedKey = this.store.keys().next().value as K;
      this.store.delete(leastRecentlyUsedKey);
    }
    this.store.set(key, value);
  }
}

// --- LeetCode 460. LFU Cache (Hard) ---
// https://leetcode.com/problems/lfu-cache/
// Three maps working together give O(1) get/put:
//  - valueOf:   key -> value
//  - freqOf:    key -> current access frequency
//  - keysByFreq: frequency -> Set of keys at that frequency (insertion
//    order within the Set breaks ties toward least-recently-used)
// `minFreq` tracks the smallest frequency currently in use, so eviction
// never has to scan for the minimum.
export class LFUCache<K, V> {
  private readonly capacity: number;
  private minFreq = 0;
  private readonly valueOf = new Map<K, V>();
  private readonly freqOf = new Map<K, number>();
  private readonly keysByFreq = new Map<number, Set<K>>();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  private bumpFrequency(key: K): void {
    const freq = this.freqOf.get(key) as number;
    const bucket = this.keysByFreq.get(freq);
    bucket?.delete(key);
    if (bucket && bucket.size === 0) {
      this.keysByFreq.delete(freq);
      if (this.minFreq === freq) this.minFreq++;
    }
    const nextFreq = freq + 1;
    this.freqOf.set(key, nextFreq);
    if (!this.keysByFreq.has(nextFreq)) this.keysByFreq.set(nextFreq, new Set());
    this.keysByFreq.get(nextFreq)!.add(key);
  }

  get(key: K): V | undefined {
    if (!this.valueOf.has(key)) return undefined;
    this.bumpFrequency(key);
    return this.valueOf.get(key);
  }

  put(key: K, value: V): void {
    if (this.capacity <= 0) return;

    if (this.valueOf.has(key)) {
      this.valueOf.set(key, value);
      this.bumpFrequency(key);
      return;
    }

    if (this.valueOf.size >= this.capacity) {
      const evictBucket = this.keysByFreq.get(this.minFreq)!;
      const evictKey = evictBucket.values().next().value as K;
      evictBucket.delete(evictKey);
      if (evictBucket.size === 0) this.keysByFreq.delete(this.minFreq);
      this.valueOf.delete(evictKey);
      this.freqOf.delete(evictKey);
    }

    this.valueOf.set(key, value);
    this.freqOf.set(key, 1);
    if (!this.keysByFreq.has(1)) this.keysByFreq.set(1, new Set());
    this.keysByFreq.get(1)!.add(key);
    this.minFreq = 1;
  }
}

// --- LeetCode 380. Insert Delete GetRandom O(1) (Medium) ---
// https://leetcode.com/problems/insert-delete-getrandom-o1/
// A Map<value, index> plus a plain array gives O(1) insert, remove, and
// getRandom: removal swaps the target with the last array element (so no
// shifting is needed) and updates the swapped value's index in the map.
export class RandomizedSet {
  private readonly indexOf = new Map<number, number>();
  private readonly values: number[] = [];

  insert(value: number): boolean {
    if (this.indexOf.has(value)) return false;
    this.indexOf.set(value, this.values.length);
    this.values.push(value);
    return true;
  }

  remove(value: number): boolean {
    const index = this.indexOf.get(value);
    if (index === undefined) return false;
    const lastValue = this.values[this.values.length - 1];
    this.values[index] = lastValue;
    this.indexOf.set(lastValue, index);
    this.values.pop();
    this.indexOf.delete(value);
    return true;
  }

  getRandom(): number {
    if (this.values.length === 0) throw new Error('getRandom called on empty set');
    const randomIndex = Math.floor(Math.random() * this.values.length);
    return this.values[randomIndex];
  }

  get size(): number {
    return this.values.length;
  }
}

// Exercise: a Map-based memoizer for single-argument functions — a common
// "map trick" for caching expensive computations by key.
export function memoizeStub<Arg, Result>(_fn: (arg: Arg) => Result): (arg: Arg) => Result {
  throw new Error('not implemented');
}
// Solution:
export function memoize<Arg, Result>(fn: (arg: Arg) => Result): (arg: Arg) => Result {
  const cache = new Map<Arg, Result>();
  return (arg: Arg): Result => {
    if (cache.has(arg)) return cache.get(arg) as Result;
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

// Exercise: "get or compute" — return a Map's existing value for a key, or
// compute it with `factory`, store it, and return it. Useful for lazily
// building grouped/aggregated structures without a separate has()+set() dance.
export function getOrComputeStub<K, V>(_map: Map<K, V>, _key: K, _factory: () => V): V {
  throw new Error('not implemented');
}
// Solution:
export function getOrCompute<K, V>(map: Map<K, V>, key: K, factory: () => V): V {
  const existing = map.get(key);
  if (existing !== undefined) return existing;
  const computed = factory();
  map.set(key, computed);
  return computed;
}

// --- run ---
if (require.main === module) {
  const lru = new LRUCache<number, number>(2);
  lru.put(1, 1);
  lru.put(2, 2);
  console.assert(lru.get(1) === 1, 'LRU: key 1 should be present');
  lru.put(3, 3); // evicts key 2 (least recently used after the get(1) above)
  console.assert(lru.get(2) === undefined, 'LRU: key 2 should have been evicted');
  lru.put(4, 4); // evicts key 1
  console.assert(lru.get(1) === undefined, 'LRU: key 1 should have been evicted');
  console.assert(lru.get(3) === 3, 'LRU: key 3 should still be present');
  console.assert(lru.get(4) === 4, 'LRU: key 4 should still be present');

  const lfu = new LFUCache<number, number>(2);
  lfu.put(1, 1);
  lfu.put(2, 2);
  console.assert(lfu.get(1) === 1, 'LFU: key 1 should return 1');
  lfu.put(3, 3); // evicts key 2 (freq 1, only freq-1 item)
  console.assert(lfu.get(2) === undefined, 'LFU: key 2 should have been evicted');
  console.assert(lfu.get(3) === 3, 'LFU: key 3 should return 3');
  lfu.put(4, 4); // key 1 and key 3 are both freq 2; key 1 is the older (LRU) one -> evicted
  console.assert(lfu.get(1) === undefined, 'LFU: key 1 should have been evicted');
  console.assert(lfu.get(3) === 3, 'LFU: key 3 should still return 3');
  console.assert(lfu.get(4) === 4, 'LFU: key 4 should return 4');

  const rs = new RandomizedSet();
  console.assert(rs.insert(1) === true, 'inserting a new value should succeed');
  console.assert(rs.insert(1) === false, 'inserting a duplicate value should fail');
  console.assert(rs.remove(2) === false, 'removing a missing value should fail');
  console.assert(rs.remove(1) === true, 'removing an existing value should succeed');
  console.assert(rs.size === 0, 'set should be empty after removing its only element');
  rs.insert(10);
  rs.insert(20);
  rs.insert(30);
  console.assert(rs.size === 3, 'set should hold 3 elements');
  const randomValue = rs.getRandom();
  console.assert([10, 20, 30].includes(randomValue), 'getRandom should return one of the inserted values');

  let calls = 0;
  const square = memoize((n: number) => {
    calls++;
    return n * n;
  });
  console.assert(square(4) === 16, 'memoized square(4) should be 16');
  console.assert(square(4) === 16, 'memoized square(4) should still be 16 on second call');
  console.assert(calls === 1, 'the underlying function should only run once for the same argument');

  const groupSizes = new Map<string, number[]>();
  getOrCompute(groupSizes, 'evens', () => []).push(2);
  getOrCompute(groupSizes, 'evens', () => []).push(4);
  console.assert(JSON.stringify(groupSizes.get('evens')) === JSON.stringify([2, 4]), 'getOrCompute should reuse the same array across calls');

  console.log('07-lru-lfu-map-tricks: all assertions passed');
}
