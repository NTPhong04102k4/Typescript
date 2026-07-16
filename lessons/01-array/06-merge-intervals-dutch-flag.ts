// Companion code for ./06-merge-intervals-dutch-flag.md

// LeetCode 56: Merge Intervals.
// Sort by start, then extend or start a new run based on overlap with the
// last merged interval.
export function mergeIntervals(intervals: readonly (readonly number[])[]): number[][] {
  if (intervals.length === 0) return [];

  const sorted = [...intervals].map((interval) => [...interval]).sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

// LeetCode 75: Sort Colors.
// Dutch national flag: three pointers partition 0/1/2 in one in-place pass.
export function sortColors(nums: number[]): void {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}

// Exercise: implement LeetCode 57, Insert Interval -- insert a new
// interval into a sorted, non-overlapping list and merge as needed.
// Solution:
export function insertInterval(intervals: readonly (readonly number[])[], newInterval: readonly number[]): number[][] {
  const result: number[][] = [];
  const n = intervals.length;
  let i = 0;

  while (i < n && intervals[i][1] < newInterval[0]) {
    result.push([...intervals[i]]);
    i++;
  }

  let mergedStart = newInterval[0];
  let mergedEnd = newInterval[1];
  while (i < n && intervals[i][0] <= mergedEnd) {
    mergedStart = Math.min(mergedStart, intervals[i][0]);
    mergedEnd = Math.max(mergedEnd, intervals[i][1]);
    i++;
  }
  result.push([mergedStart, mergedEnd]);

  while (i < n) {
    result.push([...intervals[i]]);
    i++;
  }

  return result;
}

// Exercise: implement LeetCode 435, Non-overlapping Intervals -- the
// minimum number of intervals to remove so the rest don't overlap, using
// a greedy scan sorted by end time.
// Solution:
export function eraseOverlapIntervals(intervals: readonly (readonly number[])[]): number {
  if (intervals.length === 0) return 0;

  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let removalCount = 0;
  let lastEnd = sorted[0][1];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i][0] < lastEnd) {
      removalCount++;
    } else {
      lastEnd = sorted[i][1];
    }
  }

  return removalCount;
}

// --- run ---
if (require.main === module) {
  const merged = mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]);
  console.assert(
    JSON.stringify(merged) === JSON.stringify([[1, 6], [8, 10], [15, 18]]),
    'overlapping (1,3) and (2,6) should merge into (1,6)'
  );

  const colors = [2, 0, 2, 1, 1, 0];
  sortColors(colors);
  console.assert(JSON.stringify(colors) === JSON.stringify([0, 0, 1, 1, 2, 2]), 'sortColors should partition 0/1/2 in order');

  const inserted = insertInterval([[1, 3], [6, 9]], [2, 5]);
  console.assert(
    JSON.stringify(inserted) === JSON.stringify([[1, 5], [6, 9]]),
    'inserting (2,5) should merge with (1,3) into (1,5)'
  );

  const removals = eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]);
  console.assert(removals === 1, 'removing (1,3) leaves the rest non-overlapping');

  console.log('All lesson 06 checks passed.');
}
