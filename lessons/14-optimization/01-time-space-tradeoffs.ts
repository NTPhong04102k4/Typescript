// Companion code for ./01-time-space-tradeoffs.md
//
// The recurring optimization move: spend memory to buy time. A brute-force
// solution recomputes the same work over and over; an optimized one records
// results (in a hash map, a set, or a precomputed prefix array) so each
// answer is looked up in O(1) instead of recomputed in O(n).

/**
 * Brute-force two-sum: for every pair (i, j), check if they add up to target.
 * O(n^2) time, O(1) extra space. Returns the first pair of indices or null.
 */
export function twoSumBrute(
  nums: readonly number[],
  target: number,
): [number, number] | null {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return null;
}

/**
 * Optimized two-sum: one pass, remembering each value's index in a Map so the
 * "does the complement exist?" question is an O(1) lookup instead of an inner
 * loop. O(n) time, O(n) space — the classic space-for-time trade.
 */
export function twoSumHashed(
  nums: readonly number[],
  target: number,
): [number, number] | null {
  const seen = new Map<number, number>(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    const j = seen.get(complement);
    if (j !== undefined) return [j, i];
    seen.set(nums[i], i);
  }
  return null;
}

/**
 * Prefix-sum array: prefix[i] holds the sum of nums[0..i-1], so prefix has
 * length n+1 with prefix[0] = 0. Precomputing it once in O(n) turns any later
 * range-sum query into an O(1) subtraction. This is precomputation: pay O(n)
 * up front to make each of q queries O(1) instead of O(n) (O(n + q) vs O(nq)).
 */
export function buildPrefixSum(nums: readonly number[]): number[] {
  const prefix = new Array<number>(nums.length + 1);
  prefix[0] = 0;
  for (let i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  return prefix;
}

/** Sum of nums[left..right] inclusive, in O(1), given a prefix array from buildPrefixSum. */
export function rangeSum(
  prefix: readonly number[],
  left: number,
  right: number,
): number {
  return prefix[right + 1] - prefix[left];
}

// Exercise: return true if any value appears at least twice, in O(n) time.
// (The brute-force O(n^2) version compares every pair; trade space for time.)
export function hasDuplicateStub(_nums: readonly number[]): boolean {
  throw new Error("not implemented");
}
// Solution:
export function hasDuplicate(nums: readonly number[]): boolean {
  const seen = new Set<number>();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}

// Exercise: count how many contiguous subarrays sum exactly to k, in O(n).
// Hint: a prefix sum plus a hash map of prefix-frequency-so-far.
export function subarraySumCountStub(
  _nums: readonly number[],
  _k: number,
): number {
  throw new Error("not implemented");
}
// Solution:
export function subarraySumCount(nums: readonly number[], k: number): number {
  const freq = new Map<number, number>(); // prefix-sum value -> how many times seen
  freq.set(0, 1); // the empty prefix has sum 0
  let running = 0;
  let count = 0;
  for (const n of nums) {
    running += n;
    // number of earlier prefixes p such that running - p === k
    count += freq.get(running - k) ?? 0;
    freq.set(running, (freq.get(running) ?? 0) + 1);
  }
  return count;
}

// --- LeetCode 1. Two Sum (Easy) ---
// https://leetcode.com/problems/two-sum/
// Exactly twoSumHashed above; kept as a named export for the practice list.
export function twoSum(
  nums: readonly number[],
  target: number,
): [number, number] | null {
  return twoSumHashed(nums, target);
}

// --- run ---
if (require.main === module) {
  const nums = [2, 7, 11, 15];

  // Brute and hashed must agree on the answer; only their cost differs.
  console.assert(
    JSON.stringify(twoSumBrute(nums, 9)) === JSON.stringify([0, 1]),
    "brute two-sum: 2 + 7 = 9",
  );
  console.assert(
    JSON.stringify(twoSumHashed(nums, 9)) === JSON.stringify([0, 1]),
    "hashed two-sum: 2 + 7 = 9",
  );
  console.assert(twoSumHashed(nums, 100) === null, "no pair sums to 100");
  console.assert(
    JSON.stringify(twoSum([3, 2, 4], 6)) === JSON.stringify([1, 2]),
    "two-sum: 2 + 4 = 6",
  );

  const prefix = buildPrefixSum([1, 2, 3, 4, 5]);
  console.assert(
    JSON.stringify(prefix) === JSON.stringify([0, 1, 3, 6, 10, 15]),
    "prefix sums of 1..5",
  );
  console.assert(
    rangeSum(prefix, 1, 3) === 9,
    "range sum nums[1..3] = 2+3+4 = 9",
  );
  console.assert(
    rangeSum(prefix, 0, 4) === 15,
    "range sum of whole array = 15",
  );
  console.assert(rangeSum(prefix, 2, 2) === 3, "single-element range sum = 3");

  console.assert(hasDuplicate([1, 2, 3, 1]) === true, "1 repeats");
  console.assert(hasDuplicate([1, 2, 3, 4]) === false, "all distinct");

  console.assert(
    subarraySumCount([1, 1, 1], 2) === 2,
    "two subarrays of [1,1,1] sum to 2",
  );
  console.assert(
    subarraySumCount([1, 2, 3], 3) === 2,
    "[3] and [1,2] both sum to 3",
  );
  console.assert(
    subarraySumCount([1, -1, 0], 0) === 3,
    "three subarrays sum to 0",
  );

  console.log("01-time-space-tradeoffs: all assertions passed");
}
