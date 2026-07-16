# Tree Recursion Patterns: Height, Diameter, LCA

**Objective:** Recognize the recurring shape behind height, diameter, and
lowest-common-ancestor problems: a postorder pass that combines
information returned from both children.

## Concept

Most "hard" tree problems are really the same recursive shape as lesson
01's `height`: ask both children a question, then combine their answers at
the current node. **Diameter** and **lowest common ancestor (LCA)** just
combine differently.

**Diameter** (longest path between any two nodes, counted in edges) is not
just `height(left) + height(right)` at the root — the longest path might
be entirely inside one subtree and never touch the root. So the algorithm
tracks a running maximum across *every* node while computing heights in one
postorder pass:

```
call tree for diameterOfBinaryTree on the sample tree:

                    height(5)
                   /          \
             height(3)      height(8)
             /      \        /      \
        height(2) height(4) height(7) height(9)
         (leaf)    (leaf)    (leaf)    (leaf)

  at node 2: height=1, candidate diameter = height(null)+height(null) = 0
  at node 4: height=1, candidate diameter = 0
  at node 3: height=1+max(1,1)=2, candidate = height(2)+height(4) = 1+1 = 2
  at node 7: height=1, candidate = 0
  at node 9: height=1, candidate = 0
  at node 8: height=2, candidate = height(7)+height(9) = 1+1 = 2
  at node 5: height=1+max(2,2)=3, candidate = height(3)+height(8) = 2+2 = 4  <- max

  diameter = 4  (path 2-3-5-8-7, or 2-3-5-8-9: 4 edges, 5 nodes)
```

**Lowest Common Ancestor** asks each subtree "is `p` or `q` down there?"
and combines the two boolean-ish answers: if both children report finding
something, the current node *is* the LCA; if only one does, pass that
result up unchanged.

```
LCA(2, 9) on the sample tree:

           5                  at 5: left search finds 2 (inside 3's subtree),
         /   \                right search finds 9 (inside 8's subtree) --
        3     8               BOTH sides report a find, so 5 itself is the LCA.
       / \   / \
      2   4 7   9
```

## Complexity

| Operation                         | Time | Space (call stack) |
|--------------------------------------|------|----------------------|
| `maxDepth`                            | O(n) | O(h) |
| `diameterOfBinaryTree`                | O(n) | O(h) |
| `lowestCommonAncestor`                 | O(n) | O(h) |
| `isSameTree` (exercise)                | O(n) | O(h) |
| `countGoodNodes` (exercise)             | O(n) | O(h) |

Every one of these is a single postorder (or, for `countGoodNodes`, a
single preorder) pass — O(n) time, O(h) stack space, no repeated work.

## Walkthrough

[`07-tree-recursion-patterns.ts`](./07-tree-recursion-patterns.ts) imports
`TreeNode` and `buildSampleTree` from
[`./01-tree-fundamentals`](./01-tree-fundamentals.ts). `maxDepth` is the
same recursive definition as lesson 01's `height`, given its own name here
since LeetCode 104 calls it that. `diameterOfBinaryTree` computes height
recursively while updating a closed-over `diameter` variable with
`height(left) + height(right)` at every node, exactly as traced above.
`lowestCommonAncestor` recurses into both children; if a node's value
matches `p` or `q`, or if both recursive calls return non-null, that node
is the answer. `isSameTreeStub` is the first exercise — recursively check
that two trees have equal values at every position; `isSameTree` is the
worked solution (LeetCode 100). `countGoodNodesStub` is the second
exercise: a node is "good" if no ancestor on the path from the root has a
strictly greater value; walk root to leaves carrying the maximum seen so
far; `countGoodNodes` is the worked solution (LeetCode 1448).

## LeetCode practice

- **104. Maximum Depth of Binary Tree** (Easy)
- **543. Diameter of Binary Tree** (Easy)
- **236. Lowest Common Ancestor of a Binary Tree** (Medium)
- **100. Same Tree** (Easy)

(1448. Count Good Nodes in Binary Tree, Medium, is the second worked
exercise in the companion file.)

## Key takeaways

- Height, diameter, and LCA all share one shape: recurse into both
  children, then combine their results at the current node.
- Diameter's answer isn't necessarily at the root — track a running
  maximum across every node visited, not just the final root-level value.
- LCA reduces to "did both children report a find?" — if yes, this node is
  the answer; if only one did, forward that result unchanged.
- These are all single-pass O(n) algorithms; the naive approach of
  recomputing height/depth from scratch at every node would cost O(n^2)
  instead.

Companion code: [`07-tree-recursion-patterns.ts`](./07-tree-recursion-patterns.ts)
