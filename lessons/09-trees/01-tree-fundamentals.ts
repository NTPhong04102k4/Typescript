// Companion code for ./01-tree-fundamentals.md

/** Binary tree node: a value plus pointers to (at most) two children. */
export class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;

  constructor(value: T, left: TreeNode<T> | null = null, right: TreeNode<T> | null = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

/**
 * Builds the sample tree used throughout the trees topic, fresh on every
 * call (so lessons that mutate it don't affect each other):
 *
 *              5
 *            /   \
 *           3     8
 *          / \   / \
 *         2   4 7   9
 *
 * This shape also satisfies the binary-search-tree invariant, which lesson
 * 04 relies on directly.
 */
export function buildSampleTree(): TreeNode<number> {
  const two = new TreeNode(2);
  const four = new TreeNode(4);
  const three = new TreeNode(3, two, four);
  const seven = new TreeNode(7);
  const nine = new TreeNode(9);
  const eight = new TreeNode(8, seven, nine);
  return new TreeNode(5, three, eight);
}

/** Total number of nodes in the tree rooted at `node`. */
export function size<T>(node: TreeNode<T> | null): number {
  if (node === null) return 0;
  return 1 + size(node.left) + size(node.right);
}

/** True if `node` exists and has no children. */
export function isLeaf<T>(node: TreeNode<T> | null): boolean {
  return node !== null && node.left === null && node.right === null;
}

/** Height (node count on the longest root-to-leaf path); empty tree is 0. */
export function height<T>(node: TreeNode<T> | null): number {
  if (node === null) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

/** Edge-count depth of the first node found with the given value, or -1. */
export function depthOf<T>(root: TreeNode<T> | null, target: T): number {
  function walk(node: TreeNode<T> | null, depth: number): number {
    if (node === null) return -1;
    if (node.value === target) return depth;
    const leftResult = walk(node.left, depth + 1);
    if (leftResult !== -1) return leftResult;
    return walk(node.right, depth + 1);
  }
  return walk(root, 0);
}

// Exercise: count the leaves (nodes with no children) in the tree.
export function countLeavesStub<T>(_node: TreeNode<T> | null): number {
  throw new Error('not implemented');
}
// Solution:
export function countLeaves<T>(node: TreeNode<T> | null): number {
  if (node === null) return 0;
  if (isLeaf(node)) return 1;
  return countLeaves(node.left) + countLeaves(node.right);
}

// --- run ---
if (require.main === module) {
  const tree = buildSampleTree();

  console.assert(size(tree) === 7, 'sample tree should have 7 nodes');
  console.assert(height(tree) === 3, 'sample tree height should be 3 (path 5-3-2)');
  console.assert(isLeaf(tree) === false, 'root is not a leaf');
  console.assert(isLeaf(tree.left as TreeNode<number>) === false, 'node 3 has children, not a leaf');
  console.assert(isLeaf((tree.left as TreeNode<number>).left as TreeNode<number>) === true, 'node 2 is a leaf');

  console.assert(depthOf(tree, 5) === 0, 'root 5 has depth 0');
  console.assert(depthOf(tree, 3) === 1, 'node 3 has depth 1');
  console.assert(depthOf(tree, 2) === 2, 'node 2 has depth 2');
  console.assert(depthOf(tree, 9) === 2, 'node 9 has depth 2');
  console.assert(depthOf(tree, 100) === -1, 'value not present should return -1');

  console.assert(countLeaves(tree) === 4, 'sample tree has 4 leaves: 2, 4, 7, 9');
  console.assert(countLeaves(null) === 0, 'empty tree has 0 leaves');

  console.log('01-tree-fundamentals: all assertions passed');
}
