// Companion code for ./02-implementing-queue.md

/** Naive array-backed queue, same approach as lesson 01, kept here for direct comparison. */
export class ArrayQueue<T> {
  private items: T[] = [];

  enqueue(value: T): void {
    this.items.push(value);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

/**
 * Circular-buffer-backed queue: a fixed-size array that wraps around via
 * modular arithmetic instead of shifting elements. `head` tracks the index
 * of the front element; `count` tracks how many slots are occupied. When
 * full, the backing array doubles (amortized O(1) growth).
 */
export class CircularBufferQueue<T> {
  private buffer: (T | undefined)[];
  private head = 0;
  private count = 0;

  constructor(initialCapacity = 4) {
    this.buffer = new Array<T | undefined>(Math.max(1, initialCapacity));
  }

  enqueue(value: T): void {
    if (this.count === this.buffer.length) {
      this.resize(this.buffer.length * 2);
    }
    const tail = (this.head + this.count) % this.buffer.length;
    this.buffer[tail] = value;
    this.count++;
  }

  dequeue(): T | undefined {
    if (this.count === 0) return undefined;
    const value = this.buffer[this.head];
    this.buffer[this.head] = undefined;
    this.head = (this.head + 1) % this.buffer.length;
    this.count--;
    return value;
  }

  peek(): T | undefined {
    return this.count === 0 ? undefined : this.buffer[this.head];
  }

  get size(): number {
    return this.count;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.count; i++) {
      result.push(this.buffer[(this.head + i) % this.buffer.length] as T);
    }
    return result;
  }

  private resize(newCapacity: number): void {
    const resized = new Array<T | undefined>(newCapacity);
    for (let i = 0; i < this.count; i++) {
      resized[i] = this.buffer[(this.head + i) % this.buffer.length];
    }
    this.buffer = resized;
    this.head = 0;
  }
}

interface QueueNode<T> {
  value: T;
  next: QueueNode<T> | null;
}

/** Linked-list-backed queue: O(1) enqueue/dequeue with no resizing, at the cost of per-node allocations. */
export class LinkedListQueue<T> {
  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;
  private count = 0;

  enqueue(value: T): void {
    const node: QueueNode<T> = { value, next: null };
    if (this.tail === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.count++;
  }

  dequeue(): T | undefined {
    if (this.head === null) return undefined;
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head === null) this.tail = null;
    this.count--;
    return value;
  }

  peek(): T | undefined {
    return this.head === null ? undefined : this.head.value;
  }

  get size(): number {
    return this.count;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  toArray(): T[] {
    const result: T[] = [];
    let node = this.head;
    while (node !== null) {
      result.push(node.value);
      node = node.next;
    }
    return result;
  }
}

// LeetCode 622: Design Circular Queue (Medium)
export class MyCircularQueue {
  private buffer: number[];
  private head = 0;
  private count = 0;
  private readonly capacity: number;

  constructor(k: number) {
    this.capacity = k;
    this.buffer = new Array<number>(k).fill(0);
  }

  enQueue(value: number): boolean {
    if (this.isFull()) return false;
    const tail = (this.head + this.count) % this.capacity;
    this.buffer[tail] = value;
    this.count++;
    return true;
  }

  deQueue(): boolean {
    if (this.isEmpty()) return false;
    this.head = (this.head + 1) % this.capacity;
    this.count--;
    return true;
  }

  Front(): number {
    return this.isEmpty() ? -1 : this.buffer[this.head];
  }

  Rear(): number {
    if (this.isEmpty()) return -1;
    const tailIndex = (this.head + this.count - 1) % this.capacity;
    return this.buffer[tailIndex];
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  isFull(): boolean {
    return this.count === this.capacity;
  }
}

// Exercise: build a LinkedListQueue<T> from a plain array, preserving FIFO order.
// Solution:
export function queueFromArray<T>(values: T[]): LinkedListQueue<T> {
  const queue = new LinkedListQueue<T>();
  for (const value of values) queue.enqueue(value);
  return queue;
}

// --- run ---
if (require.main === module) {
  const arrayQueue = new ArrayQueue<number>();
  arrayQueue.enqueue(10);
  arrayQueue.enqueue(20);
  console.assert(arrayQueue.dequeue() === 10, 'ArrayQueue preserves FIFO order');

  const circular = new CircularBufferQueue<number>(2);
  circular.enqueue(1);
  circular.enqueue(2);
  circular.enqueue(3); // forces a resize past the initial capacity of 2
  console.assert(circular.size === 3, 'CircularBufferQueue grows past its initial capacity');
  console.assert(circular.dequeue() === 1, 'CircularBufferQueue keeps FIFO order across a resize');
  console.assert(
    JSON.stringify(circular.toArray()) === JSON.stringify([2, 3]),
    'toArray reflects the remaining elements in order'
  );

  const linked = queueFromArray([1, 2, 3]);
  console.assert(
    JSON.stringify(linked.toArray()) === JSON.stringify([1, 2, 3]),
    'queueFromArray preserves input order'
  );
  console.assert(linked.dequeue() === 1, 'LinkedListQueue dequeues in FIFO order');

  const circularQueue = new MyCircularQueue(3);
  console.assert(circularQueue.enQueue(1) === true, 'enQueue succeeds while there is room');
  circularQueue.enQueue(2);
  circularQueue.enQueue(3);
  console.assert(circularQueue.enQueue(4) === false, 'enQueue fails once the queue is full');
  console.assert(circularQueue.Rear() === 3, 'Rear reflects the most recently queued value');
  console.assert(circularQueue.deQueue() === true, 'deQueue succeeds while non-empty');
  console.assert(circularQueue.enQueue(4) === true, 'freed slot allows a new enQueue');
  console.assert(circularQueue.Front() === 2, 'Front is unaffected by an enQueue at the rear');
  console.assert(circularQueue.Rear() === 4, 'Rear reflects the value written into the freed slot');

  console.log('All lesson 02 checks passed.');
}
