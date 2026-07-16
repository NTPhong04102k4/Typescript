// Companion code for ./03-heapify-insert-extract.md
import { MinHeap, Comparator, ascending } from './02-min-max-heap';

/** Bubble the value at index i down until the heap property holds below it. */
export function siftDown<T>(arr: T[], i: number, size: number, compare: Comparator<T>): void {
  let index = i;
  for (;;) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let best = index;
    if (left < size && compare(arr[left], arr[best]) < 0) best = left;
    if (right < size && compare(arr[right], arr[best]) < 0) best = right;
    if (best === index) break;
    const tmp = arr[index];
    arr[index] = arr[best];
    arr[best] = tmp;
    index = best;
  }
}

/** Bubble the value at index i up until the heap property holds above it. */
export function siftUp<T>(arr: T[], i: number, compare: Comparator<T>): void {
  let index = i;
  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    if (compare(arr[index], arr[parent]) < 0) {
      const tmp = arr[index];
      arr[index] = arr[parent];
      arr[parent] = tmp;
      index = parent;
    } else {
      break;
    }
  }
}

/**
 * Bottom-up heapify: turns any array into a valid heap in-place in O(n).
 * Starting from the last parent and sifting down (rather than sifting up
 * from every index) is what gives the O(n) bound instead of O(n log n).
 */
export function heapify<T>(arr: T[], compare: Comparator<T>): void {
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    siftDown(arr, i, arr.length, compare);
  }
}

/** Insert into an array-backed heap of the given logical size: O(log n). */
export function heapInsert<T>(arr: T[], value: T, compare: Comparator<T>): void {
  arr.push(value);
  siftUp(arr, arr.length - 1, compare);
}

/** Extract the root of an array-backed heap: O(log n). */
export function heapExtractRoot<T>(arr: T[], compare: Comparator<T>): T | undefined {
  if (arr.length === 0) return undefined;
  const root = arr[0];
  const last = arr.pop() as T;
  if (arr.length > 0) {
    arr[0] = last;
    siftDown(arr, 0, arr.length, compare);
  }
  return root;
}

/**
 * In-place ascending sort built entirely from heap primitives: heapify into
 * a max-heap, then repeatedly swap the root (current max) to the end and
 * shrink the heap by one. Demonstrates heapify + extract composing into a
 * full O(n log n) sorting algorithm.
 */
export function heapSort<T>(input: readonly T[], compare: Comparator<T>): T[] {
  const arr = [...input];
  const asMax: Comparator<T> = (a, b) => compare(b, a);
  heapify(arr, asMax);
  for (let end = arr.length - 1; end > 0; end--) {
    const tmp = arr[0];
    arr[0] = arr[end];
    arr[end] = tmp;
    siftDown(arr, 0, end, asMax);
  }
  return arr;
}

// Exercise: validate that an array satisfies the heap property for an
// arbitrary comparator (generalizes lesson 01's isMinHeap/isMaxHeap, which
// were hard-coded to numeric <=/>=).
export function isHeapStub<T>(_arr: readonly T[], _compare: Comparator<T>): boolean {
  throw new Error('not implemented');
}
// Solution:
export function isHeap<T>(arr: readonly T[], compare: Comparator<T>): boolean {
  for (let i = 0; i < arr.length; i++) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < arr.length && compare(arr[left], arr[i]) < 0) return false;
    if (right < arr.length && compare(arr[right], arr[i]) < 0) return false;
  }
  return true;
}

// --- run ---
if (require.main === module) {
  const arr = [9, 4, 7, 1, 8, 2, 3];
  heapify(arr, ascending);
  console.assert(isHeap(arr, ascending), 'heapify should produce a valid min-heap');
  console.assert(arr[0] === 1, 'the smallest element must end up at the root');

  heapInsert(arr, 0, ascending);
  console.assert(arr[0] === 0, 'inserting a new global minimum must bubble to the root');
  console.assert(isHeap(arr, ascending), 'heap property must hold after insert');

  const extracted = heapExtractRoot(arr, ascending);
  console.assert(extracted === 0, 'extractRoot should return the current minimum, 0');
  console.assert(isHeap(arr, ascending), 'heap property must hold after extract');

  const sorted = heapSort([5, 3, 8, 1, 9, 2], ascending);
  console.assert(
    JSON.stringify(sorted) === JSON.stringify([1, 2, 3, 5, 8, 9]),
    'heapSort should produce ascending order'
  );

  const minHeap = new MinHeap<number>(ascending, [5, 3, 8, 1, 9]);
  console.assert(
    minHeap.pop() === heapExtractRoot([1, 3, 8, 5, 9], ascending),
    'MinHeap.pop must agree with the raw-array heapExtractRoot on the same heap layout'
  );

  console.log('03-heapify-insert-extract: all assertions passed');
}
