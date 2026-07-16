// Companion code for ./02-min-max-heap.md

/** Returns negative if a sorts before b, positive if after, 0 if tied. */
export type Comparator<T> = (a: T, b: T) => number;

export const ascending: Comparator<number> = (a, b) => a - b;
export const descending: Comparator<number> = (a, b) => b - a;

/**
 * Binary min-heap over a comparator: the smallest element (per `compare`) is
 * always at index 0. Backed by a plain array using the 2i+1 / 2i+2 child rule.
 */
export class MinHeap<T> {
  private data: T[] = [];

  constructor(private readonly compare: Comparator<T>, initial: readonly T[] = []) {
    for (const item of initial) this.push(item);
  }

  get size(): number {
    return this.data.length;
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  peek(): T | undefined {
    return this.data[0];
  }

  push(value: T): void {
    this.data.push(value);
    this.siftUp(this.data.length - 1);
  }

  pop(): T | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop() as T;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  toArray(): readonly T[] {
    return [...this.data];
  }

  private siftUp(index: number): void {
    let i = index;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(this.data[i], this.data[parent]) < 0) {
        this.swap(i, parent);
        i = parent;
      } else {
        break;
      }
    }
  }

  private siftDown(index: number): void {
    let i = index;
    const n = this.data.length;
    for (;;) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && this.compare(this.data[left], this.data[smallest]) < 0) smallest = left;
      if (right < n && this.compare(this.data[right], this.data[smallest]) < 0) smallest = right;
      if (smallest === i) break;
      this.swap(i, smallest);
      i = smallest;
    }
  }

  private swap(i: number, j: number): void {
    const tmp = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = tmp;
  }
}

/**
 * Binary max-heap: composes a MinHeap with an inverted comparator, so the
 * "largest" element per `compare` floats to the top instead.
 */
export class MaxHeap<T> {
  private readonly inner: MinHeap<T>;

  constructor(compare: Comparator<T>, initial: readonly T[] = []) {
    this.inner = new MinHeap<T>((a, b) => compare(b, a), initial);
  }

  get size(): number {
    return this.inner.size;
  }

  isEmpty(): boolean {
    return this.inner.isEmpty();
  }

  peek(): T | undefined {
    return this.inner.peek();
  }

  push(value: T): void {
    this.inner.push(value);
  }

  pop(): T | undefined {
    return this.inner.pop();
  }

  toArray(): readonly T[] {
    return this.inner.toArray();
  }
}

// Exercise: implement peekReplace - pop the root and push a new value,
// exposed as a single convenience call (common in interview follow-ups:
// "what if you need to swap the root for a new value?").
export function peekReplaceStub<T>(_heap: MinHeap<T>, _value: T): T | undefined {
  throw new Error('not implemented');
}
// Solution: compose the existing public API. A true single-pass version
// would need heap internals exposed; this keeps behavior identical while
// staying outside the class.
export function peekReplace<T>(heap: MinHeap<T>, value: T): T | undefined {
  const top = heap.pop();
  heap.push(value);
  return top;
}

// --- run ---
if (require.main === module) {
  const minHeap = new MinHeap<number>(ascending, [5, 3, 8, 1, 9]);
  console.assert(minHeap.peek() === 1, 'min-heap root should be the smallest value, 1');
  console.assert(minHeap.pop() === 1, 'extracting the root should return 1');
  console.assert(minHeap.peek() === 3, 'next smallest after removing 1 should be 3');

  const maxHeap = new MaxHeap<number>(ascending, [5, 3, 8, 1, 9]);
  console.assert(maxHeap.peek() === 9, 'max-heap root should be the largest value, 9');
  console.assert(maxHeap.pop() === 9, 'extracting the root should return 9');
  console.assert(maxHeap.peek() === 8, 'next largest after removing 9 should be 8');

  const sortedOut: number[] = [];
  const h = new MinHeap<number>(ascending, [4, 1, 7, 3, 8, 5]);
  while (!h.isEmpty()) sortedOut.push(h.pop() as number);
  console.assert(
    JSON.stringify(sortedOut) === JSON.stringify([1, 3, 4, 5, 7, 8]),
    'draining a min-heap one pop at a time yields ascending order'
  );

  console.assert(
    peekReplace(new MinHeap<number>(ascending, [1, 2, 3]), 10) === 1,
    'peekReplace should return the old root, 1'
  );

  console.log('02-min-max-heap: all assertions passed');
}
