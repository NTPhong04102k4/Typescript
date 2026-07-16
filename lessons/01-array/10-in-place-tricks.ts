// Companion code for ./10-in-place-tricks.md

/** Reverse nums[left..right] in place. */
export function reverseRange(nums: number[], left: number, right: number): void {
  let l = left;
  let r = right;
  while (l < r) {
    const tmp = nums[l];
    nums[l] = nums[r];
    nums[r] = tmp;
    l++;
    r--;
  }
}

// LeetCode 189: Rotate Array.
// Rotate right by k using three reversals: whole array, first k, rest.
export function rotateArray(nums: number[], k: number): void {
  const n = nums.length;
  if (n === 0) return;

  const shift = ((k % n) + n) % n;
  reverseRange(nums, 0, n - 1);
  reverseRange(nums, 0, shift - 1);
  reverseRange(nums, shift, n - 1);
}

// Exercise: implement LeetCode 26, Remove Duplicates from Sorted Array --
// compact duplicates out in place using a read/write pointer pair,
// returning the count of unique elements.
// Solution:
export function removeDuplicatesSorted(nums: number[]): number {
  if (nums.length === 0) return 0;

  let writeIndex = 1;
  for (let readIndex = 1; readIndex < nums.length; readIndex++) {
    if (nums[readIndex] !== nums[writeIndex - 1]) {
      nums[writeIndex] = nums[readIndex];
      writeIndex++;
    }
  }

  return writeIndex;
}

// Exercise: implement LeetCode 41, First Missing Positive -- using cyclic
// sort, place every in-range value at its home index (value - 1), then
// scan once for the first index that doesn't hold its own value.
// Solution:
export function firstMissingPositive(nums: number[]): number {
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const target = nums[i] - 1;
      const tmp = nums[target];
      nums[target] = nums[i];
      nums[i] = tmp;
    }
  }

  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }

  return n + 1;
}

// --- run ---
if (require.main === module) {
  const a = [1, 2, 3, 4, 5, 6, 7];
  rotateArray(a, 3);
  console.assert(JSON.stringify(a) === JSON.stringify([5, 6, 7, 1, 2, 3, 4]), 'rotateArray should rotate right by 3');

  const b = [1, 1, 2, 2, 3];
  const uniqueCount = removeDuplicatesSorted(b);
  console.assert(uniqueCount === 3, 'removeDuplicatesSorted should report 3 unique elements');
  console.assert(
    b[0] === 1 && b[1] === 2 && b[2] === 3,
    'removeDuplicatesSorted should compact unique values to the front'
  );

  console.assert(firstMissingPositive([3, 4, -1, 1]) === 2, 'the first missing positive in [3,4,-1,1] is 2');
  console.assert(firstMissingPositive([1, 2, 0]) === 3, 'the first missing positive in [1,2,0] is 3');

  console.log('All lesson 10 checks passed.');
}
