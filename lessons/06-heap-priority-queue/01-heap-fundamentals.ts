// Companion code for ./01-heap-fundamentals.md

/** Index of the parent of node i in a 0-indexed array-backed binary heap. */
export function parentIndex(i: number): number {
  return Math.floor((i - 1) / 2);
}

/** Index of the left child of node i. */
export function leftChildIndex(i: number): number {
  return 2 * i + 1;
}

/** Index of the right child of node i. */
export function rightChildIndex(i: number): number {
  return 2 * i + 2;
}

/** Groups a flat heap array into level-by-level rows for tree-shaped printing. */
export function levelsOf<T>(arr: readonly T[]): T[][] {
  const levels: T[][] = [];
  let start = 0;
  let levelSize = 1;
  while (start < arr.length) {
    levels.push(arr.slice(start, Math.min(start + levelSize, arr.length)));
    start += levelSize;
    levelSize *= 2;
  }
  return levels;
}

/** True if arr satisfies the min-heap property at every node: parent <= both children. */
export function isMinHeap(arr: readonly number[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    const l = leftChildIndex(i);
    const r = rightChildIndex(i);
    if (l < arr.length && arr[i] > arr[l]) return false;
    if (r < arr.length && arr[i] > arr[r]) return false;
  }
  return true;
}

// Exercise: implement the max-heap mirror of isMinHeap: every parent must be
// >= both of its children.
export function isMaxHeapStub(_arr: readonly number[]): boolean {
  throw new Error('not implemented');
}
// Solution:
export function isMaxHeap(arr: readonly number[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    const l = leftChildIndex(i);
    const r = rightChildIndex(i);
    if (l < arr.length && arr[i] < arr[l]) return false;
    if (r < arr.length && arr[i] < arr[r]) return false;
  }
  return true;
}

// --- run ---
if (require.main === module) {
  console.assert(parentIndex(1) === 0 && parentIndex(2) === 0, 'nodes 1 and 2 share parent 0');
  console.assert(parentIndex(3) === 1 && parentIndex(4) === 1, 'nodes 3 and 4 share parent 1');
  console.assert(leftChildIndex(0) === 1 && rightChildIndex(0) === 2, 'root children are at 1 and 2');

  const minHeapArr = [1, 3, 2, 7, 4, 5, 9];
  console.assert(isMinHeap(minHeapArr) === true, 'array should satisfy the min-heap property');
  console.assert(isMinHeap([5, 3, 8]) === false, 'root 5 with smaller child 3 breaks min-heap property');

  const maxHeapArr = [9, 7, 8, 3, 4, 2, 1];
  console.assert(isMaxHeap(maxHeapArr) === true, 'array should satisfy the max-heap property');
  console.assert(isMaxHeap([1, 5]) === false, 'root 1 smaller than child 5 breaks max-heap property');

  console.assert(
    JSON.stringify(levelsOf(minHeapArr)) === JSON.stringify([[1], [3, 2], [7, 4, 5, 9]]),
    'levelsOf should group the array by breadth-first depth'
  );

  console.log('01-heap-fundamentals: all assertions passed');
}
