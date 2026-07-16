// Companion code for ./07-binary-search.md

// LeetCode 704: Binary Search.
export function binarySearch(nums: readonly number[], target: number): number {
  let low = 0;
  let high = nums.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

// LeetCode 33: Search in Rotated Sorted Array.
// At each mid, one half is guaranteed sorted; only trust the range check
// on that sorted half.
export function searchRotated(nums: readonly number[], target: number): number {
  let low = 0;
  let high = nums.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;

    if (nums[low] <= nums[mid]) {
      // Left half [low..mid] is sorted.
      if (nums[low] <= target && target < nums[mid]) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    } else {
      // Right half [mid..high] is sorted.
      if (nums[mid] < target && target <= nums[high]) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }

  return -1;
}

/** Binary search biased to the first (leftmost) or last (rightmost) match. */
export function findBound(nums: readonly number[], target: number, findFirst: boolean): number {
  let low = 0;
  let high = nums.length - 1;
  let result = -1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) {
      result = mid;
      if (findFirst) high = mid - 1;
      else low = mid + 1;
    } else if (nums[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return result;
}

// Exercise: implement LeetCode 34, Find First and Last Position of
// Element in Sorted Array, by calling findBound twice.
// Solution:
export function searchRange(nums: readonly number[], target: number): [number, number] {
  const first = findBound(nums, target, true);
  const last = findBound(nums, target, false);
  return [first, last];
}

// Exercise: implement LeetCode 153, Find Minimum in Rotated Sorted Array.
// Solution:
export function findMinRotated(nums: readonly number[]): number {
  let low = 0;
  let high = nums.length - 1;

  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] > nums[high]) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return nums[low];
}

// --- run ---
if (require.main === module) {
  console.assert(binarySearch([-1, 0, 3, 5, 9, 12], 9) === 4, 'binarySearch should find 9 at index 4');
  console.assert(binarySearch([-1, 0, 3, 5, 9, 12], 2) === -1, 'binarySearch should return -1 for a missing target');

  console.assert(searchRotated([4, 5, 6, 7, 0, 1, 2], 0) === 4, 'searchRotated should find 0 at index 4');
  console.assert(searchRotated([4, 5, 6, 7, 0, 1, 2], 3) === -1, 'searchRotated should return -1 for a missing target');

  console.assert(
    JSON.stringify(searchRange([5, 7, 7, 8, 8, 10], 8)) === JSON.stringify([3, 4]),
    'searchRange should find first and last positions of 8'
  );
  console.assert(
    JSON.stringify(searchRange([5, 7, 7, 8, 8, 10], 6)) === JSON.stringify([-1, -1]),
    'searchRange should return [-1, -1] for a missing target'
  );

  console.assert(findMinRotated([3, 4, 5, 1, 2]) === 1, 'the minimum of the rotated array is 1');
  console.assert(findMinRotated([4, 5, 6, 7, 0, 1, 2]) === 0, 'the minimum of the rotated array is 0');

  console.log('All lesson 07 checks passed.');
}
