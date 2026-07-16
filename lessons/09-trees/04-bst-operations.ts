// Companion code for ./04-bst-operations.md
import { TreeNode, buildSampleTree } from './01-tree-fundamentals';
import { inorderRecursive } from './02-dfs-traversal';

// --- LeetCode 700. Search in a Binary Search Tree (Easy) ---
// https://leetcode.com/problems/search-in-a-binary-search-tree/
export function searchBST(root: TreeNode<number> | null, target: number): TreeNode<number> | null {
  if (root === null || root.value === target) return root;
  return target < root.value ? searchBST(root.left, target) : searchBST(root.right, target);
}

// --- LeetCode 701. Insert into a Binary Search Tree (Medium) ---
// https://leetcode.com/problems/insert-into-a-binary-search-tree/
// Walk left/right by comparison until a null slot is found; assumes no
// duplicate values.
export function insertIntoBST(root: TreeNode<number> | null, val: number): TreeNode<number> {
  if (root === null) return new TreeNode(val);
  if (val < root.value) root.left = insertIntoBST(root.left, val);
  else if (val > root.value) root.right = insertIntoBST(root.right, val);
  return root;
}

// --- LeetCode 98. Validate Binary Search Tree (Medium) ---
// https://leetcode.com/problems/validate-binary-search-tree/
// A node-vs-immediate-children check is not enough: a descendant several
// levels down can still violate an ancestor's bound. Thread a (low, high)
// bound through the recursion instead.
export function isValidBST(root: TreeNode<number> | null): boolean {
  function helper(node: TreeNode<number> | null, low: number, high: number): boolean {
    if (node === null) return true;
    if (node.value <= low || node.value >= high) return false;
    return helper(node.left, low, node.value) && helper(node.right, node.value, high);
  }
  return helper(root, -Infinity, Infinity);
}

/** Leftmost (smallest-value) node of the subtree rooted at `node`. */
function minValueNode(node: TreeNode<number>): TreeNode<number> {
  let current = node;
  while (current.left !== null) current = current.left;
  return current;
}

// --- LeetCode 450. Delete Node in a BST (Medium) ---
// https://leetcode.com/problems/delete-node-in-a-bst/
// Three cases: leaf (remove), one child (replace with it), two children
// (copy in the in-order successor's value, then delete the successor from
// the right subtree -- the successor always has at most one child).
export function deleteBSTNode(root: TreeNode<number> | null, key: number): TreeNode<number> | null {
  if (root === null) return null;
  if (key < root.value) {
    root.left = deleteBSTNode(root.left, key);
    return root;
  }
  if (key > root.value) {
    root.right = deleteBSTNode(root.right, key);
    return root;
  }
  // key === root.value
  if (root.left === null) return root.right;
  if (root.right === null) return root.left;
  const successor = minValueNode(root.right);
  root.value = successor.value;
  root.right = deleteBSTNode(root.right, successor.value);
  return root;
}

// Exercise: LeetCode 938. Range Sum of BST (Easy) -- sum every node value
// within [low, high], pruning subtrees that are entirely out of range
// instead of visiting every node.
export function rangeSumBSTStub(_root: TreeNode<number> | null, _low: number, _high: number): number {
  throw new Error('not implemented');
}
// Solution:
export function rangeSumBST(root: TreeNode<number> | null, low: number, high: number): number {
  if (root === null) return 0;
  if (root.value < low) return rangeSumBST(root.right, low, high);
  if (root.value > high) return rangeSumBST(root.left, low, high);
  return root.value + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
}

// --- run ---
if (require.main === module) {
  console.assert(searchBST(buildSampleTree(), 7)?.value === 7, 'searchBST should find node 7');
  console.assert(searchBST(buildSampleTree(), 6) === null, '6 is not in the sample tree');

  const inserted = insertIntoBST(buildSampleTree(), 6);
  console.assert(
    JSON.stringify(inorderRecursive(inserted)) === JSON.stringify([2, 3, 4, 5, 6, 7, 8, 9]),
    'inserting 6 should slot it in as the left child of 7, keeping in-order output sorted'
  );

  console.assert(isValidBST(buildSampleTree()) === true, 'the sample tree is a valid BST');
  const invalid = new TreeNode(5, new TreeNode(3, null, new TreeNode(6)), null);
  console.assert(
    isValidBST(invalid) === false,
    'node 6 is a right child of 3 (locally fine) but violates ancestor 5s upper bound'
  );

  const afterDeleteLeaf = deleteBSTNode(buildSampleTree(), 2);
  console.assert(
    JSON.stringify(inorderRecursive(afterDeleteLeaf)) === JSON.stringify([3, 4, 5, 7, 8, 9]),
    'deleting leaf 2 should just remove it'
  );
  console.assert(searchBST(afterDeleteLeaf, 2) === null, '2 should be gone after deletion');

  const afterDeleteTwoChildren = deleteBSTNode(buildSampleTree(), 8);
  console.assert(
    JSON.stringify(inorderRecursive(afterDeleteTwoChildren)) === JSON.stringify([2, 3, 4, 5, 7, 9]),
    'deleting 8 (two children) should splice in its in-order successor, 9'
  );
  console.assert(searchBST(afterDeleteTwoChildren, 8) === null, '8 should be gone after deletion');

  console.assert(rangeSumBST(buildSampleTree(), 3, 7) === 19, 'values 3+4+5+7 in range [3,7] sum to 19');

  console.log('04-bst-operations: all assertions passed');
}
