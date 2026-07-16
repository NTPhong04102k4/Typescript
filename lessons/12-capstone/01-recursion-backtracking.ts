// Companion code for ./01-recursion-backtracking.md

/** Plain recursion: base case n <= 1, recursive case n * factorial(n - 1). */
export function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

/**
 * Naive recursive Fibonacci -- recomputes the same subproblems exponentially
 * often (fib(2) is computed twice for fib(4), four times for fib(6), etc.).
 * Intentionally left un-memoized here; lesson 02 fixes this with a Map.
 */
export function fibonacciRecursive(n: number): number {
  if (n <= 1) return n;
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// LeetCode 46: Permutations -- backtrack over a shared `used` array so every
// element appears exactly once per permutation.
export function permutations<T>(nums: T[]): T[][] {
  const result: T[][] = [];
  const current: T[] = [];
  const used: boolean[] = new Array(nums.length).fill(false);

  function backtrack(): void {
    if (current.length === nums.length) {
      result.push([...current]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(nums[i]);
      backtrack();
      current.pop();
      used[i] = false;
    }
  }

  backtrack();
  return result;
}

// LeetCode 78: Subsets -- backtrack over a start index so each subset is
// generated exactly once (no revisiting earlier elements).
export function subsets<T>(nums: T[]): T[][] {
  const result: T[][] = [];
  const current: T[] = [];

  function backtrack(start: number): void {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1);
      current.pop();
    }
  }

  backtrack(0);
  return result;
}

const PHONE_LETTERS: Record<string, string> = {
  '2': 'abc',
  '3': 'def',
  '4': 'ghi',
  '5': 'jkl',
  '6': 'mno',
  '7': 'pqrs',
  '8': 'tuv',
  '9': 'wxyz',
};

// Exercise: implement letterCombinations(digits) -- for each digit in
// order, try every letter it maps to on a phone keypad and backtrack.
// Solution:
export function letterCombinations(digits: string): string[] {
  if (digits.length === 0) return [];
  const result: string[] = [];

  function backtrack(index: number, current: string): void {
    if (index === digits.length) {
      result.push(current);
      return;
    }
    const letters = PHONE_LETTERS[digits[index]] ?? '';
    for (const letter of letters) {
      backtrack(index + 1, current + letter);
    }
  }

  backtrack(0, '');
  return result;
}

// Exercise: implement combinationSum(candidates, target) -- unlike
// permutations/subsets, the same candidate can be reused, so the recursive
// call passes the same start index `i` (not `i + 1`).
// Solution:
export function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  const current: number[] = [];

  function backtrack(start: number, remaining: number): void {
    if (remaining === 0) {
      result.push([...current]);
      return;
    }
    if (remaining < 0) return;
    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);
      backtrack(i, remaining - candidates[i]);
      current.pop();
    }
  }

  backtrack(0, target);
  return result;
}

// --- run ---
if (require.main === module) {
  console.assert(factorial(0) === 1, 'factorial(0) should be 1');
  console.assert(factorial(5) === 120, 'factorial(5) should be 120');

  console.assert(fibonacciRecursive(0) === 0, 'fibonacciRecursive(0) should be 0');
  console.assert(fibonacciRecursive(10) === 55, 'fibonacciRecursive(10) should be 55');

  const perms = permutations([1, 2, 3]);
  console.assert(perms.length === 6, 'permutations([1,2,3]) should have 3! = 6 results');
  console.assert(
    perms.some((p) => JSON.stringify(p) === JSON.stringify([1, 2, 3])),
    'permutations should include the identity ordering [1,2,3]'
  );

  const subs = subsets([1, 2]);
  console.assert(subs.length === 4, 'subsets([1,2]) should have 2^2 = 4 results');
  console.assert(
    subs.some((s) => s.length === 0) && subs.some((s) => JSON.stringify(s) === JSON.stringify([1, 2])),
    'subsets should include [] and [1,2]'
  );

  const combos = letterCombinations('23');
  console.assert(combos.length === 9, 'letterCombinations("23") should produce 3 * 3 = 9 combinations');
  console.assert(combos.includes('ad') && combos.includes('cf'), 'letterCombinations should include "ad" and "cf"');

  const sums = combinationSum([2, 3, 6, 7], 7);
  console.assert(sums.length === 2, 'combinationSum([2,3,6,7], 7) should have 2 combinations');
  console.assert(
    sums.some((c) => JSON.stringify(c) === JSON.stringify([2, 2, 3])) &&
      sums.some((c) => JSON.stringify(c) === JSON.stringify([7])),
    'combinationSum should include [2,2,3] and [7]'
  );

  console.log('01-recursion-backtracking: all assertions passed');
}
