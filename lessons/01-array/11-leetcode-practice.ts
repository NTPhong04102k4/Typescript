// Companion code for ./11-leetcode-practice.md
// Eight classic array problems, Easy -> Hard, each a standalone solution.

// 1. Two Sum (Easy) -- single-pass hash map.
export function twoSum(nums: readonly number[], target: number): number[] {
  const seenAt = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    const complementIndex = seenAt.get(complement);
    if (complementIndex !== undefined) {
      return [complementIndex, i];
    }
    seenAt.set(nums[i], i);
  }
  return [];
}

// 121. Best Time to Buy and Sell Stock (Easy) -- running min price + best profit.
export function maxProfit(prices: readonly number[]): number {
  let minPriceSoFar = Infinity;
  let bestProfit = 0;
  for (const price of prices) {
    minPriceSoFar = Math.min(minPriceSoFar, price);
    bestProfit = Math.max(bestProfit, price - minPriceSoFar);
  }
  return bestProfit;
}

// 238. Product of Array Except Self (Medium) -- running prefix then suffix product.
export function productExceptSelf(nums: readonly number[]): number[] {
  const n = nums.length;
  const result: number[] = new Array(n).fill(1);

  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }

  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }

  return result;
}

// 15. 3Sum (Medium) -- sort, then converging two pointers per fixed index.
export function threeSum(nums: readonly number[]): number[][] {
  const sorted = [...nums].sort((a, b) => a - b);
  const result: number[][] = [];
  const n = sorted.length;

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue;
    if (sorted[i] > 0) break;

    let left = i + 1;
    let right = n - 1;
    while (left < right) {
      const sum = sorted[i] + sorted[left] + sorted[right];
      if (sum === 0) {
        result.push([sorted[i], sorted[left], sorted[right]]);
        while (left < right && sorted[left] === sorted[left + 1]) left++;
        while (left < right && sorted[right] === sorted[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

// 11. Container With Most Water (Medium) -- converging pointers, move the shorter wall.
export function maxArea(height: readonly number[]): number {
  let left = 0;
  let right = height.length - 1;
  let best = 0;

  while (left < right) {
    const width = right - left;
    const boundingHeight = Math.min(height[left], height[right]);
    best = Math.max(best, width * boundingHeight);

    if (height[left] < height[right]) left++;
    else right--;
  }

  return best;
}

// 56. Merge Intervals (Medium) -- sort by start, extend or start a new run.
export function mergeIntervals(intervals: readonly (readonly number[])[]): number[][] {
  if (intervals.length === 0) return [];

  const sorted = [...intervals].map((interval) => [...interval]).sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

/** Reverse nums[left..right] in place -- helper for rotateArray. */
function reverseSubrange(nums: number[], left: number, right: number): void {
  let l = left;
  let r = right;
  while (l < r) {
    const tmp = nums[l];
    nums[l] = nums[r];
    nums[r] = tmp;
    l++;
    r--;
  }
}

// 189. Rotate Array (Medium) -- three in-place reversals.
export function rotateArray(nums: number[], k: number): void {
  const n = nums.length;
  if (n === 0) return;

  const shift = ((k % n) + n) % n;
  reverseSubrange(nums, 0, n - 1);
  reverseSubrange(nums, 0, shift - 1);
  reverseSubrange(nums, shift, n - 1);
}

// 42. Trapping Rain Water (Hard) -- converging pointers tracking left/right max walls.
export function trap(height: readonly number[]): number {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  while (left < right) {
    if (height[left] <= height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
      right--;
    }
  }

  return water;
}

// Exercise: given the eight solutions above, implement a ninth small
// helper: canFormNonNegativeProfit(prices), which reports whether any
// profitable trade exists at all (a yes/no wrapper around maxProfit).
// Solution:
export function canFormNonNegativeProfit(prices: readonly number[]): boolean {
  return maxProfit(prices) > 0;
}

// --- run ---
if (require.main === module) {
  console.assert(JSON.stringify(twoSum([2, 7, 11, 15], 9)) === JSON.stringify([0, 1]), 'twoSum should find [0, 1]');

  console.assert(maxProfit([7, 1, 5, 3, 6, 4]) === 5, 'maxProfit should find a best profit of 5');

  console.assert(
    JSON.stringify(productExceptSelf([1, 2, 3, 4])) === JSON.stringify([24, 12, 8, 6]),
    'productExceptSelf should compute [24, 12, 8, 6]'
  );

  console.assert(
    JSON.stringify(threeSum([-1, 0, 1, 2, -1, -4])) === JSON.stringify([[-1, -1, 2], [-1, 0, 1]]),
    'threeSum should find the two unique zero-sum triplets'
  );

  console.assert(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) === 49, 'maxArea should find the best container area of 49');

  console.assert(
    JSON.stringify(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]])) === JSON.stringify([[1, 6], [8, 10], [15, 18]]),
    'mergeIntervals should merge overlapping ranges'
  );

  const rotated = [1, 2, 3, 4, 5, 6, 7];
  rotateArray(rotated, 3);
  console.assert(JSON.stringify(rotated) === JSON.stringify([5, 6, 7, 1, 2, 3, 4]), 'rotateArray should rotate right by 3');

  console.assert(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) === 6, 'trap should compute 6 units of trapped water');

  console.assert(canFormNonNegativeProfit([7, 1, 5, 3, 6, 4]) === true, 'a profitable trade exists in this series');
  console.assert(canFormNonNegativeProfit([7, 6, 4, 3, 1]) === false, 'no profitable trade exists in a falling series');

  console.log('All lesson 11 checks passed.');
}
