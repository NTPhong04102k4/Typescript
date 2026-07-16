// Companion code for ./06-type-safe-dsa-library.md

// A barrel module: re-export a curated, type-safe subset of this topic's
// generic building blocks from one entry point, the way a real DSA library
// exposes `import { Stack, Queue } from 'my-dsa-lib'` instead of forcing
// callers to reach into individual internal files.
export { Stack, Queue, Pair, longest, type HasLength, mapStack, type Comparable, maxOf } from './03-generics';
export { type TreeNode, leaf, node, sumTree, heightOf, countLeaves, mirror } from './04-discriminated-unions';

// Local imports for the barrel's own convenience API, built purely from the
// pieces re-exported above.
import { Stack, Queue } from './03-generics';
import { leaf, node, sumTree, type TreeNode } from './04-discriminated-unions';

/** Converts an array into a Stack<T>, pushing left-to-right (last item ends up on top). */
export function stackOf<T>(items: readonly T[]): Stack<T> {
  const s = new Stack<T>();
  for (const item of items) s.push(item);
  return s;
}

/** Converts an array into a Queue<T>, enqueuing left-to-right (first item is served first). */
export function queueOf<T>(items: readonly T[]): Queue<T> {
  const q = new Queue<T>();
  for (const item of items) q.enqueue(item);
  return q;
}

/** BFS-style level-order sum over a TreeNode, built from the barrel's own Queue<T> (compare LeetCode 102). */
export function levelOrderSum(root: TreeNode): number {
  const queue = queueOf<TreeNode>([root]);
  let total = 0;
  while (!queue.isEmpty()) {
    const current = queue.dequeue();
    if (current === undefined) break;
    total += current.value;
    if (current.kind === 'node') {
      queue.enqueue(current.left);
      queue.enqueue(current.right);
    }
  }
  return total;
}

function countNodes(t: TreeNode): number {
  return t.kind === 'leaf' ? 1 : 1 + countNodes(t.left) + countNodes(t.right);
}

// Exercise: drain a Stack<T> (LIFO) into a plain array recording pop order
// (top to bottom).
export function stubStackToQueueOrder<T>(_stack: Stack<T>): T[] {
  throw new Error('not implemented');
}
// Solution:
export function stackToQueueOrder<T>(stack: Stack<T>): T[] {
  const order: T[] = [];
  while (!stack.isEmpty()) {
    const item = stack.pop();
    if (item !== undefined) order.push(item);
  }
  return order;
}

// Exercise: use the barrel's TreeNode + sumTree to compute a tree's average
// node value (sumTree divided by node count).
export function stubAverageValue(_t: TreeNode): number {
  throw new Error('not implemented');
}
// Solution:
export function averageValue(t: TreeNode): number {
  return sumTree(t) / countNodes(t);
}

// --- run ---
if (require.main === module) {
  const s = stackOf([1, 2, 3]);
  console.assert(s.pop() === 3 && s.pop() === 2 && s.pop() === 1, 'stackOf should push in order, LIFO on pop');

  const q = queueOf(['a', 'b', 'c']);
  console.assert(q.dequeue() === 'a' && q.dequeue() === 'b' && q.dequeue() === 'c', 'queueOf should serve FIFO');

  // Tree:      1
  //           / \
  //          2   3
  //         / \
  //        4   5
  const tree: TreeNode = node(1, node(2, leaf(4), leaf(5)), leaf(3));
  console.assert(levelOrderSum(tree) === 15, 'levelOrderSum should visit every node exactly once: 1+2+3+4+5=15');

  const order = stackToQueueOrder(stackOf([1, 2, 3]));
  console.assert(JSON.stringify(order) === JSON.stringify([3, 2, 1]), 'stackToQueueOrder should reverse push order');

  console.assert(averageValue(tree) === 3, 'average of values 1,2,3,4,5 is 3');

  console.log('06-type-safe-dsa-library: all assertions passed');
}
