// Companion code for ./05-two-sum-family.md

// --- LeetCode 1. Two Sum (Easy) ---
// https://leetcode.com/problems/two-sum/
// Core complement pattern: for each value, check whether (target - value)
// has already been seen, using a Map<value, index> for O(1) lookups.
export function twoSumIndices(nums: readonly number[], target: number): [number, number] {
  const seenIndexByValue = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    const j = seenIndexByValue.get(complement);
    if (j !== undefined) return [j, i];
    seenIndexByValue.set(nums[i], i);
  }
  throw new Error('No two-sum solution exists');
}

// --- LeetCode 170. Two Sum III - Data structure design (Easy) ---
// https://leetcode.com/problems/two-sum-iii-data-structure-design/
// The complement pattern applied to a design problem: add() is O(1),
// find() checks every distinct value's complement against the Map.
export class TwoSumDataStructure {
  private readonly counts = new Map<number, number>();

  add(value: number): void {
    this.counts.set(value, (this.counts.get(value) ?? 0) + 1);
  }

  find(target: number): boolean {
    for (const [value, count] of this.counts) {
      const complement = target - value;
      if (complement === value) {
        if (count > 1) return true;
      } else if (this.counts.has(complement)) {
        return true;
      }
    }
    return false;
  }
}

// --- LeetCode 15. 3Sum (Medium) ---
// https://leetcode.com/problems/3sum/
// Fix the smallest element (sorted, with duplicate-skipping), then solve
// the remaining two-sum-to-(-fixed) subproblem with a Set instead of
// nested two-pointers, reusing the same complement idea as Two Sum.
export function threeSum(nums: readonly number[]): number[][] {
  const sorted = [...nums].sort((a, b) => a - b);
  const result: number[][] = [];

  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue; // skip duplicate fixed element
    const seen = new Set<number>();
    for (let j = i + 1; j < sorted.length; j++) {
      const complement = -sorted[i] - sorted[j];
      if (seen.has(complement)) {
        result.push([sorted[i], complement, sorted[j]]);
        while (j + 1 < sorted.length && sorted[j] === sorted[j + 1]) j++; // skip duplicate j
      }
      seen.add(sorted[j]);
    }
  }
  return result;
}

// --- LeetCode 454. 4Sum II (Medium) ---
// https://leetcode.com/problems/4sum-ii/
// Split into two pair-sums: precompute every nums1[i] + nums2[j] sum into a
// Map<sum, count>, then for every nums3[k] + nums4[l], look up its negation.
export function fourSumCount(
  nums1: readonly number[],
  nums2: readonly number[],
  nums3: readonly number[],
  nums4: readonly number[]
): number {
  const pairSumCounts = new Map<number, number>();
  for (const a of nums1) {
    for (const b of nums2) {
      const sum = a + b;
      pairSumCounts.set(sum, (pairSumCounts.get(sum) ?? 0) + 1);
    }
  }

  let count = 0;
  for (const c of nums3) {
    for (const d of nums4) {
      count += pairSumCounts.get(-(c + d)) ?? 0;
    }
  }
  return count;
}

// Exercise: return unique value pairs (not indices) that sum to target,
// with no duplicate pairs even if values repeat in the input.
export function uniqueTwoSumPairsStub(_nums: readonly number[], _target: number): number[][] {
  throw new Error('not implemented');
}
// Solution:
export function uniqueTwoSumPairs(nums: readonly number[], target: number): number[][] {
  const seenValues = new Set<number>();
  const emittedPairs = new Set<string>();
  const result: number[][] = [];
  for (const n of nums) {
    const complement = target - n;
    if (seenValues.has(complement)) {
      const low = Math.min(n, complement);
      const high = Math.max(n, complement);
      const key = `${low},${high}`;
      if (!emittedPairs.has(key)) {
        emittedPairs.add(key);
        result.push([low, high]);
      }
    }
    seenValues.add(n);
  }
  return result;
}

// Exercise: count how many index pairs (i < j) sum to target, using a
// frequency Map instead of generating the pairs themselves.
export function countPairsWithSumStub(_nums: readonly number[], _target: number): number {
  throw new Error('not implemented');
}
// Solution:
export function countPairsWithSum(nums: readonly number[], target: number): number {
  const freq = new Map<number, number>();
  let count = 0;
  for (const n of nums) {
    const complement = target - n;
    count += freq.get(complement) ?? 0;
    freq.set(n, (freq.get(n) ?? 0) + 1);
  }
  return count;
}

// --- run ---
if (require.main === module) {
  console.assert(
    JSON.stringify(twoSumIndices([2, 7, 11, 15], 9)) === JSON.stringify([0, 1]),
    'twoSumIndices should find indices [0, 1]'
  );

  const ds = new TwoSumDataStructure();
  ds.add(1);
  ds.add(3);
  ds.add(5);
  console.assert(ds.find(4) === true, '1 + 3 = 4 should be found');
  console.assert(ds.find(8) === true, '3 + 5 = 8 should be found');
  console.assert(ds.find(7) === false, 'no pair sums to 7');

  const triplets = threeSum([-1, 0, 1, 2, -1, -4]).sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  const expectedTriplets = [
    [-1, -1, 2],
    [-1, 0, 1],
  ];
  console.assert(JSON.stringify(triplets) === JSON.stringify(expectedTriplets), 'threeSum should find both unique triplets');
  console.assert(JSON.stringify(threeSum([0, 0, 0])) === JSON.stringify([[0, 0, 0]]), 'threeSum should dedupe all-zero input');

  console.assert(
    fourSumCount([1, 2], [-2, -1], [-1, 2], [0, 2]) === 2,
    '4Sum II classic example should return 2'
  );

  console.assert(
    JSON.stringify(uniqueTwoSumPairs([1, 2, 3, 2, 4], 5).sort()) === JSON.stringify([[1, 4], [2, 3]].sort()),
    'uniqueTwoSumPairs should dedupe repeated value pairs'
  );

  console.assert(countPairsWithSum([1, 2, 3, 2, 4], 5) === 3, 'countPairsWithSum should count 3 index pairs summing to 5');

  console.log('05-two-sum-family: all assertions passed');
}
