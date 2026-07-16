// Companion code for ./03-monotonic-stack.md

import { Stack } from './01-stack-fundamentals';

// LeetCode 496: Next Greater Element I (Easy)
// Monotonic *decreasing* stack of values from nums2: whenever the current
// number is bigger than the stack's top, the top just found its "next
// greater element" — pop it and record the mapping.
export function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  const nextGreater = new Map<number, number>();
  const stack = new Stack<number>();
  for (const num of nums2) {
    while (!stack.isEmpty() && (stack.peek() as number) < num) {
      nextGreater.set(stack.pop() as number, num);
    }
    stack.push(num);
  }
  return nums1.map((n) => nextGreater.get(n) ?? -1);
}

// LeetCode 739: Daily Temperatures (Medium)
// Same shape as 496, but over indices instead of values, so the answer
// can be "how many days until" rather than "what value".
export function dailyTemperatures(temperatures: number[]): number[] {
  const result = new Array<number>(temperatures.length).fill(0);
  const stack = new Stack<number>(); // indices, temperatures strictly decreasing
  for (let i = 0; i < temperatures.length; i++) {
    while (!stack.isEmpty() && temperatures[stack.peek() as number] < temperatures[i]) {
      const idx = stack.pop() as number;
      result[idx] = i - idx;
    }
    stack.push(i);
  }
  return result;
}

// LeetCode 42: Trapping Rain Water (Hard)
// Monotonic decreasing stack of indices. When a taller bar arrives, every
// shorter bar popped off can trap water bounded by the *new* shorter top
// (the left wall) and the current bar (the right wall).
export function trap(height: number[]): number {
  const stack = new Stack<number>(); // indices, heights strictly decreasing
  let water = 0;
  for (let i = 0; i < height.length; i++) {
    while (!stack.isEmpty() && height[stack.peek() as number] < height[i]) {
      const top = stack.pop() as number;
      if (stack.isEmpty()) {
        break; // no left wall, nothing to trap yet
      }
      const left = stack.peek() as number;
      const distance = i - left - 1;
      const boundedHeight = Math.min(height[left], height[i]) - height[top];
      water += distance * boundedHeight;
    }
    stack.push(i);
  }
  return water;
}

// --- run ---
if (require.main === module) {
  console.assert(
    JSON.stringify(nextGreaterElement([4, 1, 2], [1, 3, 4, 2])) === JSON.stringify([-1, 3, -1]),
    'nextGreaterElement example 1',
  );

  console.assert(
    JSON.stringify(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])) ===
      JSON.stringify([1, 1, 4, 2, 1, 1, 0, 0]),
    'dailyTemperatures example',
  );

  console.assert(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) === 6, 'trap example');

  console.log('03-monotonic-stack OK');
}
