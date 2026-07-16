// Companion code for ./03-deque.md

interface DequeNode<T> {
  value: T;
  prev: DequeNode<T> | null;
  next: DequeNode<T> | null;
}

/**
 * Double-ended queue backed by a doubly linked list: O(1) push/pop at
 * both the front and the back. Used directly by lesson 04's monotonic
 * queue, where elements are removed from either end depending on
 * comparisons against the newest value.
 */
export class Deque<T> {
  private head: DequeNode<T> | null = null;
  private tail: DequeNode<T> | null = null;
  private count = 0;

  pushFront(value: T): void {
    const node: DequeNode<T> = { value, prev: null, next: this.head };
    if (this.head !== null) this.head.prev = node;
    this.head = node;
    if (this.tail === null) this.tail = node;
    this.count++;
  }

  pushBack(value: T): void {
    const node: DequeNode<T> = { value, prev: this.tail, next: null };
    if (this.tail !== null) this.tail.next = node;
    this.tail = node;
    if (this.head === null) this.head = node;
    this.count++;
  }

  popFront(): T | undefined {
    if (this.head === null) return undefined;
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head !== null) this.head.prev = null;
    else this.tail = null;
    this.count--;
    return value;
  }

  popBack(): T | undefined {
    if (this.tail === null) return undefined;
    const value = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail !== null) this.tail.next = null;
    else this.head = null;
    this.count--;
    return value;
  }

  peekFront(): T | undefined {
    return this.head === null ? undefined : this.head.value;
  }

  peekBack(): T | undefined {
    return this.tail === null ? undefined : this.tail.value;
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

// LeetCode 641: Design Circular Deque (Medium)
export class MyCircularDeque {
  private buffer: number[];
  private head = 0;
  private count = 0;
  private readonly capacity: number;

  constructor(k: number) {
    this.capacity = k;
    this.buffer = new Array<number>(k).fill(0);
  }

  insertFront(value: number): boolean {
    if (this.isFull()) return false;
    this.head = (this.head - 1 + this.capacity) % this.capacity;
    this.buffer[this.head] = value;
    this.count++;
    return true;
  }

  insertLast(value: number): boolean {
    if (this.isFull()) return false;
    const tail = (this.head + this.count) % this.capacity;
    this.buffer[tail] = value;
    this.count++;
    return true;
  }

  deleteFront(): boolean {
    if (this.isEmpty()) return false;
    this.head = (this.head + 1) % this.capacity;
    this.count--;
    return true;
  }

  deleteLast(): boolean {
    if (this.isEmpty()) return false;
    this.count--;
    return true;
  }

  getFront(): number {
    return this.isEmpty() ? -1 : this.buffer[this.head];
  }

  getRear(): number {
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

// Exercise: check whether a sequence is a palindrome by popping from both
// ends of a Deque<T> and comparing until fewer than two elements remain.
// Solution:
export function isPalindromeDeque<T>(values: T[]): boolean {
  const deque = new Deque<T>();
  for (const value of values) deque.pushBack(value);

  while (deque.size > 1) {
    const front = deque.popFront();
    const back = deque.popBack();
    if (front !== back) return false;
  }

  return true;
}

// --- run ---
if (require.main === module) {
  const deque = new Deque<number>();
  deque.pushBack(2);
  deque.pushBack(3);
  deque.pushFront(1);
  console.assert(
    deque.peekFront() === 1 && deque.peekBack() === 3,
    'mixed pushFront/pushBack land at the correct ends'
  );
  console.assert(deque.popFront() === 1, 'popFront removes the current front');
  console.assert(deque.popBack() === 3, 'popBack removes the current back');
  console.assert(deque.size === 1 && deque.peekFront() === 2, 'only the middle element remains');

  console.assert(isPalindromeDeque([1, 2, 3, 2, 1]) === true, 'odd-length palindrome');
  console.assert(isPalindromeDeque([1, 2, 2, 1]) === true, 'even-length palindrome');
  console.assert(isPalindromeDeque([1, 2, 3, 4]) === false, 'non-palindrome is rejected');

  const circularDeque = new MyCircularDeque(3);
  console.assert(circularDeque.insertLast(1) === true, 'insertLast succeeds while there is room');
  circularDeque.insertLast(2);
  console.assert(circularDeque.insertFront(3) === true, 'insertFront succeeds while there is room');
  console.assert(circularDeque.insertFront(4) === false, 'insertFront fails once full');
  console.assert(circularDeque.getRear() === 2, 'getRear reflects the last inserted-at-back value');
  console.assert(circularDeque.isFull() === true, 'isFull reports true at capacity');
  console.assert(circularDeque.deleteLast() === true, 'deleteLast frees a slot');
  console.assert(circularDeque.insertFront(4) === true, 'freed slot allows a new insertFront');
  console.assert(circularDeque.getFront() === 4, 'getFront reflects the newest front value');

  console.log('All lesson 03 checks passed.');
}
