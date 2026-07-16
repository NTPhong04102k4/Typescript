// Companion code for ./04-binary-search-deep-dive.md

/** Classic iterative binary search. Returns the index of target, or -1. */
export function binarySearch(arr: readonly number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

/** First index i such that arr[i] >= target (half-open [low, high) range). */
export function lowerBound(arr: readonly number[], target: number): number {
  let low = 0;
  let high = arr.length;
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] < target) low = mid + 1;
    else high = mid;
  }
  return low;
}

/** First index i such that arr[i] > target (half-open [low, high) range). */
export function upperBound(arr: readonly number[], target: number): number {
  let low = 0;
  let high = arr.length;
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] <= target) low = mid + 1;
    else high = mid;
  }
  return low;
}

/**
 * Generalized "search on the answer": given a predicate that is false for
 * every value below some threshold and true for every value at/above it
 * across [low, high], returns the smallest value where predicate holds.
 * Returns high + 1 (a value outside the range) if predicate is never true.
 */
export function binarySearchOnAnswer(
  low: number,
  high: number,
  predicate: (candidate: number) => boolean
): number {
  let lo = low;
  let hi = high;
  let answer = high + 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (predicate(mid)) {
      answer = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  return answer;
}

// Exercise: implement binary search recursively instead of iteratively.
// Solution:
export function binarySearchRecursive(
  arr: readonly number[],
  target: number,
  low: number = 0,
  high: number = arr.length - 1
): number {
  if (low > high) return -1;
  const mid = low + Math.floor((high - low) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, high);
  return binarySearchRecursive(arr, target, low, mid - 1);
}

// Exercise: use search-space reduction to find the integer square root of n
// (the largest x with x*x <= n), without using Math.sqrt.
// Solution:
export function isqrt(n: number): number {
  let low = 0;
  let high = n;
  let answer = 0;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (mid * mid <= n) {
      answer = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return answer;
}

// LeetCode 704: Binary Search
export function search(nums: readonly number[], target: number): number {
  return binarySearch(nums, target);
}

// LeetCode 34: Find First and Last Position of Element in Sorted Array
export function searchRange(nums: readonly number[], target: number): [number, number] {
  const first = lowerBound(nums, target);
  if (first === nums.length || nums[first] !== target) return [-1, -1];
  const last = upperBound(nums, target) - 1;
  return [first, last];
}

// LeetCode 33: Search in Rotated Sorted Array
export function searchRotated(nums: readonly number[], target: number): number {
  let low = 0;
  let high = nums.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[low] <= nums[mid]) {
      // Left half [low, mid] is sorted.
      if (nums[low] <= target && target < nums[mid]) high = mid - 1;
      else low = mid + 1;
    } else {
      // Right half [mid, high] is sorted.
      if (nums[mid] < target && target <= nums[high]) low = mid + 1;
      else high = mid - 1;
    }
  }
  return -1;
}

// LeetCode 374: Guess Number Higher or Lower.
// guess(num) returns -1 if the pick is lower than num, 1 if the pick is
// higher than num, 0 if num is the pick -- exactly the LeetCode API shape.
export type GuessFn = (num: number) => -1 | 0 | 1;
export function guessNumber(n: number, guess: GuessFn): number {
  // Smallest mid where guess(mid) is not "too low" (i.e. mid >= pick) is the pick itself.
  return binarySearchOnAnswer(1, n, (mid) => guess(mid) !== 1);
}

// --- run ---
if (require.main === module) {
  const sorted = [1, 3, 5, 7, 9, 11, 13];
  console.assert(binarySearch(sorted, 9) === 4, 'binarySearch should find 9 at index 4');
  console.assert(binarySearch(sorted, 4) === -1, 'binarySearch should return -1 for a missing value');
  console.assert(
    binarySearchRecursive(sorted, 5) === 2,
    'binarySearchRecursive should find 5 at index 2'
  );

  const withDupes = [1, 2, 2, 2, 3, 4];
  console.assert(lowerBound(withDupes, 2) === 1, 'lowerBound should find the first index >= 2');
  console.assert(upperBound(withDupes, 2) === 4, 'upperBound should find the first index > 2');

  console.assert(
    JSON.stringify(searchRange([5, 7, 7, 8, 8, 10], 8)) === JSON.stringify([3, 4]),
    'searchRange should match LeetCode 34 example'
  );
  console.assert(
    JSON.stringify(searchRange([5, 7, 7, 8, 8, 10], 6)) === JSON.stringify([-1, -1]),
    'searchRange should return [-1,-1] for a missing target'
  );

  console.assert(
    searchRotated([4, 5, 6, 7, 0, 1, 2], 0) === 4,
    'searchRotated should match LeetCode 33 example'
  );

  const pick = 6;
  const guess: GuessFn = (num) => (num > pick ? -1 : num < pick ? 1 : 0);
  console.assert(guessNumber(10, guess) === 6, 'guessNumber should find the pick via search on the answer');

  console.assert(isqrt(27) === 5, 'isqrt(27) should be 5');
  console.assert(isqrt(16) === 4, 'isqrt(16) should be 4 (perfect square)');

  console.log('All lesson 04 checks passed.');
}
