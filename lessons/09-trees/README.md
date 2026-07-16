# 09 · Trees

Trees generalize linked lists into hierarchical structures: each node points
to multiple children instead of a single "next", trading the linked list's
O(n) search for O(log n) on the balanced shapes covered here. This topic
builds one generic `TreeNode<T>` in lesson 01 and reuses it through both
traversal styles (DFS pre/in/post-order, BFS level-order), binary search
tree operations, balance intuition (AVL rotations and a Red-Black
overview), tries, the classic recursion patterns (height, diameter, LCA),
and serialization, before closing with a mixed LeetCode practice set. Work
through the lessons in order — later ones import the `TreeNode` type and
even prior traversal functions from earlier lessons to check their own
output.

Lessons:
- 01 — Tree fundamentals & terminology, ASCII tree diagram
- 02 — DFS traversal: pre/in/post-order
- 03 — BFS / level-order traversal
- 04 — Binary Search Tree operations
- 05 — Balanced trees intuition (AVL/Red-Black overview)
- 06 — Trie revisited as a tree of characters
- 07 — Tree recursion patterns (height, diameter, LCA)
- 08 — Serialize/deserialize & tree construction
- 09 — LeetCode practice set: Trees
- 10 — Segment tree: range sum/min queries with point updates
- 11 — Fenwick tree (Binary Indexed Tree): prefix sums & the low-bit trick
- 12 — Morris in-order traversal: O(1)-space threaded traversal
