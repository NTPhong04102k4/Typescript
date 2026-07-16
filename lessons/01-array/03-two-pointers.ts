// Companion code for ./03-two-pointers.md

/** Converging pointers: swap ends while moving inward. */
export function reverseInPlace<T>(arr: T[]): void {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const tmp = arr[left];
    arr[left] = arr[right];
    arr[right] = tmp;
    left++;
    right--;
  }
}

/** Converging pointers: compare ends while moving inward. */
export function isArrayPalindrome<T>(arr: readonly T[]): boolean {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    if (arr[left] !== arr[right]) return false;
    left++;
    right--;
  }
  return true;
}

// LeetCode 167: Two Sum II - Input Array Is Sorted.
// Converging pointers driven by the sum vs. target comparison.
// Returns 1-indexed positions, per the problem statement.
export function twoSumSorted(numbers: readonly number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [];
}

// Exercise: merge two already-sorted arrays into one sorted array using
// two same-direction pointers (the merge step of merge sort).
// Solution:
export function mergeSortedArrays(a: readonly number[], b: readonly number[]): number[] {
  const merged: number[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      merged.push(a[i]);
      i++;
    } else {
      merged.push(b[j]);
      j++;
    }
  }
  while (i < a.length) {
    merged.push(a[i]);
    i++;
  }
  while (j < b.length) {
    merged.push(b[j]);
    j++;
  }
  return merged;
}

// Exercise: given a sorted array, determine whether a pair exists whose
// difference equals `diff`, using two same-direction pointers.
// Solution:
export function hasPairWithDifference(sortedArr: readonly number[], diff: number): boolean {
  if (diff < 0) return false;
  let left = 0;
  let right = 1;
  while (right < sortedArr.length) {
    if (left === right) {
      right++;
      continue;
    }
    const gap = sortedArr[right] - sortedArr[left];
    if (gap === diff) return true;
    if (gap < diff) right++;
    else left++;
  }
  return false;
}

// --- run ---
if (require.main === module) {
  const a = [1, 2, 3, 4, 5];
  reverseInPlace(a);
  console.assert(JSON.stringify(a) === JSON.stringify([5, 4, 3, 2, 1]), 'reverseInPlace should reverse the array');

  console.assert(isArrayPalindrome([1, 2, 3, 2, 1]) === true, '[1,2,3,2,1] is a palindrome');
  console.assert(isArrayPalindrome([1, 2, 3]) === false, '[1,2,3] is not a palindrome');

  console.assert(
    JSON.stringify(twoSumSorted([2, 7, 11, 15], 9)) === JSON.stringify([1, 2]),
    'twoSumSorted should return 1-indexed positions [1, 2]'
  );

  console.assert(
    JSON.stringify(mergeSortedArrays([1, 3, 5], [2, 4, 6])) === JSON.stringify([1, 2, 3, 4, 5, 6]),
    'mergeSortedArrays should interleave both arrays in order'
  );

  console.assert(hasPairWithDifference([1, 2, 3, 5, 8], 3) === true, '(2, 5) and (5, 8) differ by 3');
  console.assert(hasPairWithDifference([1, 2, 3, 5, 8], 100) === false, 'no pair differs by 100');

  console.log('All lesson 03 checks passed.');
}
