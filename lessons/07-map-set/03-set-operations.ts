// Companion code for ./03-set-operations.md

/** Removes duplicates while discarding order (Set has no index concept). */
export function dedupe<T>(arr: readonly T[]): T[] {
  return [...new Set(arr)];
}

/** Removes duplicates while preserving first-occurrence order. */
export function dedupePreservingOrder<T>(arr: readonly T[]): T[] {
  const seen = new Set<T>();
  const result: T[] = [];
  for (const item of arr) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}

/** A ∪ B: every element that appears in at least one set. */
export function union<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
  return new Set([...a, ...b]);
}

/** A ∩ B: every element that appears in both sets. */
export function intersection<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
  const smaller = a.size <= b.size ? a : b;
  const larger = a.size <= b.size ? b : a;
  const result = new Set<T>();
  for (const item of smaller) {
    if (larger.has(item)) result.add(item);
  }
  return result;
}

/** A − B: elements in A that are not in B. */
export function difference<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
  const result = new Set<T>();
  for (const item of a) {
    if (!b.has(item)) result.add(item);
  }
  return result;
}

// Exercise: symmetric difference is everything in exactly one of the two
// sets (A ∪ B minus A ∩ B).
export function symmetricDifferenceStub<T>(_a: ReadonlySet<T>, _b: ReadonlySet<T>): Set<T> {
  throw new Error('not implemented');
}
// Solution:
export function symmetricDifference<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
  const result = new Set<T>();
  for (const item of a) if (!b.has(item)) result.add(item);
  for (const item of b) if (!a.has(item)) result.add(item);
  return result;
}

// Exercise: A is a subset of B if every element of A is also in B.
export function isSubsetStub<T>(_a: ReadonlySet<T>, _b: ReadonlySet<T>): boolean {
  throw new Error('not implemented');
}
// Solution:
export function isSubset<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): boolean {
  for (const item of a) {
    if (!b.has(item)) return false;
  }
  return true;
}

// --- LeetCode 349. Intersection of Two Arrays (Easy) ---
// https://leetcode.com/problems/intersection-of-two-arrays/
export function intersectionOfArrays(nums1: readonly number[], nums2: readonly number[]): number[] {
  return [...intersection(new Set(nums1), new Set(nums2))];
}

// --- LeetCode 350. Intersection of Two Arrays II (Easy) ---
// https://leetcode.com/problems/intersection-of-two-arrays-ii/
// Duplicates must be respected per-count, so a Map<value, remainingCount>
// replaces the plain Set used in problem 349.
export function intersectionOfArraysWithCounts(nums1: readonly number[], nums2: readonly number[]): number[] {
  const counts = new Map<number, number>();
  for (const n of nums1) counts.set(n, (counts.get(n) ?? 0) + 1);
  const result: number[] = [];
  for (const n of nums2) {
    const remaining = counts.get(n) ?? 0;
    if (remaining > 0) {
      result.push(n);
      counts.set(n, remaining - 1);
    }
  }
  return result;
}

// --- LeetCode 217. Contains Duplicate (Easy) ---
// https://leetcode.com/problems/contains-duplicate/
export function containsDuplicate(nums: readonly number[]): boolean {
  return new Set(nums).size !== nums.length;
}

// --- LeetCode 128. Longest Consecutive Sequence (Medium) ---
// https://leetcode.com/problems/longest-consecutive-sequence/
// A Set gives O(1) membership checks, which lets this run in O(n): only
// start counting a run from a number that has no predecessor in the set.
export function longestConsecutiveSequence(nums: readonly number[]): number {
  const values = new Set(nums);
  let longest = 0;
  for (const value of values) {
    if (values.has(value - 1)) continue; // not the start of a run
    let length = 1;
    let current = value;
    while (values.has(current + 1)) {
      current++;
      length++;
    }
    longest = Math.max(longest, length);
  }
  return longest;
}

// --- run ---
if (require.main === module) {
  console.assert(JSON.stringify(dedupe([1, 2, 2, 3, 1])) === JSON.stringify([1, 2, 3]), 'dedupe should keep unique values');
  console.assert(
    JSON.stringify(dedupePreservingOrder([3, 1, 3, 2, 1])) === JSON.stringify([3, 1, 2]),
    'dedupePreservingOrder should keep first-occurrence order'
  );

  const a = new Set([1, 2, 3]);
  const b = new Set([2, 3, 4]);
  console.assert(JSON.stringify([...union(a, b)].sort()) === JSON.stringify([1, 2, 3, 4]), 'union should combine both sets');
  console.assert(JSON.stringify([...intersection(a, b)].sort()) === JSON.stringify([2, 3]), 'intersection should be shared elements');
  console.assert(JSON.stringify([...difference(a, b)].sort()) === JSON.stringify([1]), 'difference should be A minus B');
  console.assert(
    JSON.stringify([...symmetricDifference(a, b)].sort()) === JSON.stringify([1, 4]),
    'symmetricDifference should be elements in exactly one set'
  );

  console.assert(isSubset(new Set([1, 2]), a) === true, '{1,2} is a subset of {1,2,3}');
  console.assert(isSubset(new Set([1, 5]), a) === false, '{1,5} is not a subset of {1,2,3}');

  console.assert(
    JSON.stringify(intersectionOfArrays([1, 2, 2, 1], [2, 2]).sort()) === JSON.stringify([2]),
    'LeetCode 349 example should return [2]'
  );
  console.assert(
    JSON.stringify(intersectionOfArraysWithCounts([1, 2, 2, 1], [2, 2]).sort()) === JSON.stringify([2, 2]),
    'LeetCode 350 example should return [2, 2] respecting counts'
  );

  console.assert(containsDuplicate([1, 2, 3, 1]) === true, '[1,2,3,1] has a duplicate');
  console.assert(containsDuplicate([1, 2, 3]) === false, '[1,2,3] has no duplicate');

  console.assert(
    longestConsecutiveSequence([100, 4, 200, 1, 3, 2]) === 4,
    'longest run should be [1,2,3,4] with length 4'
  );
  console.assert(longestConsecutiveSequence([]) === 0, 'empty input has longest run 0');

  console.log('03-set-operations: all assertions passed');
}
