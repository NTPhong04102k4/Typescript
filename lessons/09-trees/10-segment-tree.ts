// Companion code for ./10-segment-tree.md
//
// Segment trees are array-backed (like a binary heap): a node at index i
// owns children at 2i+1 and 2i+2, so this lesson defines no TreeNode and is
// fully self-contained. Two variants share the same shape: range-sum and
// range-min. The combine function is the only thing that differs.

/** How two child aggregates merge into their parent's aggregate. */
type Combine = (left: number, right: number) => number;

/**
 * Array-backed segment tree over a fixed-size numeric array. Supports point
 * update and range query in O(log n). `identity` is the neutral element for
 * `combine` (0 for sum, +Infinity for min) so out-of-range branches don't
 * pollute the answer.
 */
export class SegmentTree {
  private readonly n: number;
  private readonly tree: number[];
  private readonly combine: Combine;
  private readonly identity: number;

  constructor(values: readonly number[], combine: Combine, identity: number) {
    this.n = values.length;
    this.combine = combine;
    this.identity = identity;
    // A safe upper bound on nodes for an n-leaf tree is 4n.
    this.tree = new Array<number>(Math.max(1, 4 * this.n)).fill(identity);
    if (this.n > 0) this.build(values, 0, 0, this.n - 1);
  }

  /** Recursively fill node `nodeIndex`, which covers leaves [lo, hi]. */
  private build(values: readonly number[], nodeIndex: number, lo: number, hi: number): void {
    if (lo === hi) {
      this.tree[nodeIndex] = values[lo];
      return;
    }
    const mid = lo + Math.floor((hi - lo) / 2);
    const left = 2 * nodeIndex + 1;
    const right = 2 * nodeIndex + 2;
    this.build(values, left, lo, mid);
    this.build(values, right, mid + 1, hi);
    this.tree[nodeIndex] = this.combine(this.tree[left], this.tree[right]);
  }

  /** Set position `pos` (0-indexed in the original array) to `value`. */
  update(pos: number, value: number): void {
    if (pos < 0 || pos >= this.n) throw new RangeError(`pos ${pos} out of bounds`);
    this.updateAt(0, 0, this.n - 1, pos, value);
  }

  private updateAt(nodeIndex: number, lo: number, hi: number, pos: number, value: number): void {
    if (lo === hi) {
      this.tree[nodeIndex] = value;
      return;
    }
    const mid = lo + Math.floor((hi - lo) / 2);
    const left = 2 * nodeIndex + 1;
    const right = 2 * nodeIndex + 2;
    if (pos <= mid) {
      this.updateAt(left, lo, mid, pos, value);
    } else {
      this.updateAt(right, mid + 1, hi, pos, value);
    }
    this.tree[nodeIndex] = this.combine(this.tree[left], this.tree[right]);
  }

  /** Aggregate (sum or min) over the inclusive range [from, to]. */
  query(from: number, to: number): number {
    if (this.n === 0) return this.identity;
    if (from > to) return this.identity;
    return this.queryRange(0, 0, this.n - 1, from, to);
  }

  private queryRange(nodeIndex: number, lo: number, hi: number, from: number, to: number): number {
    // No overlap: contribute the identity element.
    if (to < lo || hi < from) return this.identity;
    // Total overlap: this node's aggregate is fully inside the query.
    if (from <= lo && hi <= to) return this.tree[nodeIndex];
    // Partial overlap: split.
    const mid = lo + Math.floor((hi - lo) / 2);
    const leftResult = this.queryRange(2 * nodeIndex + 1, lo, mid, from, to);
    const rightResult = this.queryRange(2 * nodeIndex + 2, mid + 1, hi, from, to);
    return this.combine(leftResult, rightResult);
  }
}

/** Convenience factory: a range-sum segment tree (identity 0). */
export function buildSumTree(values: readonly number[]): SegmentTree {
  return new SegmentTree(values, (a, b) => a + b, 0);
}

/** Convenience factory: a range-min segment tree (identity +Infinity). */
export function buildMinTree(values: readonly number[]): SegmentTree {
  return new SegmentTree(values, (a, b) => Math.min(a, b), Infinity);
}

// Exercise: build a range-max segment tree and return the max over [from, to].
export function rangeMaxStub(_values: readonly number[], _from: number, _to: number): number {
  throw new Error('not implemented');
}
// Solution:
export function rangeMax(values: readonly number[], from: number, to: number): number {
  const tree = new SegmentTree(values, (a, b) => Math.max(a, b), -Infinity);
  return tree.query(from, to);
}

// --- LeetCode 307. Range Sum Query - Mutable (Medium) ---
// https://leetcode.com/problems/range-sum-query-mutable/
// A thin wrapper over the range-sum segment tree: update() sets a value,
// sumRange() queries an inclusive range.
export class NumArray {
  private readonly tree: SegmentTree;

  constructor(nums: number[]) {
    this.tree = buildSumTree(nums);
  }

  update(index: number, val: number): void {
    this.tree.update(index, val);
  }

  sumRange(left: number, right: number): number {
    return this.tree.query(left, right);
  }
}

// --- run ---
if (require.main === module) {
  const values = [2, 1, 5, 3, 4]; // indices 0..4

  const sum = buildSumTree(values);
  console.assert(sum.query(0, 4) === 15, 'sum of whole array is 15');
  console.assert(sum.query(1, 3) === 9, 'sum of [1..3] (1+5+3) is 9');
  console.assert(sum.query(2, 2) === 5, 'single-element sum is that element');
  sum.update(2, 10); // [2, 1, 10, 3, 4]
  console.assert(sum.query(1, 3) === 14, 'after update, sum of [1..3] (1+10+3) is 14');
  console.assert(sum.query(0, 4) === 20, 'after update, whole-array sum is 20');

  const min = buildMinTree(values);
  console.assert(min.query(0, 4) === 1, 'min of whole array is 1');
  console.assert(min.query(2, 4) === 3, 'min of [2..4] (5,3,4) is 3');
  min.update(1, 9); // [2, 9, 5, 3, 4]
  console.assert(min.query(0, 2) === 2, 'after update, min of [0..2] (2,9,5) is 2');

  console.assert(rangeMax(values, 0, 4) === 5, 'max of whole array is 5');
  console.assert(rangeMax(values, 0, 1) === 2, 'max of [0..1] (2,1) is 2');

  const na = new NumArray([1, 3, 5]);
  console.assert(na.sumRange(0, 2) === 9, 'LC307: initial sumRange(0,2) is 9');
  na.update(1, 2); // [1, 2, 5]
  console.assert(na.sumRange(0, 2) === 8, 'LC307: after update sumRange(0,2) is 8');

  const empty = buildSumTree([]);
  console.assert(empty.query(0, 0) === 0, 'empty tree query returns identity 0');

  console.log('10-segment-tree: all assertions passed');
}
