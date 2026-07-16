// Companion code for ./09-leetcode-practice.md
import { TreeNode, buildSampleTree } from './01-tree-fundamentals';
import { levelOrder } from './03-bfs-level-order';

// --- LeetCode 226. Invert Binary Tree (Easy) ---
// https://leetcode.com/problems/invert-binary-tree/
// Postorder pattern: recurse into both children first, then swap them.
export function invertTree<T>(root: TreeNode<T> | null): TreeNode<T> | null {
  if (root === null) return null;
  const invertedLeft = invertTree(root.left);
  const invertedRight = invertTree(root.right);
  root.left = invertedRight;
  root.right = invertedLeft;
  return root;
}

// --- LeetCode 101. Symmetric Tree (Easy) ---
// https://leetcode.com/problems/symmetric-tree/
// Paired recursion: a tree is symmetric if its left and right subtrees are
// mirror images of each other (a.left mirrors b.right, and vice versa).
export function isSymmetric<T>(root: TreeNode<T> | null): boolean {
  function mirrors(a: TreeNode<T> | null, b: TreeNode<T> | null): boolean {
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;
    return a.value === b.value && mirrors(a.left, b.right) && mirrors(a.right, b.left);
  }
  return root === null || mirrors(root.left, root.right);
}

// --- LeetCode 112. Path Sum (Easy) ---
// https://leetcode.com/problems/path-sum/
// Preorder pattern with a running total: subtract the current value from
// the target on the way down; a leaf matches if what's left equals it.
export function hasPathSum(root: TreeNode<number> | null, targetSum: number): boolean {
  if (root === null) return false;
  if (root.left === null && root.right === null) return root.value === targetSum;
  const remaining = targetSum - root.value;
  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}

// --- LeetCode 199. Binary Tree Right Side View (Medium) ---
// https://leetcode.com/problems/binary-tree-right-side-view/
// Reuse lesson 03's levelOrder and keep only the last value of each level.
export function rightSideView<T>(root: TreeNode<T> | null): T[] {
  return levelOrder(root).map((level) => level[level.length - 1]);
}

// --- LeetCode 230. Kth Smallest Element in a BST (Medium) ---
// https://leetcode.com/problems/kth-smallest-element-in-a-bst/
// In-order traversal of a BST yields sorted values; stop as soon as the
// k-th one is popped instead of collecting the whole traversal first.
export function kthSmallestBST(root: TreeNode<number> | null, k: number): number {
  const stack: TreeNode<number>[] = [];
  let current = root;
  let remaining = k;
  while (current !== null || stack.length > 0) {
    while (current !== null) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop() as TreeNode<number>;
    remaining -= 1;
    if (remaining === 0) return current.value;
    current = current.right;
  }
  throw new Error('k is out of range for this tree');
}

// --- LeetCode 114. Flatten Binary Tree to Linked List (Medium) ---
// https://leetcode.com/problems/flatten-binary-tree-to-linked-list/
// For each node with a left child: find the rightmost node of that left
// subtree, attach the original right subtree there, then move the left
// subtree over to become the right subtree and clear left. Repeat while
// walking down the right chain -- O(1) extra space.
export function flatten<T>(root: TreeNode<T> | null): void {
  let current = root;
  while (current !== null) {
    if (current.left !== null) {
      let rightmost = current.left;
      while (rightmost.right !== null) rightmost = rightmost.right;
      rightmost.right = current.right;
      current.right = current.left;
      current.left = null;
    }
    current = current.right;
  }
}

// --- LeetCode 129. Sum Root to Leaf Numbers (Medium) ---
// https://leetcode.com/problems/sum-root-to-leaf-numbers/
// Preorder pattern with a running total: each step multiplies the
// accumulated path value by 10 and adds the current digit; a leaf
// contributes its accumulated value to the overall sum.
export function sumNumbers(root: TreeNode<number> | null): number {
  function dfs(node: TreeNode<number> | null, pathValue: number): number {
    if (node === null) return 0;
    const newValue = pathValue * 10 + node.value;
    if (node.left === null && node.right === null) return newValue;
    return dfs(node.left, newValue) + dfs(node.right, newValue);
  }
  return dfs(root, 0);
}

// --- LeetCode 124. Binary Tree Maximum Path Sum (Hard) ---
// https://leetcode.com/problems/binary-tree-maximum-path-sum/
// Generalizes lesson 07's diameter: track the best node-to-node path sum
// seen anywhere, while returning to the parent only the best *single*
// downward branch (clamped at 0, so a negative branch is excluded rather
// than subtracted).
export function maxPathSum(root: TreeNode<number> | null): number {
  let best = -Infinity;

  function gain(node: TreeNode<number> | null): number {
    if (node === null) return 0;
    const leftGain = Math.max(0, gain(node.left));
    const rightGain = Math.max(0, gain(node.right));
    best = Math.max(best, node.value + leftGain + rightGain);
    return node.value + Math.max(leftGain, rightGain);
  }

  gain(root);
  return best;
}

// --- run ---
if (require.main === module) {
  const inverted = invertTree(buildSampleTree());
  console.assert(
    JSON.stringify(levelOrder(inverted)) === JSON.stringify([[5], [8, 3], [9, 7, 4, 2]]),
    'invertTree should mirror every node\'s children'
  );

  console.assert(isSymmetric(buildSampleTree()) === false, 'the sample tree is not symmetric (3 != 8)');
  const symmetricTree = new TreeNode(
    1,
    new TreeNode(2, new TreeNode(3), null),
    new TreeNode(2, null, new TreeNode(3))
  );
  console.assert(isSymmetric(symmetricTree) === true, 'this hand-built tree mirrors around its root');

  console.assert(hasPathSum(buildSampleTree(), 12) === true, '5+3+4=12 is a valid root-to-leaf path');
  console.assert(hasPathSum(buildSampleTree(), 100) === false, 'no root-to-leaf path sums to 100');

  console.assert(
    JSON.stringify(rightSideView(buildSampleTree())) === JSON.stringify([5, 8, 9]),
    'right side view should keep the last node of each level'
  );

  console.assert(kthSmallestBST(buildSampleTree(), 1) === 2, '1st smallest value is 2');
  console.assert(kthSmallestBST(buildSampleTree(), 3) === 4, '3rd smallest value is 4');

  const toFlatten = buildSampleTree();
  flatten(toFlatten);
  const flattenedValues: number[] = [];
  let node: TreeNode<number> | null = toFlatten;
  while (node !== null) {
    console.assert(node.left === null, 'every node should have a null left child after flattening');
    flattenedValues.push(node.value);
    node = node.right;
  }
  console.assert(
    JSON.stringify(flattenedValues) === JSON.stringify([5, 3, 2, 4, 8, 7, 9]),
    'flatten should produce a right-only chain in preorder order'
  );

  console.assert(sumNumbers(buildSampleTree()) === 2242, '532+534+587+589 sums to 2242');

  console.assert(maxPathSum(buildSampleTree()) === 29, 'best path 4-3-5-8-9 sums to 29');

  console.log('09-leetcode-practice: all assertions passed');
}
