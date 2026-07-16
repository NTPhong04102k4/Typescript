// Companion code for ./07-median-two-heaps.md
import { MinHeap, MaxHeap, ascending } from './02-min-max-heap';

// --- LeetCode 295. Find Median from Data Stream (Hard) ---
// https://leetcode.com/problems/find-median-from-data-stream/
// Split the stream into two halves around the median: `lower` is a
// max-heap holding the smaller half (root = the largest "low" value) and
// `upper` is a min-heap holding the larger half (root = the smallest
// "high" value). Keeping the two heaps within one element of each
// other's size means the median is always readable in O(1) from their
// roots, with no scan required.
export class MedianFinder {
  private readonly lower = new MaxHeap<number>(ascending); // smaller half, root = its max
  private readonly upper = new MinHeap<number>(ascending); // larger half, root = its min

  addNum(num: number): void {
    if (this.lower.isEmpty() || num <= (this.lower.peek() as number)) {
      this.lower.push(num);
    } else {
      this.upper.push(num);
    }

    // Rebalance so the two halves never differ by more than one element,
    // with `lower` holding the extra element when the total count is odd.
    if (this.lower.size > this.upper.size + 1) {
      this.upper.push(this.lower.pop() as number);
    } else if (this.upper.size > this.lower.size) {
      this.lower.push(this.upper.pop() as number);
    }
  }

  findMedian(): number {
    if (this.lower.size > this.upper.size) return this.lower.peek() as number;
    return ((this.lower.peek() as number) + (this.upper.peek() as number)) / 2;
  }
}

// Exercise: given a full array of numbers, return the running median
// after each insertion -- a thin wrapper around MedianFinder that most
// interview follow-ups ask for once the class itself works.
export function streamMedianStub(_nums: readonly number[]): number[] {
  throw new Error('not implemented');
}
// Solution:
export function streamMedian(nums: readonly number[]): number[] {
  const finder = new MedianFinder();
  const medians: number[] = [];
  for (const n of nums) {
    finder.addNum(n);
    medians.push(finder.findMedian());
  }
  return medians;
}

// --- run ---
if (require.main === module) {
  // Hand-traced sequence: insert 1, 2, 3, 8, 9, 4 and check the median
  // after each step against the sorted-array median of what's been seen.
  const mf = new MedianFinder();

  mf.addNum(1);
  console.assert(mf.findMedian() === 1, 'median of {1} should be 1');

  mf.addNum(2);
  console.assert(mf.findMedian() === 1.5, 'median of {1,2} should be 1.5');

  mf.addNum(3);
  console.assert(mf.findMedian() === 2, 'median of {1,2,3} should be 2');

  mf.addNum(8);
  console.assert(mf.findMedian() === 2.5, 'median of {1,2,3,8} should be 2.5');

  mf.addNum(9);
  console.assert(mf.findMedian() === 3, 'median of {1,2,3,8,9} should be 3');

  mf.addNum(4);
  console.assert(mf.findMedian() === 3.5, 'median of {1,2,3,4,8,9} should be 3.5');

  console.assert(
    JSON.stringify(streamMedian([1, 2, 3, 8, 9, 4])) === JSON.stringify([1, 1.5, 2, 2.5, 3, 3.5]),
    'streamMedian must report the running median after every insertion'
  );

  console.log('07-median-two-heaps: all assertions passed');
}
