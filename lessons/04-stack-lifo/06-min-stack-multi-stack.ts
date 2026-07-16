// Companion code for ./06-min-stack-multi-stack.md

import { Stack } from './01-stack-fundamentals';

// LeetCode 155: Min Stack (Easy)
// A second, parallel stack tracks the running minimum: minStack[i] is
// always the minimum of stack[0..i]. Both stacks grow and shrink in
// lockstep, so getMin() is O(1) instead of rescanning on every call.
export class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];

  push(val: number): void {
    this.stack.push(val);
    const currentMin = this.minStack.length === 0 ? val : this.minStack[this.minStack.length - 1];
    this.minStack.push(Math.min(val, currentMin));
  }

  pop(): void {
    this.stack.pop();
    this.minStack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}

// LeetCode 1381: Design a Stack With Increment Operation (Medium)
// A bounded array-backed stack plus a bulk `increment` that adds `val` to
// the bottom `k` elements in O(k) — direct index access is the reason
// this uses a plain array instead of the push/pop-only IStack<T>.
export class CustomStack {
  private stack: number[] = [];
  private readonly maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  push(x: number): void {
    if (this.stack.length < this.maxSize) {
      this.stack.push(x);
    }
  }

  pop(): number {
    return this.stack.length === 0 ? -1 : (this.stack.pop() as number);
  }

  increment(k: number, val: number): void {
    const limit = Math.min(k, this.stack.length);
    for (let i = 0; i < limit; i++) {
      this.stack[i] += val;
    }
  }
}

// LeetCode 895: Maximum Frequency Stack (Hard)
// A genuine "multi-stack" design: elements are grouped by how many times
// they've been pushed so far, and each frequency group is its own
// Stack<number> (reused from lesson 01). Popping always takes from the
// group with the current maximum frequency, and within that group LIFO
// order breaks ties in favor of the most recently pushed element.
export class FreqStack {
  private freq = new Map<number, number>();
  private group = new Map<number, Stack<number>>();
  private maxFreq = 0;

  push(val: number): void {
    const f = (this.freq.get(val) ?? 0) + 1;
    this.freq.set(val, f);
    if (f > this.maxFreq) {
      this.maxFreq = f;
    }
    if (!this.group.has(f)) {
      this.group.set(f, new Stack<number>());
    }
    (this.group.get(f) as Stack<number>).push(val);
  }

  pop(): number {
    const topGroup = this.group.get(this.maxFreq) as Stack<number>;
    const val = topGroup.pop() as number;
    this.freq.set(val, this.maxFreq - 1);
    if (topGroup.isEmpty()) {
      this.group.delete(this.maxFreq);
      this.maxFreq--;
    }
    return val;
  }
}

// --- run ---
if (require.main === module) {
  const minStack = new MinStack();
  minStack.push(-2);
  minStack.push(0);
  minStack.push(-3);
  console.assert(minStack.getMin() === -3, 'getMin should be -3 after pushing -2, 0, -3');
  minStack.pop();
  console.assert(minStack.top() === 0, 'top should be 0 after popping -3');
  console.assert(minStack.getMin() === -2, 'getMin should recover to -2');

  const customStack = new CustomStack(3);
  customStack.push(1);
  customStack.push(2);
  console.assert(customStack.pop() === 2, 'pop returns most recently pushed value');
  customStack.push(2);
  customStack.push(3);
  customStack.push(4); // stack is full (maxSize 3), this push is ignored
  customStack.increment(5, 100); // affects bottom 3 elements: [101, 102, 103]
  customStack.increment(2, 100); // affects bottom 2 elements: [201, 202, 103]
  console.assert(customStack.pop() === 103, 'pop after increments returns 103');
  console.assert(customStack.pop() === 202, 'pop after increments returns 202');
  console.assert(customStack.pop() === 201, 'pop after increments returns 201');
  console.assert(customStack.pop() === -1, 'pop on empty stack returns -1');

  const freqStack = new FreqStack();
  for (const val of [5, 7, 5, 7, 4, 5]) {
    freqStack.push(val);
  }
  console.assert(freqStack.pop() === 5, 'most frequent (freq 3) is 5');
  console.assert(freqStack.pop() === 7, 'next most frequent (freq 2, most recent) is 7');
  console.assert(freqStack.pop() === 5, 'remaining freq-2 element is 5');
  console.assert(freqStack.pop() === 4, 'only freq-1 element left is 4');

  console.log('06-min-stack-multi-stack OK');
}
