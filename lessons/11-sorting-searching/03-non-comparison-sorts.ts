// Companion code for ./03-non-comparison-sorts.md

/**
 * Counting sort for non-negative integers. O(n + k) time, O(n + k) space,
 * stable. Placing elements right-to-left after the prefix sum is what
 * preserves the original relative order of equal values.
 */
export function countingSort(input: readonly number[]): number[] {
  if (input.length === 0) return [];
  const max = Math.max(...input);
  const count = new Array<number>(max + 1).fill(0);
  for (const value of input) count[value]++;
  for (let i = 1; i <= max; i++) count[i] += count[i - 1];

  const output = new Array<number>(input.length).fill(0);
  for (let i = input.length - 1; i >= 0; i--) {
    const value = input[i];
    output[count[value] - 1] = value;
    count[value]--;
  }
  return output;
}

/** One stable counting-sort pass keyed on a single decimal digit (exp = 1, 10, 100, ...). */
export function countingSortByDigit(arr: readonly number[], exp: number): number[] {
  const n = arr.length;
  const output = new Array<number>(n).fill(0);
  const count = new Array<number>(10).fill(0);
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }
  return output;
}

/** LSD radix sort for non-negative integers: one stable counting-sort pass per digit. */
export function radixSort(input: readonly number[]): number[] {
  if (input.length === 0) return [];
  let arr = [...input];
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    arr = countingSortByDigit(arr, exp);
  }
  return arr;
}

// Exercise: countingSort only works on non-negative integers. Write
// countingSortWithNegatives(input) that also handles negative values.
// Solution:
export function countingSortWithNegatives(input: readonly number[]): number[] {
  if (input.length === 0) return [];
  const min = Math.min(...input);
  const shifted = input.map((value) => value - min);
  const sortedShifted = countingSort(shifted);
  return sortedShifted.map((value) => value + min);
}

// Exercise: non-comparison sorts have no comparator to flip for descending
// order. Write radixSortDescending(input) that reuses radixSort.
// Solution:
export function radixSortDescending(input: readonly number[]): number[] {
  return radixSort(input).reverse();
}

// LeetCode 75: Sort Colors -- 3-bucket counting sort in place.
export function sortColors(nums: number[]): void {
  const count = [0, 0, 0];
  for (const value of nums) count[value]++;
  let index = 0;
  for (let color = 0; color < 3; color++) {
    for (let c = 0; c < count[color]; c++) {
      nums[index++] = color;
    }
  }
}

// LeetCode 1122: Relative Sort Array -- count arr1, drain in arr2's order,
// then append leftovers ascending.
export function relativeSortArray(arr1: readonly number[], arr2: readonly number[]): number[] {
  const maxVal = Math.max(...arr1, 0);
  const count = new Array<number>(maxVal + 1).fill(0);
  for (const value of arr1) count[value]++;

  const result: number[] = [];
  for (const value of arr2) {
    while (count[value] > 0) {
      result.push(value);
      count[value]--;
    }
  }
  for (let value = 0; value <= maxVal; value++) {
    while (count[value] > 0) {
      result.push(value);
      count[value]--;
    }
  }
  return result;
}

// LeetCode 164: Maximum Gap -- radix sort in linear time, then scan for the
// largest adjacent gap (a comparison sort would only give O(n log n)).
export function maximumGap(nums: readonly number[]): number {
  if (nums.length < 2) return 0;
  const sorted = radixSort(nums);
  let maxGap = 0;
  for (let i = 1; i < sorted.length; i++) {
    maxGap = Math.max(maxGap, sorted[i] - sorted[i - 1]);
  }
  return maxGap;
}

// --- run ---
if (require.main === module) {
  console.assert(
    JSON.stringify(countingSort([4, 1, 3, 4, 3, 2, 1])) === JSON.stringify([1, 1, 2, 3, 3, 4, 4]),
    'countingSort should sort ascending and stably'
  );

  console.assert(
    JSON.stringify(radixSort([170, 45, 75, 90, 802, 24, 2, 66])) ===
      JSON.stringify([2, 24, 45, 66, 75, 90, 170, 802]),
    'radixSort should match the CLRS trace'
  );

  console.assert(
    JSON.stringify(countingSortWithNegatives([-5, -1, 3, -2, 0])) === JSON.stringify([-5, -2, -1, 0, 3]),
    'countingSortWithNegatives should handle negative integers'
  );

  console.assert(
    JSON.stringify(radixSortDescending([170, 45, 75, 90, 802, 24, 2, 66])) ===
      JSON.stringify([802, 170, 90, 75, 66, 45, 24, 2]),
    'radixSortDescending should reverse the ascending result'
  );

  const colors = [2, 0, 2, 1, 1, 0];
  sortColors(colors);
  console.assert(JSON.stringify(colors) === JSON.stringify([0, 0, 1, 1, 2, 2]), 'sortColors should match LeetCode 75 example');

  console.assert(
    JSON.stringify(relativeSortArray([2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 19], [2, 1, 4, 3, 9, 6])) ===
      JSON.stringify([2, 2, 2, 1, 4, 3, 3, 9, 6, 7, 19]),
    'relativeSortArray should match LeetCode 1122 example'
  );

  console.assert(maximumGap([3, 6, 9, 1]) === 3, 'maximumGap should match LeetCode 164 example');

  console.log('All lesson 03 checks passed.');
}
