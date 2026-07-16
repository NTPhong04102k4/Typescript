// Companion code for ./05-balanced-trees-intuition.md
import { TreeNode, height, buildSampleTree } from './01-tree-fundamentals';
import { inorderRecursive } from './02-dfs-traversal';

/** height(left) - height(right); |result| > 1 means the node is unbalanced. */
export function balanceFactor<T>(node: TreeNode<T>): number {
  return height(node.left) - height(node.right);
}

/**
 * Fixes a left-heavy imbalance: promotes y's left child x to the top,
 * demoting y to x's right child (x's old right subtree becomes y's new
 * left subtree). Returns the new subtree root.
 */
export function rotateRight<T>(y: TreeNode<T>): TreeNode<T> {
  const x = y.left;
  if (x === null) throw new Error('cannot rotate right: no left child to promote');
  y.left = x.right;
  x.right = y;
  return x;
}

/** Mirror image of rotateRight, for right-heavy imbalances. */
export function rotateLeft<T>(y: TreeNode<T>): TreeNode<T> {
  const x = y.right;
  if (x === null) throw new Error('cannot rotate left: no right child to promote');
  y.right = x.left;
  x.left = y;
  return x;
}

// --- LeetCode 108. Convert Sorted Array to Binary Search Tree (Easy) ---
// https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/
// Pick the middle element as the root so both halves are as equal in size
// as possible -- this is what guarantees the result is balanced.
export function sortedArrayToBST(values: readonly number[]): TreeNode<number> | null {
  function build(lo: number, hi: number): TreeNode<number> | null {
    if (lo > hi) return null;
    const mid = Math.floor((lo + hi) / 2);
    const node = new TreeNode(values[mid]);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }
  return build(0, values.length - 1);
}

// Exercise: LeetCode 110. Balanced Binary Tree (Easy) -- check that every
// node's balance factor is within [-1, 1], in a single O(n) pass (not by
// recomputing height from scratch at every node).
export function isBalancedStub<T>(_root: TreeNode<T> | null): boolean {
  throw new Error('not implemented');
}
// Solution:
function checkHeight<T>(node: TreeNode<T> | null): number {
  if (node === null) return 0;
  const leftHeight = checkHeight(node.left);
  if (leftHeight === -1) return -1;
  const rightHeight = checkHeight(node.right);
  if (rightHeight === -1) return -1;
  if (Math.abs(leftHeight - rightHeight) > 1) return -1;
  return 1 + Math.max(leftHeight, rightHeight);
}
export function isBalanced<T>(root: TreeNode<T> | null): boolean {
  return checkHeight(root) !== -1;
}

// Exercise: LeetCode 1382. Balance a Binary Search Tree (Medium) -- given
// any BST, however skewed, rebuild it into a balanced one. Compose
// inorderRecursive (sorted values for a BST) with sortedArrayToBST.
export function balanceBSTStub(_root: TreeNode<number> | null): TreeNode<number> | null {
  throw new Error('not implemented');
}
// Solution:
export function balanceBST(root: TreeNode<number> | null): TreeNode<number> | null {
  const sortedValues = inorderRecursive(root);
  return sortedArrayToBST(sortedValues);
}

// --- run ---
if (require.main === module) {
  // A left-heavy chain: 5 -> 3 -> 2
  const chainForRotation = new TreeNode(5, new TreeNode(3, new TreeNode(2)));
  console.assert(balanceFactor(chainForRotation) === 2, 'chain 5-3-2 should have balance factor 2 (unbalanced)');

  const rotated = rotateRight(chainForRotation);
  console.assert(rotated.value === 3, 'rotateRight should promote 3 to the top');
  console.assert(rotated.left?.value === 2 && rotated.right?.value === 5, 'rotated tree should be 3 with children 2 and 5');
  console.assert(balanceFactor(rotated) === 0, 'after rotation the new root should be perfectly balanced');

  console.assert(isBalanced(buildSampleTree()) === true, 'the sample tree is balanced');
  const unbalancedChain = new TreeNode(5, new TreeNode(3, new TreeNode(2)));
  console.assert(isBalanced(unbalancedChain) === false, 'a 3-node left-heavy chain is not balanced');

  const balancedFromArray = sortedArrayToBST([1, 2, 3, 4, 5, 6, 7]);
  console.assert(height(balancedFromArray) === 3, 'sortedArrayToBST on 7 elements should produce height 3');
  console.assert(
    JSON.stringify(inorderRecursive(balancedFromArray)) === JSON.stringify([1, 2, 3, 4, 5, 6, 7]),
    'sortedArrayToBST must preserve sorted order'
  );

  const skewed = new TreeNode(5, new TreeNode(3, new TreeNode(2)));
  const rebalanced = balanceBST(skewed);
  console.assert(isBalanced(rebalanced) === true, 'balanceBST should produce a balanced tree');
  console.assert(
    JSON.stringify(inorderRecursive(rebalanced)) === JSON.stringify([2, 3, 5]),
    'balanceBST must preserve the original set of values in sorted order'
  );

  console.log('05-balanced-trees-intuition: all assertions passed');
}
