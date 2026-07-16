// Companion code for ./01-hash-table-fundamentals.md

/**
 * Polynomial rolling hash: turns a string into an integer bucket index.
 * `base` and `bucketCount` control distribution; a poor base causes clustering.
 */
export function hashStringToBucket(key: string, bucketCount: number, base = 31): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * base + key.charCodeAt(i)) % bucketCount;
  }
  return hash;
}

/** A single chained entry inside a bucket. */
type Entry<V> = [key: string, value: V];

/**
 * Minimal hash table with separate chaining, built to show the mechanics
 * that Map/Set hide behind their native implementation. Not for production
 * use — JS `Map`/`Set` are faster and handle far more edge cases.
 */
export class SimpleHashTable<V> {
  private buckets: Array<Entry<V>[]>;
  private count = 0;
  private readonly maxLoadFactor = 0.75;

  constructor(initialBucketCount = 8) {
    this.buckets = Array.from({ length: initialBucketCount }, () => []);
  }

  get size(): number {
    return this.count;
  }

  get loadFactor(): number {
    return this.count / this.buckets.length;
  }

  /** Sizes of every bucket, in order — useful for inspecting collisions. */
  bucketSizes(): number[] {
    return this.buckets.map((bucket) => bucket.length);
  }

  set(key: string, value: V): void {
    const index = hashStringToBucket(key, this.buckets.length);
    const bucket = this.buckets[index];
    const existing = bucket.find(([k]) => k === key);
    if (existing) {
      existing[1] = value;
      return;
    }
    bucket.push([key, value]);
    this.count++;
    if (this.loadFactor > this.maxLoadFactor) this.resize(this.buckets.length * 2);
  }

  get(key: string): V | undefined {
    const index = hashStringToBucket(key, this.buckets.length);
    const bucket = this.buckets[index];
    const found = bucket.find(([k]) => k === key);
    return found ? found[1] : undefined;
  }

  has(key: string): boolean {
    const index = hashStringToBucket(key, this.buckets.length);
    return this.buckets[index].some(([k]) => k === key);
  }

  delete(key: string): boolean {
    const index = hashStringToBucket(key, this.buckets.length);
    const bucket = this.buckets[index];
    const pos = bucket.findIndex(([k]) => k === key);
    if (pos === -1) return false;
    bucket.splice(pos, 1);
    this.count--;
    return true;
  }

  /** Rehashes every entry into a new bucket array of the given size. */
  private resize(newBucketCount: number): void {
    const oldBuckets = this.buckets;
    this.buckets = Array.from({ length: newBucketCount }, () => []);
    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        const index = hashStringToBucket(key, this.buckets.length);
        this.buckets[index].push([key, value]);
      }
    }
  }
}

// Exercise: return the size of the largest bucket, which tells you the
// worst-case chain length an unlucky lookup would have to walk.
export function largestBucketSizeStub<V>(_table: SimpleHashTable<V>): number {
  throw new Error('not implemented');
}
// Solution:
export function largestBucketSize<V>(table: SimpleHashTable<V>): number {
  return Math.max(0, ...table.bucketSizes());
}

// Exercise: two strings that are anagrams of each other can still hash to
// different buckets under a positional polynomial hash (order matters).
// Write a function that demonstrates this by returning true if two anagram
// strings land in different buckets for a given bucket count.
export function anagramsHashDifferentlyStub(_a: string, _b: string, _bucketCount: number): boolean {
  throw new Error('not implemented');
}
// Solution:
export function anagramsHashDifferently(a: string, b: string, bucketCount: number): boolean {
  return hashStringToBucket(a, bucketCount) !== hashStringToBucket(b, bucketCount);
}

// --- run ---
if (require.main === module) {
  const table = new SimpleHashTable<number>(4);
  table.set('apple', 1);
  table.set('banana', 2);
  table.set('cherry', 3);

  console.assert(table.get('apple') === 1, 'apple should map to 1');
  console.assert(table.get('banana') === 2, 'banana should map to 2');
  console.assert(table.has('cherry') === true, 'cherry should be present');
  console.assert(table.get('missing') === undefined, 'missing key should be undefined');

  console.assert(table.delete('banana') === true, 'delete should succeed once');
  console.assert(table.delete('banana') === false, 'second delete should fail');
  console.assert(table.has('banana') === false, 'banana should be gone after delete');
  console.assert(table.size === 2, 'size should reflect apple and cherry only');

  // Force enough inserts to trigger at least one resize past load factor 0.75.
  const grown = new SimpleHashTable<number>(4);
  for (let i = 0; i < 20; i++) grown.set(`key-${i}`, i);
  console.assert(grown.size === 20, 'all 20 keys should be stored after resizing');
  for (let i = 0; i < 20; i++) {
    console.assert(grown.get(`key-${i}`) === i, `key-${i} should survive resize with correct value`);
  }

  console.assert(largestBucketSize(table) >= 1, 'largest bucket should have at least one entry');
  console.assert(
    anagramsHashDifferently('act', 'cat', 97) === true,
    'act and cat should hash to different buckets since position affects the polynomial hash'
  );

  console.log('01-hash-table-fundamentals: all assertions passed');
}
