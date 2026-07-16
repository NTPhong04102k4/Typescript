// Companion code for ./05-call-stack-engine.md

import { Stack } from './01-stack-fundamentals';

// Plain recursive factorial: every call to factorialRecursive(k) is a real
// call stack frame that stays alive until factorialRecursive(k - 1) returns.
// Deep enough recursion (very large n) would eventually throw a
// RangeError: Maximum call stack size exceeded.
export function factorialRecursive(n: number): number {
  if (n <= 1) {
    return 1;
  }
  return n * factorialRecursive(n - 1);
}

// The same computation using an explicit Stack<number> to model the two
// phases of recursion by hand:
//  1. "descending" phase: each pending multiplication (5, 4, 3, 2) is
//     pushed, exactly like the engine pushing a new call stack frame for
//     factorialRecursive(n - 1) before it can return.
//  2. "unwinding" phase: frames are popped and folded into the result in
//     the reverse order they were pushed, exactly like each call
//     returning back into its caller.
export function factorialWithExplicitStack(n: number): number {
  const frames = new Stack<number>();
  let current = n;
  while (current > 1) {
    frames.push(current);
    current--;
  }
  let result = 1;
  while (!frames.isEmpty()) {
    result *= frames.pop() as number;
  }
  return result;
}

// LeetCode 394: Decode String (Medium)
// Nested "k[...]" groups behave like nested function calls: entering a
// '[' suspends the current partial string and multiplier (push), and a
// matching ']' resumes the enclosing context by folding the completed
// inner string back in (pop) — the same push-on-enter, pop-on-return
// shape as the real call stack.
export function decodeString(s: string): string {
  const countStack = new Stack<number>();
  const stringStack = new Stack<string>();
  let currentString = '';
  let currentNum = 0;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      currentNum = currentNum * 10 + Number(ch);
    } else if (ch === '[') {
      countStack.push(currentNum);
      stringStack.push(currentString);
      currentNum = 0;
      currentString = '';
    } else if (ch === ']') {
      const repeat = countStack.pop() as number;
      const prev = stringStack.pop() as string;
      currentString = prev + currentString.repeat(repeat);
    } else {
      currentString += ch;
    }
  }
  return currentString;
}

// LeetCode 946: Validate Stack Sequences (Medium)
// Simulates an actual stack: replay `pushed` in order, and greedily pop
// whenever the top matches the next expected value in `popped`. If the
// simulated stack empties out exactly when `pushed` is exhausted, the
// sequences are consistent with some valid push/pop interleaving.
export function validateStackSequences(pushed: number[], popped: number[]): boolean {
  const stack = new Stack<number>();
  let j = 0;
  for (const value of pushed) {
    stack.push(value);
    while (!stack.isEmpty() && stack.peek() === popped[j]) {
      stack.pop();
      j++;
    }
  }
  return stack.isEmpty();
}

// --- run ---
if (require.main === module) {
  console.assert(factorialRecursive(5) === 120, 'factorialRecursive(5) === 120');
  console.assert(
    factorialWithExplicitStack(5) === 120,
    'factorialWithExplicitStack(5) === 120 (matches the recursive call stack unwind order)',
  );

  console.assert(decodeString('3[a]2[bc]') === 'aaabcbc', 'decodeString example 1');
  console.assert(decodeString('3[a2[c]]') === 'accaccacc', 'decodeString example 2 (nested)');

  console.assert(
    validateStackSequences([1, 2, 3, 4, 5], [4, 5, 3, 2, 1]) === true,
    'validateStackSequences example 1',
  );
  console.assert(
    validateStackSequences([1, 2, 3, 4, 5], [4, 3, 5, 1, 2]) === false,
    'validateStackSequences example 2',
  );

  console.log('05-call-stack-engine OK');
}
