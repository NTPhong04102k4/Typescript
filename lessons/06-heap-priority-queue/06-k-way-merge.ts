// Companion code for ./06-k-way-merge.md
import { MinHeap } from './02-min-max-heap';

/** Singly linked list node, as used by LeetCode's list problems. */
export class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

export function arrayToList(values: readonly number[]): ListNode | null {
  let head: ListNode | null = null;
  for (let i = values.length - 1; i >= 0; i--) head = new ListNode(values[i], head);
  return head;
}

export function listToArray(head: ListNode | null): number[] {
  const out: number[] = [];
  for (let node = head; node !== null; node = node.next) out.push(node.val);
  return out;
}

// --- LeetCode 23. Merge k Sorted Lists (Hard) ---
// https://leetcode.com/problems/merge-k-sorted-lists/
// Push every list's head into a min-heap keyed by value. Repeatedly pop the
// smallest node, append it to the output, and push its `next` (if any) --
// the heap always holds at most k nodes, one per still-active list.
export function mergeKLists(lists: ReadonlyArray<ListNode | null>): ListNode | null {
  const heap = new MinHeap<ListNode>((a, b) => a.val - b.val);
  for (const head of lists) if (head !== null) heap.push(head);

  const dummy = new ListNode(0);
  let tail = dummy;
  while (!heap.isEmpty()) {
    const node = heap.pop() as ListNode;
    tail.next = node;
    tail = node;
    if (node.next !== null) heap.push(node.next);
  }
  return dummy.next;
}

// --- LeetCode 378. Kth Smallest Element in a Sorted Matrix (Medium) ---
// https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/
// Each row is already sorted, so this is a k-way merge of n rows: seed the
// heap with the first element of each row, then pop-and-advance k times.
export function kthSmallest(matrix: readonly number[][], k: number): number {
  const n = matrix.length;
  const heap = new MinHeap<[number, number, number]>((a, b) => a[0] - b[0]); // [value, row, col]
  for (let row = 0; row < Math.min(n, k); row++) {
    heap.push([matrix[row][0], row, 0]);
  }

  let result = -1;
  for (let i = 0; i < k; i++) {
    const [value, row, col] = heap.pop() as [number, number, number];
    result = value;
    if (col + 1 < n) heap.push([matrix[row][col + 1], row, col + 1]);
  }
  return result;
}

// Exercise: generalize the k-way merge pattern to plain sorted number
// arrays instead of linked lists.
export function mergeKSortedArraysStub(_arrays: readonly number[][]): number[] {
  throw new Error('not implemented');
}
// Solution:
export function mergeKSortedArrays(arrays: readonly number[][]): number[] {
  const heap = new MinHeap<[number, number, number]>((a, b) => a[0] - b[0]); // [value, arrIdx, elemIdx]
  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i].length > 0) heap.push([arrays[i][0], i, 0]);
  }

  const result: number[] = [];
  while (!heap.isEmpty()) {
    const [value, arrIdx, elemIdx] = heap.pop() as [number, number, number];
    result.push(value);
    if (elemIdx + 1 < arrays[arrIdx].length) {
      heap.push([arrays[arrIdx][elemIdx + 1], arrIdx, elemIdx + 1]);
    }
  }
  return result;
}

// --- run ---
if (require.main === module) {
  const lists = [
    arrayToList([1, 4, 5]),
    arrayToList([1, 3, 4]),
    arrayToList([2, 6]),
  ];
  const merged = listToArray(mergeKLists(lists));
  console.assert(
    JSON.stringify(merged) === JSON.stringify([1, 1, 2, 3, 4, 4, 5, 6]),
    'merging [1,4,5], [1,3,4], [2,6] should give a fully sorted sequence'
  );
  console.assert(mergeKLists([]) === null, 'merging an empty list of lists should return null');

  const matrix = [
    [1, 5, 9],
    [10, 11, 13],
    [12, 13, 15],
  ];
  console.assert(kthSmallest(matrix, 8) === 13, 'the 8th smallest element of the sample matrix should be 13');
  console.assert(kthSmallest(matrix, 1) === 1, 'the 1st smallest element should be the top-left corner, 1');

  const arrays = [[1, 4, 5], [1, 3, 4], [2, 6]];
  const mergedArrays = mergeKSortedArrays(arrays);
  const expected = arrays.flat().sort((a, b) => a - b);
  console.assert(
    JSON.stringify(mergedArrays) === JSON.stringify(expected),
    'mergeKSortedArrays must agree with a full sort of every element'
  );

  console.log('06-k-way-merge: all assertions passed');
}
