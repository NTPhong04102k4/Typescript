// Companion code for ./12-morris-traversal.md
import { TreeNode, buildSampleTree } from './01-tree-fundamentals';

// Morris in-order traversal visits every node in sorted (in-order) sequence
// using O(1) extra space — no recursion stack, no explicit stack. The trick:
// temporarily thread each node's in-order predecessor's right pointer back
// to the node itself, follow it, then undo the thread on the way back.

/**
 * In-order traversal in O(1) space via Morris threading.
 *
 * For the current node with a left child, find its in-order predecessor
 * (rightmost node of the left subtree). If that predecessor's right pointer
 * is null, create a thread (predecessor.right = current) and descend left.
 * If the thread already points back to current, the left subtree is done:
 * remove the thread, record current's value, and descend right.
 */
export function morrisInorder<T>(root: TreeNode<T> | null): T[] {
  const result: T[] = [];
  let current: TreeNode<T> | null = root;

  while (current !== null) {
    if (current.left === null) {
      // No left subtree: visit and move right.
      result.push(current.value);
      current = current.right;
    } else {
      // Find the in-order predecessor of current.
      let predecessor: TreeNode<T> = current.left;
      while (predecessor.right !== null && predecessor.right !== current) {
        predecessor = predecessor.right;
      }
      if (predecessor.right === null) {
        // First visit: thread it and go left.
        predecessor.right = current;
        current = current.left;
      } else {
        // Second visit (thread exists): unthread, visit, go right.
        predecessor.right = null;
        result.push(current.value);
        current = current.right;
      }
    }
  }

  return result;
}

// Exercise: return the k-th smallest value (1-indexed) of a BST using Morris
// traversal, stopping early once k values have been produced.
export function kthSmallestMorrisStub(_root: TreeNode<number> | null, _k: number): number {
  throw new Error('not implemented');
}
// Solution:
export function kthSmallestMorris(root: TreeNode<number> | null, k: number): number {
  let current: TreeNode<number> | null = root;
  let count = 0;

  while (current !== null) {
    if (current.left === null) {
      count++;
      if (count === k) return current.value;
      current = current.right;
    } else {
      let predecessor: TreeNode<number> = current.left;
      while (predecessor.right !== null && predecessor.right !== current) {
        predecessor = predecessor.right;
      }
      if (predecessor.right === null) {
        predecessor.right = current;
        current = current.left;
      } else {
        predecessor.right = null;
        count++;
        if (count === k) return current.value;
        current = current.right;
      }
    }
  }
  throw new RangeError(`k=${k} exceeds the number of nodes`);
}

// --- LeetCode 94. Binary Tree Inorder Traversal (Easy) ---
// https://leetcode.com/problems/binary-tree-inorder-traversal/
// The follow-up asks for O(1) space — that is exactly Morris traversal.
export function inorderTraversal(root: TreeNode<number> | null): number[] {
  return morrisInorder(root);
}

// --- run ---
if (require.main === module) {
  // Sample tree is a BST, so in-order yields sorted order:
  //             5
  //           /   \
  //          3     8
  //         / \   / \
  //        2   4 7   9
  const tree = buildSampleTree();
  console.assert(
    JSON.stringify(morrisInorder(tree)) === JSON.stringify([2, 3, 4, 5, 7, 8, 9]),
    'Morris in-order of the BST sample tree is sorted'
  );

  // Threads must be fully removed: a second traversal gives the same result,
  // and the tree shape is restored (root.right is still node 8, not a thread).
  console.assert(
    JSON.stringify(morrisInorder(tree)) === JSON.stringify([2, 3, 4, 5, 7, 8, 9]),
    'second Morris traversal is identical (threads were cleaned up)'
  );
  console.assert(tree.right?.value === 8, 'tree structure restored after traversal');

  console.assert(JSON.stringify(morrisInorder(null)) === JSON.stringify([]), 'empty tree yields []');

  const single = new TreeNode(42);
  console.assert(JSON.stringify(morrisInorder(single)) === JSON.stringify([42]), 'single node yields [42]');

  console.assert(kthSmallestMorris(buildSampleTree(), 1) === 2, '1st smallest is 2');
  console.assert(kthSmallestMorris(buildSampleTree(), 4) === 5, '4th smallest is 5');
  console.assert(kthSmallestMorris(buildSampleTree(), 7) === 9, '7th smallest is 9');

  console.assert(
    JSON.stringify(inorderTraversal(buildSampleTree())) === JSON.stringify([2, 3, 4, 5, 7, 8, 9]),
    'LC94: inorderTraversal matches Morris in-order'
  );

  console.log('12-morris-traversal: all assertions passed');
}
