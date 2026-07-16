// Companion code for ./03-bfs-level-order.md
import { TreeNode, buildSampleTree } from './01-tree-fundamentals';

// --- LeetCode 102. Binary Tree Level Order Traversal (Medium) ---
// https://leetcode.com/problems/binary-tree-level-order-traversal/
// Use an array as a queue with a head cursor (avoids O(n) Array.shift()).
// Snapshot the queue length before draining a round so exactly one level's
// worth of nodes is processed per iteration.
export function levelOrder<T>(root: TreeNode<T> | null): T[][] {
  const levels: T[][] = [];
  if (root === null) return levels;

  const queue: TreeNode<T>[] = [root];
  let head = 0;
  while (head < queue.length) {
    const levelSize = queue.length - head;
    const level: T[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue[head++];
      level.push(node.value);
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
    levels.push(level);
  }
  return levels;
}

// Exercise: LeetCode 107. Binary Tree Level Order Traversal II (Medium) --
// same levels, but ordered from the deepest level up to the root.
export function levelOrderBottomStub<T>(_root: TreeNode<T> | null): T[][] {
  throw new Error('not implemented');
}
// Solution:
export function levelOrderBottom<T>(root: TreeNode<T> | null): T[][] {
  return levelOrder(root).reverse();
}

// Exercise: LeetCode 103. Binary Tree Zigzag Level Order Traversal (Medium)
// -- same levels as levelOrder, but alternate left-to-right and
// right-to-left starting with left-to-right at the root.
export function zigzagLevelOrderStub<T>(_root: TreeNode<T> | null): T[][] {
  throw new Error('not implemented');
}
// Solution:
export function zigzagLevelOrder<T>(root: TreeNode<T> | null): T[][] {
  return levelOrder(root).map((level, depth) => (depth % 2 === 1 ? [...level].reverse() : level));
}

// --- run ---
if (require.main === module) {
  const tree = buildSampleTree();

  console.assert(
    JSON.stringify(levelOrder(tree)) === JSON.stringify([[5], [3, 8], [2, 4, 7, 9]]),
    'levelOrder should group the sample tree into [[5],[3,8],[2,4,7,9]]'
  );
  console.assert(JSON.stringify(levelOrder<number>(null)) === '[]', 'empty tree has no levels');

  console.assert(
    JSON.stringify(levelOrderBottom(tree)) === JSON.stringify([[2, 4, 7, 9], [3, 8], [5]]),
    'levelOrderBottom should reverse the level order'
  );

  console.assert(
    JSON.stringify(zigzagLevelOrder(tree)) === JSON.stringify([[5], [8, 3], [2, 4, 7, 9]]),
    'zigzagLevelOrder should reverse every odd-indexed level'
  );

  console.log('03-bfs-level-order: all assertions passed');
}
