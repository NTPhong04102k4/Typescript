// Companion code for ./02-merge-quicksort.md

export type Comparator<T> = (a: T, b: T) => number;

/** Default ascending comparator for numbers. */
export function ascending(a: number, b: number): number {
  return a - b;
}

/** Merge two already-sorted arrays into one sorted array. */
export function merge<T>(left: readonly T[], right: readonly T[], compare: Comparator<T>): T[] {
  const result: T[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (compare(left[i], right[j]) <= 0) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);
  return result;
}

/** Merge sort: split at the midpoint, sort each half, merge the results. */
export function mergeSort<T>(input: readonly T[], compare: Comparator<T>): T[] {
  if (input.length <= 1) return [...input];
  const mid = Math.floor(input.length / 2);
  const left = mergeSort(input.slice(0, mid), compare);
  const right = mergeSort(input.slice(mid), compare);
  return merge(left, right, compare);
}

/** Lomuto partition: pivot = last element; returns the pivot's final sorted index. */
export function partition<T>(arr: T[], low: number, high: number, compare: Comparator<T>): number {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (compare(arr[j], pivot) <= 0) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

function quickSortInPlace<T>(arr: T[], low: number, high: number, compare: Comparator<T>): void {
  if (low < high) {
    const pivotIndex = partition(arr, low, high, compare);
    quickSortInPlace(arr, low, pivotIndex - 1, compare);
    quickSortInPlace(arr, pivotIndex + 1, high, compare);
  }
}

/** Quicksort: partition around a pivot, recurse on both sides. */
export function quickSort<T>(input: readonly T[], compare: Comparator<T>): T[] {
  const arr = [...input];
  quickSortInPlace(arr, 0, arr.length - 1, compare);
  return arr;
}

// Convenience wrappers for plain number arrays.
export function mergeSortNumbers(input: readonly number[]): number[] {
  return mergeSort(input, ascending);
}
export function quickSortNumbers(input: readonly number[]): number[] {
  return quickSort(input, ascending);
}

// Exercise: quicksort with a fixed last-element pivot is O(n^2) on sorted
// input. Write quickSortRandomized(input, compare) that avoids this by
// swapping a random element into the pivot slot before partitioning.
// Solution:
function quickSortRandomizedInPlace<T>(
  arr: T[],
  low: number,
  high: number,
  compare: Comparator<T>
): void {
  if (low < high) {
    const randomIndex = low + Math.floor(Math.random() * (high - low + 1));
    [arr[randomIndex], arr[high]] = [arr[high], arr[randomIndex]];
    const pivotIndex = partition(arr, low, high, compare);
    quickSortRandomizedInPlace(arr, low, pivotIndex - 1, compare);
    quickSortRandomizedInPlace(arr, pivotIndex + 1, high, compare);
  }
}
export function quickSortRandomized<T>(input: readonly T[], compare: Comparator<T>): T[] {
  const arr = [...input];
  quickSortRandomizedInPlace(arr, 0, arr.length - 1, compare);
  return arr;
}

// Exercise: reuse the merge step to count inversions in O(n log n),
// the efficient counterpart to lesson 01's O(n^2) countInversions.
// Solution:
function mergeAndCount(arr: number[], low: number, mid: number, high: number): number {
  const left = arr.slice(low, mid + 1);
  const right = arr.slice(mid + 1, high + 1);
  let i = 0;
  let j = 0;
  let k = low;
  let count = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      arr[k++] = left[i++];
    } else {
      arr[k++] = right[j++];
      count += left.length - i; // every remaining left element is an inversion with right[j]
    }
  }
  while (i < left.length) arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
  return count;
}
function countAndSort(arr: number[], low: number, high: number): number {
  if (low >= high) return 0;
  const mid = Math.floor((low + high) / 2);
  const count = countAndSort(arr, low, mid) + countAndSort(arr, mid + 1, high) + mergeAndCount(arr, low, mid, high);
  return count;
}
export function countInversionsMergeSort(arr: readonly number[]): number {
  const copy = [...arr];
  return countAndSort(copy, 0, copy.length - 1);
}

// LeetCode 912: Sort an Array -- O(n log n) merge sort, correct at any input size.
export function sortArray(nums: readonly number[]): number[] {
  return mergeSortNumbers(nums);
}

// LeetCode 215: Kth Largest Element in an Array -- quickselect using the
// same partition step, only recursing into the side containing the answer.
function quickSelect(arr: number[], low: number, high: number, targetIndex: number): number {
  if (low === high) return arr[low];
  const pivotIndex = partition(arr, low, high, ascending);
  if (targetIndex === pivotIndex) return arr[targetIndex];
  if (targetIndex < pivotIndex) return quickSelect(arr, low, pivotIndex - 1, targetIndex);
  return quickSelect(arr, pivotIndex + 1, high, targetIndex);
}
export function findKthLargest(nums: readonly number[], k: number): number {
  const arr = [...nums];
  const targetIndex = arr.length - k; // kth largest == (n-k)th smallest, 0-indexed ascending
  return quickSelect(arr, 0, arr.length - 1, targetIndex);
}

// LeetCode 88: Merge Sorted Array -- merge back-to-front so nums1 can be
// filled in place without extra space.
export function mergeSortedArray(nums1: number[], m: number, nums2: readonly number[], n: number): void {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k] = nums1[i];
      i--;
    } else {
      nums1[k] = nums2[j];
      j--;
    }
    k--;
  }
}

// --- run ---
if (require.main === module) {
  const input = [5, 2, 4, 1, 3];
  const expected = [1, 2, 3, 4, 5];

  console.assert(
    JSON.stringify(mergeSortNumbers(input)) === JSON.stringify(expected),
    'mergeSortNumbers should sort ascending'
  );
  console.assert(
    JSON.stringify(quickSortNumbers(input)) === JSON.stringify(expected),
    'quickSortNumbers should sort ascending'
  );
  console.assert(
    JSON.stringify(input) === JSON.stringify([5, 2, 4, 1, 3]),
    'sort functions must not mutate their input'
  );
  console.assert(
    JSON.stringify(quickSortRandomized(input, ascending)) === JSON.stringify(expected),
    'quickSortRandomized should sort ascending regardless of pivot choice'
  );

  console.assert(countInversionsMergeSort([5, 2, 4, 1, 3]) === 7, 'countInversionsMergeSort should be 7');
  console.assert(countInversionsMergeSort([1, 2, 3, 4, 5]) === 0, 'a sorted array has 0 inversions');

  console.assert(
    JSON.stringify(sortArray([5, 2, 3, 1])) === JSON.stringify([1, 2, 3, 5]),
    'sortArray should solve LeetCode 912'
  );

  console.assert(findKthLargest([3, 2, 1, 5, 6, 4], 2) === 5, 'findKthLargest should match LeetCode 215 example 1');
  console.assert(
    findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) === 4,
    'findKthLargest should match LeetCode 215 example 2'
  );

  const nums1 = [1, 2, 3, 0, 0, 0];
  mergeSortedArray(nums1, 3, [2, 5, 6], 3);
  console.assert(JSON.stringify(nums1) === JSON.stringify([1, 2, 2, 3, 5, 6]), 'mergeSortedArray should match LeetCode 88 example');

  console.log('All lesson 02 checks passed.');
}
