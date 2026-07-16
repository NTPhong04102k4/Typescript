// Companion code for ./06-leetcode-practice.md
import { singleNumber } from './02-bit-tricks';
import { popcount, countBits } from './03-count-bits';
import { allSubsets } from './04-bitmask-subsets';

// --- LeetCode 136. Single Number (Easy) ---
// https://leetcode.com/problems/single-number/
// Every element appears twice except one. XOR is its own inverse, so all pairs
// cancel and the lone value survives. Implemented in lesson 02, re-used here.
export { singleNumber };

// --- LeetCode 191. Number of 1 Bits (Easy) ---
// https://leetcode.com/problems/number-of-1-bits/
// Hamming weight via Brian Kernighan's clear-lowest-bit loop from lesson 03.
export function hammingWeight(n: number): number {
  return popcount(n);
}

// --- LeetCode 338. Counting Bits (Easy) ---
// https://leetcode.com/problems/counting-bits/
// dp[i] = dp[i >> 1] + (i & 1); the DP from lesson 03.
export function countingBits(n: number): number[] {
  return countBits(n);
}

// --- LeetCode 268. Missing Number (Easy) ---
// https://leetcode.com/problems/missing-number/
// XOR every index 0..n together with every value; matching pairs cancel and the
// missing number is whatever remains.
export function missingNumber(nums: readonly number[]): number {
  let acc = nums.length; // start with index n, which has no array slot
  for (let i = 0; i < nums.length; i++) {
    acc ^= i ^ nums[i];
  }
  return acc;
}

// --- LeetCode 371. Sum of Two Integers (Medium) ---
// https://leetcode.com/problems/sum-of-two-integers/
// Add without `+`: a ^ b is the sum ignoring carries, (a & b) << 1 is the carry.
// Repeat until there is no carry left. JS bitwise ops truncate to 32 bits, so
// two's-complement wraparound makes negatives work and the loop terminates.
export function getSum(a: number, b: number): number {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}

// --- LeetCode 78. Subsets (Medium) ---
// https://leetcode.com/problems/subsets/
// Enumerate all 2^n subsets by iterating masks 0..2^n - 1 (lesson 04).
export function subsets(nums: readonly number[]): number[][] {
  return allSubsets(nums);
}

// --- run ---
if (require.main === module) {
  console.assert(singleNumber([2, 2, 1]) === 1, '136: 1 is the unpaired value');
  console.assert(singleNumber([4, 1, 2, 1, 2]) === 4, '136: 4 is the unpaired value');

  console.assert(hammingWeight(0b1011) === 3, '191: 1011 has 3 set bits');
  console.assert(hammingWeight(128) === 1, '191: 128 has a single set bit');

  console.assert(
    JSON.stringify(countingBits(5)) === JSON.stringify([0, 1, 1, 2, 1, 2]),
    '338: countingBits(5) = [0,1,1,2,1,2]'
  );

  console.assert(missingNumber([3, 0, 1]) === 2, '268: 2 is missing from {0,1,3}');
  console.assert(missingNumber([0, 1]) === 2, '268: n itself (2) can be the missing number');
  console.assert(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]) === 8, '268: 8 is missing from 0..9');

  console.assert(getSum(1, 2) === 3, '371: 1 + 2 = 3');
  console.assert(getSum(-2, 3) === 1, '371: -2 + 3 = 1 (two\'s complement handles the negative)');
  console.assert(getSum(-5, -7) === -12, '371: -5 + -7 = -12');

  const result = subsets([1, 2, 3]);
  console.assert(result.length === 8, '78: 3 elements produce 8 subsets');
  console.assert(JSON.stringify(result[0]) === JSON.stringify([]), '78: the empty set is included');
  console.assert(JSON.stringify(result[7]) === JSON.stringify([1, 2, 3]), '78: the full set is included');

  console.log('06-leetcode-practice: all assertions passed');
}
