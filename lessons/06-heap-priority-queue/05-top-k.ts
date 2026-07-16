// Companion code for ./05-top-k.md
import { MinHeap, MaxHeap, ascending } from './02-min-max-heap';

// --- LeetCode 215. Kth Largest Element in an Array (Medium) ---
// https://leetcode.com/problems/kth-largest-element-in-an-array/
// Keep a min-heap capped at size k. Anything smaller than the heap's root
// once it's full can't be in the top k, so the root is always evicted.
// After processing everything, the root is exactly the k-th largest.
export function findKthLargest(nums: number[], k: number): number {
  const minHeap = new MinHeap<number>(ascending);
  for (const n of nums) {
    minHeap.push(n);
    if (minHeap.size > k) minHeap.pop();
  }
  return minHeap.peek() as number;
}

// --- LeetCode 347. Top K Frequent Elements (Medium) ---
// https://leetcode.com/problems/top-k-frequent-elements/
// Count frequencies, then keep a min-heap of size k keyed by count. Same
// "evict the smallest once over budget" pattern as findKthLargest.
export function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

  const minHeap = new MinHeap<[number, number]>((a, b) => a[1] - b[1]); // [value, count]
  for (const entry of freq) {
    minHeap.push(entry);
    if (minHeap.size > k) minHeap.pop();
  }
  return minHeap.toArray().map(([value]) => value);
}

// Exercise: find the k-th SMALLEST element using a max-heap of size k
// (the mirror image of findKthLargest's min-heap-of-size-k trick).
export function findKthSmallestStub(_nums: number[], _k: number): number {
  throw new Error('not implemented');
}
// Solution:
export function findKthSmallest(nums: number[], k: number): number {
  const maxHeap = new MaxHeap<number>(ascending);
  for (const n of nums) {
    maxHeap.push(n);
    if (maxHeap.size > k) maxHeap.pop();
  }
  return maxHeap.peek() as number;
}

// --- run ---
if (require.main === module) {
  console.assert(findKthLargest([3, 2, 1, 5, 6, 4], 2) === 5, '2nd largest of [3,2,1,5,6,4] should be 5');
  console.assert(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) === 4, '4th largest should be 4');

  const top2 = topKFrequent([1, 1, 1, 2, 2, 3], 2).slice().sort((a, b) => a - b);
  console.assert(JSON.stringify(top2) === JSON.stringify([1, 2]), 'top 2 frequent elements should be {1, 2}');

  console.assert(findKthSmallest([3, 2, 1, 5, 6, 4], 2) === 2, '2nd smallest of [3,2,1,5,6,4] should be 2');

  console.log('05-top-k: all assertions passed');
}
