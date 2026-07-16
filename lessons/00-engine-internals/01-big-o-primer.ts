// Companion code for ./01-big-o-primer.md
import { performance } from 'perf_hooks';

/** O(1): array index access never touches more than one memory cell. */
export function constantAccess<T>(arr: readonly T[], index: number): T | undefined {
  return arr[index];
}

/** O(log n): binary search on a sorted numeric array. */
export function binarySearch(sortedArr: readonly number[], target: number): number {
  let lo = 0;
  let hi = sortedArr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const value = sortedArr[mid];
    if (value === target) return mid;
    if (value < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

/** O(n): unsorted linear scan. */
export function linearSearch<T>(arr: readonly T[], target: T): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

/** O(n^2): counts pairs (i < j) whose values sum to zero via nested loops. */
export function quadraticZeroSumPairCount(arr: readonly number[]): number {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === 0) count++;
    }
  }
  return count;
}

/** Runs `fn` once and returns elapsed milliseconds via performance.now(). */
export function timeIt(fn: () => void): number {
  const start = performance.now();
  fn();
  return performance.now() - start;
}

// --- LeetCode 1. Two Sum (Easy) ---
// https://leetcode.com/problems/two-sum/

/** O(n^2): brute-force nested loop over all pairs. */
export function twoSumBruteForce(nums: readonly number[], target: number): [number, number] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  throw new Error('No two-sum solution exists');
}

/** O(n): single pass using a hash map of value -> index. */
export function twoSumHashMap(nums: readonly number[], target: number): [number, number] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    const j = seen.get(complement);
    if (j !== undefined) return [j, i];
    seen.set(nums[i], i);
  }
  throw new Error('No two-sum solution exists');
}

// --- LeetCode 217. Contains Duplicate (Easy) ---
// https://leetcode.com/problems/contains-duplicate/

/** O(n^2): compare every pair of elements. */
export function containsDuplicateBrute(nums: readonly number[]): boolean {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}

/** O(n): a Set gives O(1) amortized membership checks. */
export function containsDuplicateSet(nums: readonly number[]): boolean {
  const seen = new Set<number>();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}

// --- LeetCode 121. Best Time to Buy and Sell Stock (Easy) ---
// https://leetcode.com/problems/best-time-to-buy-and-sell-stock/

/** O(n^2): try every buy/sell pair. */
export function maxProfitBrute(prices: readonly number[]): number {
  let best = 0;
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      best = Math.max(best, prices[j] - prices[i]);
    }
  }
  return best;
}

/** O(n): track the minimum price seen so far in one pass. */
export function maxProfitOnePass(prices: readonly number[]): number {
  let minPrice = Infinity;
  let best = 0;
  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    best = Math.max(best, price - minPrice);
  }
  return best;
}

// Exercise: Big-O is about the shape of growth, not one clever trick.
// Replace the O(n) loop below with an O(1) closed-form computation of
// 1 + 2 + ... + n (Gauss's formula), keeping the same signature.
export function sumRangeLoop(n: number): number {
  let total = 0;
  for (let i = 1; i <= n; i++) total += i;
  return total;
}
// Solution:
export function sumRangeClosedForm(n: number): number {
  return (n * (n + 1)) / 2;
}

// Exercise: Implement LeetCode 35 "Search Insert Position" (Easy) in O(log n):
// given a sorted array and a target, return the index where target is found,
// or the index where it would be inserted to keep the array sorted.
export function searchInsertPositionStub(_sortedArr: readonly number[], _target: number): number {
  throw new Error('not implemented');
}
// Solution:
export function searchInsertPosition(sortedArr: readonly number[], target: number): number {
  let lo = 0;
  let hi = sortedArr.length; // insertion point can be one past the end
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (sortedArr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// --- run ---
if (require.main === module) {
  const sorted = Array.from({ length: 10_000 }, (_, i) => i * 2); // [0, 2, 4, ...]

  console.assert(binarySearch(sorted, 5000) === 2500, 'binarySearch should find 5000 at index 2500');
  console.assert(binarySearch(sorted, 3) === -1, 'binarySearch should miss odd numbers');
  console.assert(linearSearch(sorted, 5000) === 2500, 'linearSearch should agree with binarySearch');

  const linearTime = timeIt(() => linearSearch(sorted, sorted[sorted.length - 1]));
  const binaryTime = timeIt(() => binarySearch(sorted, sorted[sorted.length - 1]));
  console.log(`linearSearch worst-case: ${linearTime.toFixed(3)}ms`);
  console.log(`binarySearch worst-case: ${binaryTime.toFixed(3)}ms`);

  const pairs = [1, -1, 2, -2, 3];
  console.assert(quadraticZeroSumPairCount(pairs) === 2, 'expected two zero-sum pairs: (1,-1) and (2,-2)');

  console.assert(
    JSON.stringify(twoSumBruteForce([2, 7, 11, 15], 9)) === JSON.stringify(twoSumHashMap([2, 7, 11, 15], 9)),
    'twoSum brute force and hash map must agree'
  );

  console.assert(containsDuplicateBrute([1, 2, 3, 1]) === true, 'brute duplicate check failed');
  console.assert(containsDuplicateSet([1, 2, 3, 1]) === true, 'set duplicate check failed');
  console.assert(containsDuplicateSet([1, 2, 3]) === false, 'set should report no duplicates');

  console.assert(maxProfitBrute([7, 1, 5, 3, 6, 4]) === 5, 'brute max profit should be 5');
  console.assert(maxProfitOnePass([7, 1, 5, 3, 6, 4]) === 5, 'one-pass max profit should be 5');

  console.assert(sumRangeLoop(100) === 5050, 'sum 1..100 should be 5050');
  console.assert(sumRangeClosedForm(100) === 5050, 'closed form must match the loop');
  console.assert(sumRangeClosedForm(10_000) === sumRangeLoop(10_000), 'closed form must match loop at scale');

  console.assert(searchInsertPosition([1, 3, 5, 6], 5) === 2, 'exact match should return its index');
  console.assert(searchInsertPosition([1, 3, 5, 6], 2) === 1, 'insert position for 2 should be 1');
  console.assert(searchInsertPosition([1, 3, 5, 6], 7) === 4, 'insert position past the end should be length');

  console.log('01-big-o-primer: all assertions passed');
}
