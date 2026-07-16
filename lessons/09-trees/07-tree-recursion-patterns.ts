// Companion code for ./07-tree-recursion-patterns.md
import { TreeNode, buildSampleTree } from './01-tree-fundamentals';

// --- LeetCode 104. Maximum Depth of Binary Tree (Easy) ---
// https://leetcode.com/problems/maximum-depth-of-binary-tree/
export function maxDepth<T>(root: TreeNode<T> | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// --- LeetCode 543. Diameter of Binary Tree (Easy) ---
// https://leetcode.com/problems/diameter-of-binary-tree/
// Compute height recursively, but update a running "best path seen so
// far" at every node -- the diameter isn't necessarily the value at the
// root, it can live entirely inside one subtree.
export function diameterOfBinaryTree<T>(root: TreeNode<T> | null): number {
  let diameter = 0;

  function heightOf(node: TreeNode<T> | null): number {
    if (node === null) return 0;
    const leftHeight = heightOf(node.left);
    const rightHeight = heightOf(node.right);
    diameter = Math.max(diameter, leftHeight + rightHeight);
    return 1 + Math.max(leftHeight, rightHeight);
  }

  heightOf(root);
  return diameter;
}

// --- LeetCode 236. Lowest Common Ancestor of a Binary Tree (Medium) ---
// https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/
// If the current node is p or q, it's a candidate answer. Otherwise ask
// both children; if both report finding something, this node is the LCA.
// If only one does, forward that result unchanged.
export function lowestCommonAncestor(
  root: TreeNode<number> | null,
  p: number,
  q: number
): TreeNode<number> | null {
  if (root === null) return null;
  if (root.value === p || root.value === q) return root;

  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left !== null && right !== null) return root;
  return left !== null ? left : right;
}

// Exercise: LeetCode 100. Same Tree (Easy) -- two trees are the same if
// both are null, or both are non-null with equal values and recursively
// identical left/right subtrees.
export function isSameTreeStub<T>(_a: TreeNode<T> | null, _b: TreeNode<T> | null): boolean {
  throw new Error('not implemented');
}
// Solution:
export function isSameTree<T>(a: TreeNode<T> | null, b: TreeNode<T> | null): boolean {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  return a.value === b.value && isSameTree(a.left, b.left) && isSameTree(a.right, b.right);
}

// Exercise: LeetCode 1448. Count Good Nodes in Binary Tree (Medium) -- a
// node is "good" if no ancestor on the root-to-node path has a strictly
// greater value. Carry the max value seen so far down the recursion.
export function countGoodNodesStub<T>(_root: TreeNode<T> | null): number {
  throw new Error('not implemented');
}
// Solution:
export function countGoodNodes(root: TreeNode<number> | null): number {
  function dfs(node: TreeNode<number> | null, maxSoFar: number): number {
    if (node === null) return 0;
    const selfIsGood = node.value >= maxSoFar ? 1 : 0;
    const newMax = Math.max(maxSoFar, node.value);
    return selfIsGood + dfs(node.left, newMax) + dfs(node.right, newMax);
  }
  return dfs(root, -Infinity);
}

// --- run ---
if (require.main === module) {
  const tree = buildSampleTree();

  console.assert(maxDepth(tree) === 3, 'sample tree maxDepth should be 3');
  console.assert(diameterOfBinaryTree(tree) === 4, 'sample tree diameter should be 4 edges (2-3-5-8-7 or 2-3-5-8-9)');

  console.assert(lowestCommonAncestor(tree, 2, 4)?.value === 3, 'LCA(2,4) should be 3');
  console.assert(lowestCommonAncestor(tree, 2, 9)?.value === 5, 'LCA(2,9) should be the root 5');
  console.assert(lowestCommonAncestor(tree, 7, 9)?.value === 8, 'LCA(7,9) should be 8');
  console.assert(lowestCommonAncestor(tree, 4, 8)?.value === 5, 'LCA(4,8) should be the root 5 (different branches)');

  console.assert(isSameTree(buildSampleTree(), buildSampleTree()) === true, 'two freshly built sample trees are structurally identical');
  const differentLeaf = buildSampleTree();
  (differentLeaf.left as TreeNode<number>).left = new TreeNode(999);
  console.assert(isSameTree(buildSampleTree(), differentLeaf) === false, 'a changed leaf value should break equality');

  console.assert(countGoodNodes(tree) === 3, 'sample tree should have 3 good nodes: 5, 8, 9');

  console.log('07-tree-recursion-patterns: all assertions passed');
}
