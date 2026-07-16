// Companion code for ./02-implementing-stack.md

import { IStack } from './01-stack-fundamentals';

/**
 * Array-backed stack (same strategy as lesson 01's `Stack<T>`, redefined
 * here under an explicit name so it can be compared side by side with
 * the node-backed version below).
 */
export class ArrayStack<T> implements IStack<T> {
  private items: T[] = [];

  push(value: T): void {
    this.items.push(value);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items];
  }
}

/** Singly linked node used by the node-backed stack. */
class StackNode<T> {
  constructor(
    public value: T,
    public next: StackNode<T> | null,
  ) {}
}

/**
 * Node-backed stack: push/pop only ever touch the head pointer, so there
 * is no array resizing/copying at all — every operation is genuinely
 * O(1), not just amortized O(1). The cost is one heap-allocated node
 * (value + next pointer) per element instead of a packed, contiguous
 * backing array.
 */
export class NodeStack<T> implements IStack<T> {
  private head: StackNode<T> | null = null;
  private count = 0;

  push(value: T): void {
    this.head = new StackNode(value, this.head);
    this.count++;
  }

  pop(): T | undefined {
    if (this.head === null) {
      return undefined;
    }
    const value = this.head.value;
    this.head = this.head.next;
    this.count--;
    return value;
  }

  peek(): T | undefined {
    return this.head?.value;
  }

  isEmpty(): boolean {
    return this.head === null;
  }

  size(): number {
    return this.count;
  }
}

// LeetCode 225: Implement Stack using Queues (Easy)
// Single-queue approach: after every push, rotate the queue so the
// newest element sits at the front, making the queue's own dequeue
// order match a stack's pop order.
export class MyStackUsingQueues {
  private queue: number[] = [];

  push(x: number): void {
    this.queue.push(x);
    const rotations = this.queue.length - 1;
    for (let i = 0; i < rotations; i++) {
      const front = this.queue.shift() as number;
      this.queue.push(front);
    }
  }

  pop(): number {
    return this.queue.shift() as number;
  }

  top(): number {
    return this.queue[0];
  }

  empty(): boolean {
    return this.queue.length === 0;
  }
}

// LeetCode 232: Implement Queue using Stacks (Easy)
// Included for contrast: this lesson is about implementing a stack, and
// this problem is the mirror image — a FIFO built from two LIFOs.
export class MyQueueUsingStacks {
  private inStack = new ArrayStack<number>();
  private outStack = new ArrayStack<number>();

  push(x: number): void {
    this.inStack.push(x);
  }

  private transfer(): void {
    if (this.outStack.isEmpty()) {
      while (!this.inStack.isEmpty()) {
        this.outStack.push(this.inStack.pop() as number);
      }
    }
  }

  pop(): number {
    this.transfer();
    return this.outStack.pop() as number;
  }

  peek(): number {
    this.transfer();
    return this.outStack.peek() as number;
  }

  empty(): boolean {
    return this.inStack.isEmpty() && this.outStack.isEmpty();
  }
}

// Exercise: implement isPalindrome(s: string): boolean using an IStack<string>
// (either backing works — the algorithm only needs push/pop/isEmpty).
// Solution:
export function isPalindrome(s: string): boolean {
  const stack: IStack<string> = new ArrayStack<string>();
  for (const ch of s) {
    stack.push(ch);
  }
  for (const ch of s) {
    if (stack.pop() !== ch) {
      return false;
    }
  }
  return true;
}

// --- run ---
if (require.main === module) {
  const arrayStack = new ArrayStack<number>();
  const nodeStack = new NodeStack<number>();
  for (const value of [1, 2, 3, 4]) {
    arrayStack.push(value);
    nodeStack.push(value);
  }
  const arrayPops: number[] = [];
  const nodePops: number[] = [];
  while (!arrayStack.isEmpty()) {
    arrayPops.push(arrayStack.pop() as number);
    nodePops.push(nodeStack.pop() as number);
  }
  console.assert(
    JSON.stringify(arrayPops) === JSON.stringify(nodePops),
    'array-backed and node-backed stacks must pop in the same LIFO order',
  );
  console.assert(JSON.stringify(arrayPops) === JSON.stringify([4, 3, 2, 1]), 'pop order is LIFO');

  const stackQueue = new MyStackUsingQueues();
  stackQueue.push(1);
  stackQueue.push(2);
  stackQueue.push(3);
  console.assert(stackQueue.top() === 3, 'top should be the most recently pushed value');
  console.assert(stackQueue.pop() === 3, 'pop should return the most recently pushed value');
  console.assert(stackQueue.top() === 2, 'top should now be the previous value');
  console.assert(stackQueue.empty() === false, 'stack still has elements');

  const queueStack = new MyQueueUsingStacks();
  queueStack.push(1);
  queueStack.push(2);
  queueStack.push(3);
  console.assert(queueStack.peek() === 1, 'FIFO queue should peek the first pushed value');
  console.assert(queueStack.pop() === 1, 'FIFO queue should pop the first pushed value');
  console.assert(queueStack.peek() === 2, 'next in line is the second pushed value');

  console.assert(isPalindrome('racecar') === true, '"racecar" is a palindrome');
  console.assert(isPalindrome('hello') === false, '"hello" is not a palindrome');

  console.log('02-implementing-stack OK');
}
