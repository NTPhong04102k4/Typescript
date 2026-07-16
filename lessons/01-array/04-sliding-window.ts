// Companion code for ./04-sliding-window.md

/** Fixed-size window: the maximum sum of any contiguous run of length k. */
export function fixedWindowMaxSum(arr: readonly number[], k: number): number {
  if (k <= 0 || k > arr.length) return 0;

  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];

  let maxSum = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}

// LeetCode 209: Minimum Size Subarray Sum.
// Variable-size window: expand right, shrink left while the sum is still
// large enough, tracking the shortest valid window seen.
export function minSubArrayLen(target: number, nums: readonly number[]): number {
  let left = 0;
  let sum = 0;
  let best = Infinity;

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      sum -= nums[left];
      left++;
    }
  }

  return best === Infinity ? 0 : best;
}

// Exercise: implement LeetCode 1004, Max Consecutive Ones III -- the
// longest subarray of 1s obtainable after flipping at most k zeros.
// Solution:
export function maxConsecutiveOnesIII(nums: readonly number[], k: number): number {
  let left = 0;
  let zeroCount = 0;
  let best = 0;

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeroCount++;
    while (zeroCount > k) {
      if (nums[left] === 0) zeroCount--;
      left++;
    }
    best = Math.max(best, right - left + 1);
  }

  return best;
}

// Exercise: implement LeetCode 643, Maximum Average Subarray I -- the
// maximum average of any contiguous subarray of length k.
// Solution:
export function findMaxAverage(nums: readonly number[], k: number): number {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];

  let maxSum = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum / k;
}

// --- run ---
if (require.main === module) {
  console.assert(fixedWindowMaxSum([2, 1, 5, 1, 3, 2], 3) === 9, 'best width-3 window is [5,1,3] = 9');

  console.assert(minSubArrayLen(7, [2, 3, 1, 2, 4, 3]) === 2, 'shortest subarray with sum >= 7 has length 2 ([4,3])');
  console.assert(minSubArrayLen(100, [1, 2, 3]) === 0, 'no subarray reaches sum 100, so the answer is 0');

  console.assert(
    maxConsecutiveOnesIII([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2) === 6,
    'flipping 2 zeros yields a run of length 6'
  );

  console.assert(findMaxAverage([1, 12, -5, -6, 50, 3], 4) === 12.75, 'max average of any width-4 window is 12.75');

  console.log('All lesson 04 checks passed.');
}
