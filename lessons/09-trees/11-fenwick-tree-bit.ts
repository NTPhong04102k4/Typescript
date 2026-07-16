// Companion code for ./11-fenwick-tree-bit.md
//
// A Fenwick tree (Binary Indexed Tree, BIT) is a compact array-backed
// structure for prefix sums with O(log n) point update and prefix query.
// It is 1-indexed internally: index 0 is a dummy slot so the low-bit trick
// `i & -i` works. No TreeNode here — the "tree" is implicit in the bits.

/**
 * Fenwick tree / Binary Indexed Tree over n slots (0-indexed to callers).
 * Each internal index i is "responsible" for a contiguous block of
 * `i & -i` elements ending at i, which is what makes both update and query
 * walk only O(log n) indices.
 */
export class FenwickTree {
  private readonly n: number;
  private readonly tree: number[];

  constructor(size: number) {
    this.n = size;
    this.tree = new Array<number>(size + 1).fill(0); // index 0 unused
  }

  /** Build directly from initial values (0-indexed), O(n). */
  static fromArray(values: readonly number[]): FenwickTree {
    const fenwick = new FenwickTree(values.length);
    for (let i = 0; i < values.length; i++) {
      fenwick.add(i, values[i]);
    }
    return fenwick;
  }

  /** Add `delta` to position `index` (0-indexed). */
  add(index: number, delta: number): void {
    if (index < 0 || index >= this.n) throw new RangeError(`index ${index} out of bounds`);
    // Walk upward: jump by the lowest set bit each step.
    for (let i = index + 1; i <= this.n; i += i & -i) {
      this.tree[i] += delta;
    }
  }

  /** Sum of positions [0 .. index] inclusive (0-indexed). */
  prefixSum(index: number): number {
    if (index < 0) return 0;
    const capped = Math.min(index, this.n - 1);
    let total = 0;
    // Walk downward: strip the lowest set bit each step.
    for (let i = capped + 1; i > 0; i -= i & -i) {
      total += this.tree[i];
    }
    return total;
  }

  /** Sum of the inclusive range [from, to] (0-indexed). */
  rangeSum(from: number, to: number): number {
    if (from > to) return 0;
    return this.prefixSum(to) - this.prefixSum(from - 1);
  }

  /** Set position `index` to `value` (computes the delta and applies it). */
  set(index: number, value: number): void {
    const current = this.rangeSum(index, index);
    this.add(index, value - current);
  }
}

// Exercise: given an array, return the number of inversions
// (pairs i < j with values[i] > values[j]) using a Fenwick tree over ranks.
// Assume values are a permutation of 0..n-1 for simplicity.
export function countInversionsStub(_values: readonly number[]): number {
  throw new Error('not implemented');
}
// Solution:
export function countInversions(values: readonly number[]): number {
  const fenwick = new FenwickTree(values.length);
  let inversions = 0;
  // Scan right to left; for each value count how many smaller values
  // have already been seen to its right.
  for (let i = values.length - 1; i >= 0; i--) {
    const v = values[i];
    if (v > 0) inversions += fenwick.prefixSum(v - 1);
    fenwick.add(v, 1);
  }
  return inversions;
}

// --- LeetCode 307. Range Sum Query - Mutable (Medium) ---
// https://leetcode.com/problems/range-sum-query-mutable/
// The same problem lesson 10 solves with a segment tree, here with a BIT.
export class NumArray {
  private readonly fenwick: FenwickTree;

  constructor(nums: number[]) {
    this.fenwick = FenwickTree.fromArray(nums);
  }

  update(index: number, val: number): void {
    this.fenwick.set(index, val);
  }

  sumRange(left: number, right: number): number {
    return this.fenwick.rangeSum(left, right);
  }
}

// --- run ---
if (require.main === module) {
  const values = [2, 1, 5, 3, 4]; // indices 0..4

  const fenwick = FenwickTree.fromArray(values);
  console.assert(fenwick.prefixSum(4) === 15, 'prefixSum(4) is 15 (whole array)');
  console.assert(fenwick.prefixSum(0) === 2, 'prefixSum(0) is 2 (first element)');
  console.assert(fenwick.rangeSum(1, 3) === 9, 'rangeSum(1,3) (1+5+3) is 9');
  console.assert(fenwick.rangeSum(2, 2) === 5, 'single-element rangeSum is that element');

  fenwick.add(2, 5); // [2, 1, 10, 3, 4]
  console.assert(fenwick.rangeSum(1, 3) === 14, 'after add, rangeSum(1,3) (1+10+3) is 14');

  fenwick.set(2, 5); // back to [2, 1, 5, 3, 4]
  console.assert(fenwick.rangeSum(1, 3) === 9, 'after set, rangeSum(1,3) is 9 again');

  console.assert(countInversions([0, 1, 2, 3]) === 0, 'sorted array has 0 inversions');
  console.assert(countInversions([3, 2, 1, 0]) === 6, 'reversed array of 4 has 6 inversions');
  console.assert(countInversions([2, 0, 1]) === 2, 'inversions of [2,0,1] are (2,0) and (2,1) = 2');

  const na = new NumArray([1, 3, 5]);
  console.assert(na.sumRange(0, 2) === 9, 'LC307: initial sumRange(0,2) is 9');
  na.update(1, 2); // [1, 2, 5]
  console.assert(na.sumRange(0, 2) === 8, 'LC307: after update sumRange(0,2) is 8');

  console.log('11-fenwick-tree-bit: all assertions passed');
}
