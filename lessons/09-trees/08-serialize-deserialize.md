# Serialize/Deserialize & Tree Construction

**Objective:** Turn a tree into a string (and back) without losing its
shape, and reconstruct a tree from two traversal orders.

## Concept

A traversal alone loses shape information: preorder `5,3,2,4,8,7,9` could
be many different trees unless you also know where the `null` children
are. **Serialization** fixes this by explicitly recording nulls during a
preorder walk, using `#` as the marker:

```
tree:                    preorder walk with null markers:

              5           visit 5            -> "5"
            /   \         recurse left (3):
           3     8           visit 3          -> "3"
          / \   / \          recurse left (2):
         2   4 7   9            visit 2       -> "2"
                                 left(null)    -> "#"
                                 right(null)   -> "#"
                              recurse right (4):
                                 visit 4       -> "4"
                                 left/right    -> "#","#"
                           recurse right (8):  ...same pattern...

  full serialized string:
  "5,3,2,#,#,4,#,#,8,7,#,#,9,#,#"
```

Deserializing just replays the same preorder order: read one token at a
time; `#` means "this child is null, stop here"; anything else becomes a
node whose left and right are filled in by recursively consuming more
tokens from the same stream. Because both sides walk in the identical
preorder sequence, no lookahead or backtracking is needed.

**Reconstruction from two traversals** (preorder + inorder) uses a
different trick: preorder's first element is always the root. Find that
value's position in the inorder array — everything to its left is the
left subtree's inorder sequence, everything to its right is the right
subtree's — then recurse on the matching slices of both arrays.

```
preorder = [5, 3, 2, 4, 8, 7, 9]
inorder  = [2, 3, 4, 5, 7, 8, 9]

root = preorder[0] = 5
inorder index of 5 = 3  ->  inorder splits into left=[2,3,4], right=[7,8,9]
                             (3 elements each side -> preorder splits the
                              same way: left=[3,2,4], right=[8,7,9])
recurse on (left preorder, left inorder) and (right preorder, right inorder)
```

## Complexity

| Operation                             | Time | Space |
|-------------------------------------------|------|-------|
| `serialize`                                | O(n) | O(n) string |
| `deserialize`                              | O(n) | O(n) |
| `buildTreeFromPreorderInorder`              | O(n) with an index map (O(n^2) with a linear `indexOf` scan) | O(n) |

The index-map trick (mapping each inorder value to its position up front)
is what keeps reconstruction O(n) instead of O(n^2) — without it, finding
the root's position in the inorder array on every recursive call costs
O(n) each time, for O(n) calls.

## Walkthrough

[`08-serialize-deserialize.ts`](./08-serialize-deserialize.ts) imports
`TreeNode` and `buildSampleTree` from
[`./01-tree-fundamentals`](./01-tree-fundamentals.ts), and
`preorderRecursive`/`inorderRecursive`/`postorderRecursive` from
[`./02-dfs-traversal`](./02-dfs-traversal.ts) to verify round-trips.
`serialize` walks the tree in preorder, pushing `#` for every null and the
value otherwise, then joins with commas. `deserialize` splits on commas
and consumes tokens one at a time with a shared cursor, rebuilding nodes in
the same preorder order they were written. `buildTreeFromPreorderInorderStub`
is the exercise: given `preorder` and `inorder` arrays (no serialized
string involved), reconstruct the original tree using the root-splits-
inorder trick above, backed by a `Map<number, number>` from value to
inorder index for O(1) lookups; `buildTreeFromPreorderInorder` is the
worked solution.

## LeetCode practice

- **297. Serialize and Deserialize Binary Tree** (Hard)
- **105. Construct Binary Tree from Preorder and Inorder Traversal** (Medium)

## Key takeaways

- A traversal alone doesn't determine a tree's shape; serialization must
  also record where the `null` children are (the `#` marker here).
- Serializing and deserializing in the same traversal order (preorder)
  means no backtracking is needed to reconstruct the tree.
- Reconstructing from preorder + inorder relies on: preorder's first
  element is the root, and that value's position in inorder splits both
  arrays into matching left/right slices.
- Precomputing a value-to-index map for the inorder array turns
  reconstruction from O(n^2) into O(n).

Companion code: [`08-serialize-deserialize.ts`](./08-serialize-deserialize.ts)
