// Companion code for ./03-generics.md

// A minimal generic Stack<T> — the LIFO building block reused by topic 04
// (Stack) and re-exported from the barrel in lesson 06.
export class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /** Bottom-to-top snapshot, used by generic helpers like mapStack/filterStack. */
  toArray(): T[] {
    return [...this.items];
  }
}

// A minimal generic Queue<T> — the FIFO building block reused by topic 05
// (Queue) and re-exported from the barrel in lesson 06.
export class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// Two independent type parameters: a generic first/second pair.
export class Pair<A, B> {
  constructor(
    public readonly first: A,
    public readonly second: B
  ) {}

  swap(): Pair<B, A> {
    return new Pair(this.second, this.first);
  }
}

// Bounded generics: T must have a numeric `.length`, so longest() accepts
// any same-shaped input (strings, arrays, custom structs) and stays typed.
export interface HasLength {
  length: number;
}

export function longest<T extends HasLength>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

// A generic algorithm over a generic structure: map every Stack<T> item
// through fn, preserving bottom-to-top order in the result.
export function mapStack<T, U>(stack: Stack<T>, fn: (item: T) => U): Stack<U> {
  const mapped = new Stack<U>();
  for (const item of stack.toArray()) {
    mapped.push(fn(item));
  }
  return mapped;
}

// F-bounded polymorphism: T must be comparable to another T, enabling a
// generic max-finder over any custom type that implements Comparable<T>.
export interface Comparable<T> {
  compareTo(other: T): number;
}

export function maxOf<T extends Comparable<T>>(items: readonly T[]): T {
  if (items.length === 0) throw new Error('maxOf requires a non-empty array');
  let best = items[0];
  for (const item of items) {
    if (item.compareTo(best) > 0) best = item;
  }
  return best;
}

// Example Comparable<T> implementation.
export class Money implements Comparable<Money> {
  constructor(public readonly cents: number) {}

  compareTo(other: Money): number {
    return this.cents - other.cents;
  }
}

// Exercise: implement filterStack, returning a new Stack<T> containing only
// items matching `predicate`, preserving bottom-to-top order.
export function stubFilterStack<T>(_stack: Stack<T>, _predicate: (item: T) => boolean): Stack<T> {
  throw new Error('not implemented');
}
// Solution:
export function filterStack<T>(stack: Stack<T>, predicate: (item: T) => boolean): Stack<T> {
  const filtered = new Stack<T>();
  for (const item of stack.toArray()) {
    if (predicate(item)) filtered.push(item);
  }
  return filtered;
}

// Exercise: return the first element of a readonly array, or `fallback`
// when the array is empty.
export function stubFirstOrDefault<T>(_arr: readonly T[], _fallback: T): T {
  throw new Error('not implemented');
}
// Solution:
export function firstOrDefault<T>(arr: readonly T[], fallback: T): T {
  return arr.length > 0 ? arr[0] : fallback;
}

// --- run ---
if (require.main === module) {
  const s = new Stack<number>();
  s.push(1);
  s.push(2);
  s.push(3);
  console.assert(s.size === 3, 'stack should hold 3 items');
  console.assert(s.peek() === 3, 'peek should see the last pushed item');
  console.assert(s.pop() === 3 && s.pop() === 2 && s.pop() === 1, 'pop should be LIFO');
  console.assert(s.isEmpty(), 'stack should be empty after popping everything');

  const q = new Queue<string>();
  q.enqueue('a');
  q.enqueue('b');
  console.assert(q.dequeue() === 'a' && q.dequeue() === 'b', 'queue should be FIFO');

  const swappedPair = new Pair<string, number>('x', 1).swap();
  console.assert(swappedPair.first === 1 && swappedPair.second === 'x', 'swap should flip Pair<A, B> to Pair<B, A>');

  console.assert(longest('hi', 'hello') === 'hello', 'longest should compare strings by .length');
  const arrA = [1, 2];
  const arrB = [1, 2, 3];
  console.assert(longest(arrA, arrB) === arrB, 'longest should compare arrays by .length too');

  const stackOfNums = new Stack<number>();
  stackOfNums.push(1);
  stackOfNums.push(2);
  stackOfNums.push(3);
  const doubled = mapStack(stackOfNums, (n) => n * 2);
  console.assert(JSON.stringify(doubled.toArray()) === JSON.stringify([2, 4, 6]), 'mapStack should double every item in order');

  const wallet = [new Money(500), new Money(1250), new Money(75)];
  console.assert(maxOf(wallet).cents === 1250, 'maxOf should find the largest Money by cents');

  const mixedStack = new Stack<number>();
  [1, 2, 3, 4, 5, 6].forEach((n) => mixedStack.push(n));
  const evensOnly = filterStack(mixedStack, (n) => n % 2 === 0);
  console.assert(JSON.stringify(evensOnly.toArray()) === JSON.stringify([2, 4, 6]), 'filterStack should keep only evens, in order');

  console.assert(firstOrDefault([10, 20], 0) === 10, 'firstOrDefault should return the first element when present');
  console.assert(firstOrDefault([], 0) === 0, 'firstOrDefault should return the fallback when the array is empty');

  console.log('03-generics: all assertions passed');
}
