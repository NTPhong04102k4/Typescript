// Companion code for ./09-kadane-subarray.md

// LeetCode 53: Maximum Subarray (Kadane's algorithm).
// At each index, either extend the running subarray or start fresh.
export function maxSubArray(nums: readonly number[]): number {
  let currentMax = nums[0];
  let best = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    best = Math.max(best, currentMax);
  }

  return best;
}

// Exercise: implement LeetCode 152, Maximum Product Subarray -- like
// Kadane's, but track both a running max and running min, since a
// negative number can turn the smallest product into the largest.
// Solution:
export function maxProductSubarray(nums: readonly number[]): number {
  let currentMax = nums[0];
  let currentMin = nums[0];
  let best = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    if (num < 0) {
      [currentMax, currentMin] = [currentMin, currentMax];
    }
    currentMax = Math.max(num, currentMax * num);
    currentMin = Math.min(num, currentMin * num);
    best = Math.max(best, currentMax);
  }

  return best;
}

// Exercise: implement LeetCode 121, Best Time to Buy and Sell Stock --
// track the minimum price seen so far and the best profit achievable by
// selling on the current day.
// Solution:
export function maxProfit(prices: readonly number[]): number {
  let minPriceSoFar = Infinity;
  let bestProfit = 0;

  for (const price of prices) {
    minPriceSoFar = Math.min(minPriceSoFar, price);
    bestProfit = Math.max(bestProfit, price - minPriceSoFar);
  }

  return bestProfit;
}

// --- run ---
if (require.main === module) {
  console.assert(
    maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) === 6,
    'the best contiguous subarray [4, -1, 2, 1] sums to 6'
  );

  console.assert(maxProductSubarray([2, 3, -2, 4]) === 6, 'the best product subarray [2, 3] is 6');
  console.assert(maxProductSubarray([-2, 0, -1]) === 0, 'a zero breaks any negative run, so the best is 0');

  console.assert(maxProfit([7, 1, 5, 3, 6, 4]) === 5, 'buying at 1 and selling at 6 yields a profit of 5');
  console.assert(maxProfit([7, 6, 4, 3, 1]) === 0, 'a strictly falling price series yields 0 profit');

  console.log('All lesson 09 checks passed.');
}
