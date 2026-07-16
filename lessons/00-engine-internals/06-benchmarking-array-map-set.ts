// Companion code for ./06-benchmarking-array-map-set.md
import { performance } from 'perf_hooks';

// --- Three parallel lookup structures over the same key space ---
//
// Same keys (0..n-1), same values, three different storage strategies:
// a packed array (direct-offset access, see lesson 04), a Map, and a Set
// (both hash-table-backed OrderedHashTables under the hood). Building all
// three over identical data means any timing difference we measure comes
// from the *structure*, not the data.

export function buildSequentialArray(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

export function buildLookupMap(n: number): Map<number, number> {
  const map = new Map<number, number>();
  for (let i = 0; i < n; i++) map.set(i, i);
  return map;
}

export function buildLookupSet(n: number): Set<number> {
  const set = new Set<number>();
  for (let i = 0; i < n; i++) set.add(i);
  return set;
}

/** Sums arr[i] for each i in `indices` -- direct offset arithmetic per read. */
export function sumViaArrayIndex(arr: readonly number[], indices: readonly number[]): number {
  let total = 0;
  for (const i of indices) total += arr[i];
  return total;
}

/** Sums map.get(k) for each k in `keys` -- hash + bucket-probe per read. */
export function sumViaMapGet(map: ReadonlyMap<number, number>, keys: readonly number[]): number {
  let total = 0;
  for (const k of keys) total += map.get(k) ?? 0;
  return total;
}

/** Counts how many of `values` are present in `set` -- hash + bucket-probe per check. */
export function countViaSetHas(set: ReadonlySet<number>, values: readonly number[]): number {
  let count = 0;
  for (const v of values) if (set.has(v)) count++;
  return count;
}

export function timeIt(fn: () => void): number {
  const start = performance.now();
  fn();
  return performance.now() - start;
}

// --- The linear-scan trap: array membership vs Set membership ---

/** O(n) per call: no index exists, so every check re-scans from the front. */
export function hasViaArrayIncludes(arr: readonly number[], value: number): boolean {
  return arr.includes(value);
}

/** O(1) average per call: hash straight to the bucket. */
export function hasViaSetHas(set: ReadonlySet<number>, value: number): boolean {
  return set.has(value);
}

/** Runs `hasViaArrayIncludes` once per value in `values`, returning the hit count. */
export function arrayIncludesIsLinear(arr: readonly number[], values: readonly number[]): number {
  let hits = 0;
  for (const v of values) if (hasViaArrayIncludes(arr, v)) hits++;
  return hits;
}

/** Runs `hasViaSetHas` once per value in `values`, returning the hit count. */
export function setHasIsConstant(set: ReadonlySet<number>, values: readonly number[]): number {
  let hits = 0;
  for (const v of values) if (hasViaSetHas(set, v)) hits++;
  return hits;
}

// --- LeetCode 1. Two Sum (Easy) ---
// https://leetcode.com/problems/two-sum/
// A value-to-index Map turns "for each number, scan the rest of the array
// for its complement" (O(n^2)) into a single O(n) pass with O(1) average
// lookups.
export function twoSum(nums: readonly number[], target: number): [number, number] {
  const seen = new Map<number, number>(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    const complementIndex = seen.get(complement);
    if (complementIndex !== undefined) return [complementIndex, i];
    seen.set(nums[i], i);
  }
  throw new Error('no two sum solution');
}

// --- LeetCode 217. Contains Duplicate (Easy) ---
// https://leetcode.com/problems/contains-duplicate/
// Set membership makes "have I seen this before?" O(1) average per element
// instead of an O(n) re-scan, so the whole check is O(n) instead of O(n^2).
export function containsDuplicate(nums: readonly number[]): boolean {
  const seen = new Set<number>();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}

// --- LeetCode 349. Intersection of Two Arrays (Easy) ---
// https://leetcode.com/problems/intersection-of-two-arrays/
// Two Sets turn intersection into O(n + m): build one Set from the first
// array, then a single O(1)-average membership check per element of the
// second, instead of an O(n * m) nested scan.
export function arrayIntersection(nums1: readonly number[], nums2: readonly number[]): number[] {
  const first = new Set(nums1);
  const result = new Set<number>();
  for (const n of nums2) {
    if (first.has(n)) result.add(n);
  }
  return [...result];
}

// --- LeetCode 3. Longest Substring Without Repeating Characters (Medium) ---
// https://leetcode.com/problems/longest-substring-without-repeating-characters/
// A Map of char -> last-seen-index (not just a Set of "have I seen this
// char") drives an O(n) sliding window: on a repeat, the window's left
// edge jumps straight to just past the previous occurrence instead of
// creeping forward one step at a time.
export function lengthOfLongestSubstring(s: string): number {
  const lastSeenAt = new Map<string, number>();
  let windowStart = 0;
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    const previousIndex = lastSeenAt.get(c);
    if (previousIndex !== undefined && previousIndex >= windowStart) {
      windowStart = previousIndex + 1;
    }
    lastSeenAt.set(c, i);
    best = Math.max(best, i - windowStart + 1);
  }
  return best;
}

// Exercise: Implement `dedupeWithSet`, which returns the elements of `arr`
// with duplicates removed, preserving first-occurrence order (O(n) via a
// Set, instead of an O(n^2) "includes" check per element).
export function dedupeWithSetStub(_arr: readonly number[]): number[] {
  throw new Error('not implemented');
}
// Solution:
export function dedupeWithSet(arr: readonly number[]): number[] {
  const seen = new Set<number>();
  const result: number[] = [];
  for (const n of arr) {
    if (!seen.has(n)) {
      seen.add(n);
      result.push(n);
    }
  }
  return result;
}

// Exercise: Implement `wouldBenefitFromSet`, a heuristic that returns true
// when a workload does `lookupCount` membership checks against an array of
// `arraySize` elements -- i.e. when paying the upfront O(arraySize) cost of
// building a Set is worth it because the total linear-scan cost
// (lookupCount * arraySize) would exceed a small constant multiple of
// arraySize. Assume it's worth it once lookupCount > 1 (any repeated
// membership testing beats one-off array scans, per this lesson's
// "reach for a Set the moment you test membership more than once" rule).
export function wouldBenefitFromSetStub(_arraySize: number, _lookupCount: number): boolean {
  throw new Error('not implemented');
}
// Solution:
export function wouldBenefitFromSet(arraySize: number, lookupCount: number): boolean {
  return arraySize > 0 && lookupCount > 1;
}

// --- run ---
if (require.main === module) {
  const n = 50_000;
  const arr = buildSequentialArray(n);
  const map = buildLookupMap(n);
  const set = buildLookupSet(n);

  const indices = buildSequentialArray(n); // 0..n-1, reused as both indices and keys/values

  const arraySum = sumViaArrayIndex(arr, indices);
  const mapSum = sumViaMapGet(map, indices);
  const setHitCount = countViaSetHas(set, indices);
  console.assert(arraySum === mapSum, 'array-index sum and Map.get sum should agree over identical data');
  console.assert(setHitCount === n, 'every index 0..n-1 should be present in the Set');

  const arrayTime = timeIt(() => sumViaArrayIndex(arr, indices));
  const mapTime = timeIt(() => sumViaMapGet(map, indices));
  const setTime = timeIt(() => countViaSetHas(set, indices));
  console.log(
    `array-index sum: ${arrayTime.toFixed(3)}ms, Map.get sum: ${mapTime.toFixed(3)}ms, Set.has count: ${setTime.toFixed(3)}ms`
  );

  const smallArr = buildSequentialArray(2_000);
  const smallSet = buildLookupSet(2_000);
  const probeValues = [0, 500, 1_000, 1_999, 2_500]; // last one is a deliberate miss
  const arrayHits = arrayIncludesIsLinear(smallArr, probeValues);
  const setHits = setHasIsConstant(smallSet, probeValues);
  console.assert(arrayHits === 4 && setHits === 4, 'array.includes and set.has should agree: 4 hits, 1 miss');

  const arrayScanTime = timeIt(() => arrayIncludesIsLinear(smallArr, probeValues));
  const setScanTime = timeIt(() => setHasIsConstant(smallSet, probeValues));
  console.log(`array.includes scan: ${arrayScanTime.toFixed(3)}ms, set.has scan: ${setScanTime.toFixed(3)}ms`);

  console.assert(twoSum([2, 7, 11, 15], 9).join(',') === '0,1', 'twoSum should find indices 0 and 1');
  console.assert(twoSum([3, 2, 4], 6).join(',') === '1,2', 'twoSum should find indices 1 and 2');

  console.assert(containsDuplicate([1, 2, 3, 1]) === true, 'containsDuplicate should find the repeated 1');
  console.assert(containsDuplicate([1, 2, 3, 4]) === false, 'containsDuplicate should report no duplicates');

  const intersection = arrayIntersection([1, 2, 2, 1], [2, 2]).sort();
  console.assert(intersection.join(',') === '2', 'arrayIntersection of [1,2,2,1] and [2,2] should be [2]');

  console.assert(
    lengthOfLongestSubstring('abcabcbb') === 3,
    'longest substring without repeats in "abcabcbb" should be 3 ("abc")'
  );
  console.assert(lengthOfLongestSubstring('bbbbb') === 1, 'longest substring without repeats in "bbbbb" should be 1');
  console.assert(lengthOfLongestSubstring('pwwkew') === 3, 'longest substring without repeats in "pwwkew" should be 3');

  console.assert(
    dedupeWithSet([1, 2, 2, 3, 1, 4]).join(',') === '1,2,3,4',
    'dedupeWithSet should preserve first-occurrence order'
  );

  console.assert(wouldBenefitFromSet(1_000, 5) === true, 'repeated membership checks should favor a Set');
  console.assert(wouldBenefitFromSet(1_000, 1) === false, 'a single one-off check does not justify building a Set');

  console.log('06-benchmarking-array-map-set: all assertions passed');
}
