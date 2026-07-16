// Companion code for ./05-interview-patterns.md

// Pattern 1 -- Sort, then two pointers.
// LeetCode 15: 3Sum
export function threeSum(nums: readonly number[]): number[][] {
  const sorted = [...nums].sort((a, b) => a - b);
  const result: number[][] = [];
  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue; // skip duplicate fixed element
    let left = i + 1;
    let right = sorted.length - 1;
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

// Pattern 2 -- Sort, then greedy.
// LeetCode 435: Non-overlapping Intervals -- minimum removals so the rest don't overlap.
export function eraseOverlapIntervals(intervals: readonly (readonly [number, number])[]): number {
  if (intervals.length === 0) return 0;
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]); // sort by end time
  let removals = 0;
  let prevEnd = sorted[0][1];
  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i];
    if (start < prevEnd) {
      removals++; // overlaps the kept interval; drop it (its end is >= prevEnd, so keeping the earlier end is never worse)
    } else {
      prevEnd = end;
    }
  }
  return removals;
}

// Pattern 3 -- Binary search on the answer.
// LeetCode 875: Koko Eating Bananas -- minimize the eating speed subject to a time budget.
export function minEatingSpeed(piles: readonly number[], h: number): number {
  const hoursNeeded = (speed: number): number => {
    let hours = 0;
    for (const pile of piles) hours += Math.ceil(pile / speed);
    return hours;
  };

  let low = 1;
  let high = Math.max(...piles);
  let answer = high;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (hoursNeeded(mid) <= h) {
      answer = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return answer;
}

// Pattern 4 -- Binary search over a virtual flattened 2D array.
// LeetCode 74: Search a 2D Matrix
export function searchMatrix(matrix: readonly (readonly number[])[], target: number): boolean {
  if (matrix.length === 0 || matrix[0].length === 0) return false;
  const rows = matrix.length;
  const cols = matrix[0].length;
  let low = 0;
  let high = rows * cols - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const value = matrix[Math.floor(mid / cols)][mid % cols];
    if (value === target) return true;
    if (value < target) low = mid + 1;
    else high = mid - 1;
  }
  return false;
}

// Exercise: implement the two-pointer half of Pattern 1 in isolation,
// assuming the input is already sorted (LeetCode 167's exact setup).
// Solution:
export function twoSumSortedTwoPointers(numbers: readonly number[], target: number): [number, number] {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1]; // LeetCode 167 is 1-indexed
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}

// Exercise: binary search doesn't need a fully sorted array, only a local
// monotonic signal. Write findPeakElement(nums) that returns the index of
// any peak (an element strictly greater than both neighbors, with -Infinity
// assumed just outside both ends).
// Solution:
export function findPeakElement(nums: readonly number[]): number {
  let low = 0;
  let high = nums.length - 1;
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] > nums[mid + 1]) {
      high = mid; // peak is at mid or to its left
    } else {
      low = mid + 1; // peak is to the right of mid
    }
  }
  return low;
}

// --- run ---
if (require.main === module) {
  console.assert(
    JSON.stringify(threeSum([-1, 0, 1, 2, -1, -4])) === JSON.stringify([[-1, -1, 2], [-1, 0, 1]]),
    'threeSum should match the LeetCode 15 example'
  );

  console.assert(
    eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]) === 1,
    'eraseOverlapIntervals should match the LeetCode 435 example'
  );

  console.assert(minEatingSpeed([3, 6, 7, 11], 8) === 4, 'minEatingSpeed should match the LeetCode 875 example');

  console.assert(
    searchMatrix(
      [
        [1, 3, 5, 7],
        [10, 11, 16, 20],
        [23, 30, 34, 60],
      ],
      3
    ) === true,
    'searchMatrix should find 3'
  );
  console.assert(
    searchMatrix(
      [
        [1, 3, 5, 7],
        [10, 11, 16, 20],
        [23, 30, 34, 60],
      ],
      13
    ) === false,
    'searchMatrix should not find 13'
  );

  console.assert(
    JSON.stringify(twoSumSortedTwoPointers([2, 7, 11, 15], 9)) === JSON.stringify([1, 2]),
    'twoSumSortedTwoPointers should match LeetCode 167 example'
  );

  console.assert(findPeakElement([1, 2, 3, 1]) === 2, 'findPeakElement should find the peak at index 2');
  const peakIndex = findPeakElement([1, 2, 1, 3, 5, 6, 4]);
  console.assert(peakIndex === 1 || peakIndex === 5, 'findPeakElement should find a valid peak (index 1 or 5)');

  console.log('All lesson 05 checks passed.');
}
