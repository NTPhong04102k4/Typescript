// Companion code for ./02-dfs-traversal.md
import { TreeNode, buildSampleTree } from './01-tree-fundamentals';

// --- LeetCode 144. Binary Tree Preorder Traversal (Easy), recursive ---
export function preorderRecursive<T>(root: TreeNode<T> | null): T[] {
  if (root === null) return [];
  return [root.value, ...preorderRecursive(root.left), ...preorderRecursive(root.right)];
}

// --- LeetCode 94. Binary Tree Inorder Traversal (Easy), recursive ---
export function inorderRecursive<T>(root: TreeNode<T> | null): T[] {
  if (root === null) return [];
  return [...inorderRecursive(root.left), root.value, ...inorderRecursive(root.right)];
}

// --- LeetCode 145. Binary Tree Postorder Traversal (Easy), recursive ---
export function postorderRecursive<T>(root: TreeNode<T> | null): T[] {
  if (root === null) return [];
  return [...postorderRecursive(root.left), ...postorderRecursive(root.right), root.value];
}

// --- LeetCode 144, iterative version ---
// Push a node, pop it, visit it, then push right before left so left is
// popped (and visited) first.
export function preorderIterative<T>(root: TreeNode<T> | null): T[] {
  const result: T[] = [];
  if (root === null) return result;
  const stack: TreeNode<T>[] = [root];
  while (stack.length > 0) {
    const node = stack.pop() as TreeNode<T>;
    result.push(node.value);
    if (node.right !== null) stack.push(node.right);
    if (node.left !== null) stack.push(node.left);
  }
  return result;
}

// Exercise: implement LeetCode 94 (Inorder Traversal) iteratively using an
// explicit stack: walk down the left spine pushing every node, then pop,
// visit, and step into the popped node's right child.
export function inorderIterativeStub<T>(_root: TreeNode<T> | null): T[] {
  throw new Error('not implemented');
}
// Solution:
export function inorderIterative<T>(root: TreeNode<T> | null): T[] {
  const result: T[] = [];
  const stack: TreeNode<T>[] = [];
  let current = root;
  while (current !== null || stack.length > 0) {
    while (current !== null) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop() as TreeNode<T>;
    result.push(current.value);
    current = current.right;
  }
  return result;
}

// Exercise: implement LeetCode 145 (Postorder Traversal) iteratively.
// Post-order (left, right, node) is the reverse of "node, right, left" --
// run that order with a stack, collecting into an output list, then
// reverse the output.
export function postorderIterativeStub<T>(_root: TreeNode<T> | null): T[] {
  throw new Error('not implemented');
}
// Solution:
export function postorderIterative<T>(root: TreeNode<T> | null): T[] {
  const result: T[] = [];
  if (root === null) return result;
  const stack: TreeNode<T>[] = [root];
  while (stack.length > 0) {
    const node = stack.pop() as TreeNode<T>;
    result.push(node.value);
    if (node.left !== null) stack.push(node.left);
    if (node.right !== null) stack.push(node.right);
  }
  result.reverse();
  return result;
}

// --- run ---
if (require.main === module) {
  const tree = buildSampleTree();

  const expectedPreorder = [5, 3, 2, 4, 8, 7, 9];
  const expectedInorder = [2, 3, 4, 5, 7, 8, 9];
  const expectedPostorder = [2, 4, 3, 7, 9, 8, 5];

  console.assert(
    JSON.stringify(preorderRecursive(tree)) === JSON.stringify(expectedPreorder),
    'preorderRecursive should visit node, left, right'
  );
  console.assert(
    JSON.stringify(inorderRecursive(tree)) === JSON.stringify(expectedInorder),
    'inorderRecursive should visit left, node, right (sorted for this BST-shaped tree)'
  );
  console.assert(
    JSON.stringify(postorderRecursive(tree)) === JSON.stringify(expectedPostorder),
    'postorderRecursive should visit left, right, node'
  );

  console.assert(
    JSON.stringify(preorderIterative(tree)) === JSON.stringify(expectedPreorder),
    'preorderIterative should match preorderRecursive'
  );
  console.assert(
    JSON.stringify(inorderIterative(tree)) === JSON.stringify(expectedInorder),
    'inorderIterative should match inorderRecursive'
  );
  console.assert(
    JSON.stringify(postorderIterative(tree)) === JSON.stringify(expectedPostorder),
    'postorderIterative should match postorderRecursive'
  );

  console.assert(JSON.stringify(preorderRecursive<number>(null)) === '[]', 'empty tree preorder is []');

  console.log('02-dfs-traversal: all assertions passed');
}
