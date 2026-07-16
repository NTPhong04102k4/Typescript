// Companion code for ./01-stack-fundamentals.md

/**
 * Minimal contract every stack implementation in this topic follows.
 * Later lessons (02+) implement this interface with different backing
 * storage, and reuse `Stack<T>` defined below wherever a plain stack
 * is all that's needed.
 */
export interface IStack<T> {
  push(value: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  isEmpty(): boolean;
  size(): number;
}

/**
 * Array-backed stack: the simplest correct implementation. JS arrays
 * already expose push/pop at the "back" of the array in amortized O(1),
 * so treating the *end* of the array as the "top" of the stack gives
 * LIFO behavior for free.
 */
export class Stack<T> implements IStack<T> {
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

  /** Snapshot from bottom to top. Handy for tests and for lessons that
   * need to materialize final stack contents (e.g. path simplification). */
  toArray(): T[] {
    return [...this.items];
  }
}

// LeetCode 20: Valid Parentheses (Easy)
// Push opening brackets; on a closing bracket, it must match the top.
export function isValid(s: string): boolean {
  const stack = new Stack<string>();
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else {
      if (stack.isEmpty() || stack.pop() !== pairs[ch]) {
        return false;
      }
    }
  }
  return stack.isEmpty();
}

// Exercise: implement reverseStringWithStack(s: string): string using only
// the Stack<T> API above (no built-in string reversal).
// Solution:
export function reverseStringWithStack(s: string): string {
  const stack = new Stack<string>();
  for (const ch of s) {
    stack.push(ch);
  }
  let reversed = '';
  while (!stack.isEmpty()) {
    reversed += stack.pop();
  }
  return reversed;
}

// --- run ---
if (require.main === module) {
  const stack = new Stack<number>();
  stack.push(1);
  stack.push(2);
  stack.push(3);
  console.log('peek:', stack.peek());
  console.assert(stack.peek() === 3, 'peek should return the last pushed value');
  console.assert(stack.pop() === 3, 'pop should remove and return the top value');
  console.assert(stack.size() === 2, 'size should reflect remaining elements');

  console.assert(isValid('()[]{}') === true, '"()[]{}" is valid');
  console.assert(isValid('(]') === false, '"(]" is invalid');
  console.assert(isValid('([)]') === false, '"([)]" is invalid (wrong nesting order)');
  console.assert(isValid('{[]}') === true, '"{[]}" is valid');

  console.assert(reverseStringWithStack('hello') === 'olleh', 'reverse of "hello" is "olleh"');
  console.log('01-stack-fundamentals OK');
}
