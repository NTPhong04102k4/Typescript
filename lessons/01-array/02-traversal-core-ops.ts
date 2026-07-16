// Companion code for ./02-traversal-core-ops.md

/** O(1) amortized: append to the tail. Returns the new length. */
export function appendEnd<T>(arr: T[], value: T): number {
  return arr.push(value);
}

/** O(1): remove from the tail. */
export function removeEnd<T>(arr: T[]): T | undefined {
  return arr.pop();
}

/**
 * O(n): manually insert at the front by shifting every element right by
 * one slot before writing the new value at index 0.
 */
export function manualUnshift<T>(arr: T[], value: T): number {
  arr.length = arr.length + 1;
  for (let i = arr.length - 1; i > 0; i--) {
    arr[i] = arr[i - 1];
  }
  arr[0] = value;
  return arr.length;
}

/**
 * O(n): manually remove the front element by shifting every remaining
 * element left by one slot.
 */
export function manualShift<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  const first = arr[0];
  for (let i = 0; i < arr.length - 1; i++) {
    arr[i] = arr[i + 1];
  }
  arr.length = arr.length - 1;
  return first;
}

// Exercise: implement insertAt(arr, index, value) that inserts value at an
// arbitrary index by shifting elements right, like Array.prototype.splice.
// Solution:
export function insertAt<T>(arr: T[], index: number, value: T): void {
  arr.length = arr.length + 1;
  for (let i = arr.length - 1; i > index; i--) {
    arr[i] = arr[i - 1];
  }
  arr[index] = value;
}

// Exercise: implement removeAt(arr, index) that removes and returns the
// element at an arbitrary index by shifting elements left.
// Solution:
export function removeAt<T>(arr: T[], index: number): T | undefined {
  if (index < 0 || index >= arr.length) return undefined;
  const removed = arr[index];
  for (let i = index; i < arr.length - 1; i++) {
    arr[i] = arr[i + 1];
  }
  arr.length = arr.length - 1;
  return removed;
}

// LeetCode 27: Remove Element -- read/write two-pointer in-place overwrite.
export function removeElement(nums: number[], val: number): number {
  let writeIndex = 0;
  for (let readIndex = 0; readIndex < nums.length; readIndex++) {
    if (nums[readIndex] !== val) {
      nums[writeIndex] = nums[readIndex];
      writeIndex++;
    }
  }
  return writeIndex;
}

// --- run ---
if (require.main === module) {
  const a = [1, 2, 3, 4, 5];
  console.assert(appendEnd(a, 6) === 6, 'appendEnd should return the new length 6');
  console.assert(a[5] === 6, 'appendEnd should place 6 at the tail');
  console.assert(removeEnd(a) === 6, 'removeEnd should return the popped value 6');

  const b = [1, 2, 3, 4, 5];
  const newLen = manualUnshift(b, 0);
  console.assert(newLen === 6, 'manualUnshift should return new length 6');
  console.assert(JSON.stringify(b) === JSON.stringify([0, 1, 2, 3, 4, 5]), 'manualUnshift should shift everything right');

  const first = manualShift(b);
  console.assert(first === 0, 'manualShift should return the removed front value 0');
  console.assert(JSON.stringify(b) === JSON.stringify([1, 2, 3, 4, 5]), 'manualShift should shift everything left');

  const c = [1, 2, 4, 5];
  insertAt(c, 2, 3);
  console.assert(JSON.stringify(c) === JSON.stringify([1, 2, 3, 4, 5]), 'insertAt should insert 3 at index 2');

  const removed = removeAt(c, 2);
  console.assert(removed === 3, 'removeAt should return the removed value 3');
  console.assert(JSON.stringify(c) === JSON.stringify([1, 2, 4, 5]), 'removeAt should close the gap');

  const nums = [3, 2, 2, 3];
  const k = removeElement(nums, 3);
  console.assert(k === 2, 'removeElement should report 2 remaining elements');
  console.assert(nums[0] === 2 && nums[1] === 2, 'removeElement should keep the two 2s at the front');

  console.log('All lesson 02 checks passed.');
}
