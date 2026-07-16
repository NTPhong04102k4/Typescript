// Companion code for ./07-leetcode-practice.md

import { Stack } from './01-stack-fundamentals';

// LeetCode 1047: Remove All Adjacent Duplicates In String (Easy)
// Push characters; whenever the current one matches the top, they cancel
// out (pop instead of push). What's left on the stack, bottom to top, is
// the answer.
export function removeDuplicates(s: string): string {
  const stack = new Stack<string>();
  for (const ch of s) {
    if (!stack.isEmpty() && stack.peek() === ch) {
      stack.pop();
    } else {
      stack.push(ch);
    }
  }
  return stack.toArray().join('');
}

// LeetCode 682: Baseball Game (Easy)
// A plain array as the stack: '+' needs the top *two* scores, which is
// direct index access rather than something IStack<T>'s peek() alone
// exposes.
export function calPoints(operations: string[]): number {
  const stack: number[] = [];
  for (const op of operations) {
    if (op === 'C') {
      stack.pop();
    } else if (op === 'D') {
      stack.push(stack[stack.length - 1] * 2);
    } else if (op === '+') {
      stack.push(stack[stack.length - 1] + stack[stack.length - 2]);
    } else {
      stack.push(Number(op));
    }
  }
  return stack.reduce((sum, val) => sum + val, 0);
}

// LeetCode 71: Simplify Path (Medium)
// Split on '/', push real directory names, pop on '..', ignore '.' and
// empty segments. Joining what remains (bottom to top) with '/' gives the
// canonical absolute path.
export function simplifyPath(path: string): string {
  const stack = new Stack<string>();
  const parts = path.split('/');
  for (const part of parts) {
    if (part === '' || part === '.') {
      continue;
    }
    if (part === '..') {
      if (!stack.isEmpty()) {
        stack.pop();
      }
    } else {
      stack.push(part);
    }
  }
  return '/' + stack.toArray().join('/');
}

// LeetCode 735: Asteroid Collision (Medium)
// A right-moving asteroid (positive) never collides on its own; a
// left-moving one (negative) may repeatedly destroy smaller right-moving
// asteroids on top of the stack until it's absorbed, survives, or
// destroys everything above it.
export function asteroidCollision(asteroids: number[]): number[] {
  const stack = new Stack<number>();
  for (const asteroid of asteroids) {
    let alive = true;
    while (alive && asteroid < 0 && !stack.isEmpty() && (stack.peek() as number) > 0) {
      const top = stack.peek() as number;
      if (top < -asteroid) {
        stack.pop(); // top explodes, current asteroid keeps moving
      } else if (top === -asteroid) {
        stack.pop(); // both explode
        alive = false;
      } else {
        alive = false; // current asteroid explodes
      }
    }
    if (alive) {
      stack.push(asteroid);
    }
  }
  return stack.toArray();
}

// LeetCode 84: Largest Rectangle in Histogram (Hard)
// Monotonic increasing stack of indices. When a shorter bar arrives, pop
// every taller bar and compute the rectangle it could have formed,
// spanning from just after the new stack top to the current index.
export function largestRectangleArea(heights: number[]): number {
  const stack = new Stack<number>();
  let maxArea = 0;
  const n = heights.length;
  for (let i = 0; i <= n; i++) {
    const h = i === n ? 0 : heights[i]; // sentinel 0 flushes the stack at the end
    while (!stack.isEmpty() && heights[stack.peek() as number] > h) {
      const height = heights[stack.pop() as number];
      const width = stack.isEmpty() ? i : i - (stack.peek() as number) - 1;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }
  return maxArea;
}

// LeetCode 85: Maximal Rectangle (Hard)
// Reduces to 84 one row at a time: heights[c] counts consecutive '1's
// ending at the current row for column c (reset to 0 on a '0'), then the
// largest all-1s rectangle ending at this row is largestRectangleArea of
// that histogram.
export function maximalRectangle(matrix: string[][]): number {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return 0;
  }
  const cols = matrix[0].length;
  const heights = new Array<number>(cols).fill(0);
  let maxArea = 0;
  for (const row of matrix) {
    for (let c = 0; c < cols; c++) {
      heights[c] = row[c] === '1' ? heights[c] + 1 : 0;
    }
    maxArea = Math.max(maxArea, largestRectangleArea(heights));
  }
  return maxArea;
}

// --- run ---
if (require.main === module) {
  console.assert(removeDuplicates('abbaca') === 'ca', 'removeDuplicates example');

  console.assert(calPoints(['5', '2', 'C', 'D', '+']) === 30, 'calPoints example 1');

  console.assert(simplifyPath('/a/./b/../../c/') === '/c', 'simplifyPath example');

  console.assert(
    JSON.stringify(asteroidCollision([5, 10, -5])) === JSON.stringify([5, 10]),
    'asteroidCollision example 1',
  );

  console.assert(largestRectangleArea([2, 1, 5, 6, 2, 3]) === 10, 'largestRectangleArea example');

  console.assert(
    maximalRectangle([
      ['1', '0', '1', '0', '0'],
      ['1', '0', '1', '1', '1'],
      ['1', '1', '1', '1', '1'],
      ['1', '0', '0', '1', '0'],
    ]) === 6,
    'maximalRectangle example',
  );

  console.log('07-leetcode-practice OK');
}
