# Mixed Practice Set 1 (Easy, Cross-Topic)

**Objective:** Apply the right data structure to five unrelated Easy problems in one sitting, reinforcing pattern recognition over rote memorization.

## Concept

Interviews rarely tell you which topic a problem belongs to — recognizing
"this needs a hash map" or "this needs a stack" from the problem statement
*is* the skill. This lesson has no single throughline; instead it mixes one
Easy problem from five different structures so you practice the harder
task of pattern **recognition**, not just execution:

```
Two Sum ............... array + hash map (complement lookup)
Valid Parentheses ...... stack (LIFO matching)
Reverse Linked List .... linked list (pointer rewiring)
Maximum Depth of Tree .. tree (recursion)
Kth Largest in Stream .. heap (maintain top-k incrementally)
```

For each problem, ask: *what does the input structure suggest, and what
operation do I need fast?* Need "have I seen this before" -> map/set. Need
"undo the most recent thing" -> stack. Need "smallest of the biggest k so
far" -> heap.

## Complexity

| Problem                                   | Time            | Space        |
|---------------------------------------------|-----------------|--------------|
| `twoSum` (1. Two Sum)                        | O(n)            | O(n)         |
| `isValidParentheses` (20. Valid Parentheses) | O(n)            | O(n)         |
| `reverseList` (206. Reverse Linked List)     | O(n)            | O(1)         |
| `maxDepth` (104. Maximum Depth of Binary Tree)| O(n)           | O(h) recursion (h = tree height) |
| `KthLargest.add` (703. Kth Largest Element in a Stream) | O(log k) per call | O(k) |

## Walkthrough

`03-mixed-practice-easy.ts` is fully self-contained: it defines its own
minimal `ListNode` and `TreeNode` classes rather than importing from the
`03-linked-list-node`/`09-trees` topic folders.

- `twoSum(nums, target)` walks the array once, checking a `Map` of
  value-to-index for the complement before inserting the current value.
- `isValidParentheses(s)` pushes opening brackets onto a stack and, on a
  closing bracket, pops and checks it matches — an empty stack at the end
  means every bracket was closed.
- `reverseList(head)` walks the list once, rewiring each node's `next`
  pointer to point backward (`prev`) instead of forward.
- `maxDepth(root)` recurses to the bottom of both subtrees and returns
  `1 + max(leftDepth, rightDepth)` — the classic "combine children's
  answers" tree recursion.
- `MinHeap`/`KthLargest` (exercise-adjacent core class) keep a min-heap of
  at most `k` elements; the heap's root is always the k-th largest value
  seen so far, so `add` pushes then pops if the heap grows past size `k`.
- `invertTree(root)` (exercise) solves LeetCode 226 by recursing on both
  children and swapping them.
- `mergeTwoLists(l1, l2)` (exercise) solves LeetCode 21 by walking both
  lists with a dummy head, always attaching the smaller current node.

## LeetCode practice

- 1. Two Sum (Easy)
- 20. Valid Parentheses (Easy)
- 206. Reverse Linked List (Easy)
- 104. Maximum Depth of Binary Tree (Easy)
- 703. Kth Largest Element in a Stream (Easy)

## Key takeaways

- The problem's *shape* (pairs, brackets, chain, hierarchy, streaming
  top-k) tells you the structure before you write a line of code.
- A stack solves any "most recent unmatched thing" problem; a heap solves
  any "k-th extreme value so far" problem.
- Reversing a linked list and computing tree depth are both O(n) single
  passes — the difference is iteration (list) vs. recursion (tree),
  because a list has one path but a tree branches.
- `KthLargest` shows a heap acting as *running state* across multiple
  calls, not just a one-shot computation.

Companion code: [`03-mixed-practice-easy.ts`](./03-mixed-practice-easy.ts)
