// Companion code for ./01-comparison-sorts.md

/** A comparator returns <0 if a should come before b, >0 if after, 0 if equal. */
export type Comparator<T> = (a: T, b: T) => number;

/** Default ascending comparator for numbers. */
export function ascending(a: number, b: number): number {
  return a - b;
}

/** Bubble sort: repeatedly swap adjacent out-of-order pairs; largest bubbles to the end each pass. */
export function bubbleSort<T>(input: readonly T[], compare: Comparator<T>): T[] {
  const arr = [...input];
  const n = arr.length;
  for (let pass = 0; pass < n - 1; pass++) {
    let swapped = false;
    const lastUnsorted = n - 1 - pass;
    for (let i = 0; i < lastUnsorted; i++) {
      if (compare(arr[i], arr[i + 1]) > 0) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}

/** Insertion sort: grow a sorted prefix, shifting larger elements right to make room. */
export function insertionSort<T>(input: readonly T[], compare: Comparator<T>): T[] {
  const arr = [...input];
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    let j = i - 1;
    while (j >= 0 && compare(arr[j], current) > 0) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}

/** Selection sort: repeatedly select the minimum of the unsorted suffix and swap it into place. */
export function selectionSort<T>(input: readonly T[], compare: Comparator<T>): T[] {
  const arr = [...input];
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (compare(arr[j], arr[minIndex]) < 0) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}

// Convenience wrappers for plain number arrays.
export function bubbleSortNumbers(input: readonly number[]): number[] {
  return bubbleSort(input, ascending);
}
export function insertionSortNumbers(input: readonly number[]): number[] {
  return insertionSort(input, ascending);
}
export function selectionSortNumbers(input: readonly number[]): number[] {
  return selectionSort(input, ascending);
}

// Exercise: write isSorted(arr, compare) that returns whether arr is sorted
// ascending according to compare, without sorting it.
// Solution:
export function isSorted<T>(arr: readonly T[], compare: Comparator<T>): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (compare(arr[i - 1], arr[i]) > 0) return false;
  }
  return true;
}

// Exercise: write countInversions(arr) that counts every pair (i, j) with
// i < j and arr[i] > arr[j] -- the number of adjacent swaps bubble sort
// would perform to fully sort the array.
// Solution:
export function countInversions(arr: readonly number[]): number {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) count++;
    }
  }
  return count;
}

// LeetCode 977: Squares of a Sorted Array -- two pointers from both ends,
// since the largest squares come from the most negative or most positive value.
export function sortedSquares(nums: readonly number[]): number[] {
  const n = nums.length;
  const result = new Array<number>(n);
  let left = 0;
  let right = n - 1;
  let pos = n - 1;
  while (left <= right) {
    const leftSq = nums[left] * nums[left];
    const rightSq = nums[right] * nums[right];
    if (leftSq > rightSq) {
      result[pos] = leftSq;
      left++;
    } else {
      result[pos] = rightSq;
      right--;
    }
    pos--;
  }
  return result;
}

// LeetCode 561: Array Partition -- sort, then sum every element at an even index.
export function arrayPairSum(nums: readonly number[]): number {
  const sorted = insertionSortNumbers(nums);
  let sum = 0;
  for (let i = 0; i < sorted.length; i += 2) {
    sum += sorted[i];
  }
  return sum;
}

// LeetCode 912: Sort an Array -- correctness baseline with insertion sort.
// (Large inputs need an O(n log n) algorithm; see lesson 02.)
export function sortArrayInsertion(nums: readonly number[]): number[] {
  return insertionSortNumbers(nums);
}

// --- run ---
if (require.main === module) {
  const input = [5, 2, 4, 1, 3];
  const expected = [1, 2, 3, 4, 5];

  console.assert(
    JSON.stringify(bubbleSortNumbers(input)) === JSON.stringify(expected),
    'bubbleSortNumbers should sort ascending'
  );
  console.assert(
    JSON.stringify(insertionSortNumbers(input)) === JSON.stringify(expected),
    'insertionSortNumbers should sort ascending'
  );
  console.assert(
    JSON.stringify(selectionSortNumbers(input)) === JSON.stringify(expected),
    'selectionSortNumbers should sort ascending'
  );
  console.assert(
    JSON.stringify(input) === JSON.stringify([5, 2, 4, 1, 3]),
    'sort functions must not mutate their input'
  );

  console.assert(isSorted([1, 2, 3], ascending) === true, '[1,2,3] is sorted');
  console.assert(isSorted([3, 1, 2], ascending) === false, '[3,1,2] is not sorted');

  console.assert(countInversions([5, 2, 4, 1, 3]) === 7, 'countInversions should be 7 for [5,2,4,1,3]');
  console.assert(countInversions([1, 2, 3, 4, 5]) === 0, 'a sorted array has 0 inversions');

  console.assert(
    JSON.stringify(sortedSquares([-4, -1, 0, 3, 10])) === JSON.stringify([0, 1, 9, 16, 100]),
    'sortedSquares should match LeetCode 977 example'
  );

  console.assert(arrayPairSum([1, 4, 3, 2]) === 4, 'arrayPairSum should match LeetCode 561 example');

  console.assert(
    JSON.stringify(sortArrayInsertion([5, 2, 3, 1])) === JSON.stringify([1, 2, 3, 5]),
    'sortArrayInsertion should sort ascending'
  );

  console.log('All lesson 01 checks passed.');
}
