// Companion code for ./04-monotonic-queue.md

import { Deque } from './03-deque';

// LeetCode 239: Sliding Window Maximum (Hard)
// Maintain a Deque<number> of indices whose values are strictly
// decreasing front-to-back. The front index is always the maximum of the
// current window because anything smaller and further back was already
// evicted before it could become the answer.
export function maxSlidingWindow(nums: number[], k: number): number[] {
  const result: number[] = [];
  const indices = new Deque<number>();

  for (let i = 0; i < nums.length; i++) {
    while (indices.size > 0 && nums[indices.peekBack() as number] <= nums[i]) {
      indices.popBack();
    }
    indices.pushBack(i);

    if ((indices.peekFront() as number) <= i - k) {
      indices.popFront();
    }

    if (i >= k - 1) {
      result.push(nums[indices.peekFront() as number]);
    }
  }

  return result;
}

// LeetCode 1438: Longest Continuous Subarray With Absolute Diff <= Limit (Medium)
// Two monotonic deques track the current window's max (decreasing) and
// min (increasing) candidates by index. Whenever max - min exceeds the
// limit, shrink the window from the left and drop any indices that fell
// out of range from the front of either deque.
export function longestSubarray(nums: number[], limit: number): number {
  const maxDeque = new Deque<number>();
  const minDeque = new Deque<number>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < nums.length; right++) {
    while (maxDeque.size > 0 && nums[maxDeque.peekBack() as number] <= nums[right]) {
      maxDeque.popBack();
    }
    maxDeque.pushBack(right);

    while (minDeque.size > 0 && nums[minDeque.peekBack() as number] >= nums[right]) {
      minDeque.popBack();
    }
    minDeque.pushBack(right);

    while (nums[maxDeque.peekFront() as number] - nums[minDeque.peekFront() as number] > limit) {
      left++;
      if ((maxDeque.peekFront() as number) < left) maxDeque.popFront();
      if ((minDeque.peekFront() as number) < left) minDeque.popFront();
    }

    best = Math.max(best, right - left + 1);
  }

  return best;
}

// Exercise: for every window of size k, return the first negative number
// (or 0 if the window has none), using a deque of candidate indices.
// Solution:
export function firstNegativeInWindow(nums: number[], k: number): number[] {
  const result: number[] = [];
  const negatives = new Deque<number>();

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < 0) negatives.pushBack(i);

    if (!negatives.isEmpty() && (negatives.peekFront() as number) <= i - k) {
      negatives.popFront();
    }

    if (i >= k - 1) {
      result.push(negatives.isEmpty() ? 0 : nums[negatives.peekFront() as number]);
    }
  }

  return result;
}

// --- run ---
if (require.main === module) {
  console.assert(
    JSON.stringify(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)) ===
      JSON.stringify([3, 3, 5, 5, 6, 7]),
    'LeetCode 239 example'
  );

  console.assert(longestSubarray([8, 2, 4, 7], 4) === 2, 'LeetCode 1438 example');

  console.assert(
    JSON.stringify(firstNegativeInWindow([-8, 2, 3, -6, 10], 2)) ===
      JSON.stringify([-8, 0, -6, -6]),
    'first negative per window'
  );

  console.log('All lesson 04 checks passed.');
}
