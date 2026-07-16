// Companion code for ./08-serialize-deserialize.md
import { TreeNode, buildSampleTree } from './01-tree-fundamentals';
import { preorderRecursive, inorderRecursive, postorderRecursive } from './02-dfs-traversal';

// --- LeetCode 297. Serialize and Deserialize Binary Tree (Hard) ---
// https://leetcode.com/problems/serialize-and-deserialize-binary-tree/
// Preorder walk, recording "#" for every null child. Recording nulls is
// what lets deserialize rebuild the exact original shape.
export function serialize<T>(root: TreeNode<T> | null): string {
  const tokens: string[] = [];
  function walk(node: TreeNode<T> | null): void {
    if (node === null) {
      tokens.push('#');
      return;
    }
    tokens.push(String(node.value));
    walk(node.left);
    walk(node.right);
  }
  walk(root);
  return tokens.join(',');
}

/** Inverse of serialize, for number-valued trees. */
export function deserialize(data: string): TreeNode<number> | null {
  const tokens = data.split(',');
  let index = 0;
  function walk(): TreeNode<number> | null {
    const token = tokens[index++];
    if (token === '#') return null;
    const node = new TreeNode(Number(token));
    node.left = walk();
    node.right = walk();
    return node;
  }
  return walk();
}

// Exercise: LeetCode 105. Construct Binary Tree from Preorder and Inorder
// Traversal (Medium) -- preorder's first element is always the root; that
// value's position in inorder splits both arrays into matching left/right
// slices. A value-to-index map keeps every lookup O(1).
export function buildTreeFromPreorderInorderStub(
  _preorder: readonly number[],
  _inorder: readonly number[]
): TreeNode<number> | null {
  throw new Error('not implemented');
}
// Solution:
export function buildTreeFromPreorderInorder(
  preorder: readonly number[],
  inorder: readonly number[]
): TreeNode<number> | null {
  const inorderIndex = new Map<number, number>();
  inorder.forEach((value, idx) => inorderIndex.set(value, idx));

  let preIndex = 0;
  function build(inLo: number, inHi: number): TreeNode<number> | null {
    if (inLo > inHi) return null;
    const rootValue = preorder[preIndex++];
    const idx = inorderIndex.get(rootValue) as number;
    const node = new TreeNode(rootValue);
    node.left = build(inLo, idx - 1);
    node.right = build(idx + 1, inHi);
    return node;
  }
  return build(0, inorder.length - 1);
}

// --- run ---
if (require.main === module) {
  const tree = buildSampleTree();
  const serialized = serialize(tree);
  console.assert(
    serialized === '5,3,2,#,#,4,#,#,8,7,#,#,9,#,#',
    'serialize should preorder-walk the sample tree with # for nulls'
  );

  const roundTripped = deserialize(serialized);
  console.assert(
    JSON.stringify(preorderRecursive(roundTripped)) === JSON.stringify([5, 3, 2, 4, 8, 7, 9]),
    'deserialize(serialize(tree)) should preserve preorder shape'
  );
  console.assert(
    JSON.stringify(inorderRecursive(roundTripped)) === JSON.stringify([2, 3, 4, 5, 7, 8, 9]),
    'deserialize(serialize(tree)) should preserve inorder shape'
  );

  console.assert(serialize<number>(null) === '#', 'serializing an empty tree yields just "#"');
  console.assert(deserialize('#') === null, 'deserializing "#" yields an empty tree');

  const rebuilt = buildTreeFromPreorderInorder([5, 3, 2, 4, 8, 7, 9], [2, 3, 4, 5, 7, 8, 9]);
  console.assert(
    JSON.stringify(postorderRecursive(rebuilt)) === JSON.stringify([2, 4, 3, 7, 9, 8, 5]),
    'rebuilding from preorder+inorder should reconstruct the exact original tree'
  );

  console.log('08-serialize-deserialize: all assertions passed');
}
