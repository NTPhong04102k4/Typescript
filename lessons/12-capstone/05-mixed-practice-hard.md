# Mixed Practice Set 3 (Hard, Cross-Topic)

**Objective:** Combine multiple structures per problem (heap+list, two pointers, tree+string, graph+BFS, monotonic stack) to solve five unrelated Hard problems.

## Concept

Hard problems usually chain two techniques from earlier topics rather than
inventing a new one:

```
Merge k Sorted Lists ..................... linked list + heap (k-way merge)
Trapping Rain Water ....................... array + two pointers
Serialize/Deserialize Binary Tree ......... tree + string (preorder w/ null markers)
Word Ladder ................................ graph (implicit) + BFS shortest path
Largest Rectangle in Histogram ............ array + monotonic stack
```

The monotonic stack for Largest Rectangle in Histogram is the trickiest to
trace, so walk it once: keep a stack of indices with **increasing** bar
heights. When a shorter bar arrives, it means every taller bar behind it
can never extend further right, so pop and finalize its rectangle:

```
heights = [2, 1, 5, 6, 2, 3]   (append a sentinel 0 at the end)

i=1 (h=1): pop index0 (h=2) -> width=1 -> area=2   maxArea=2
i=4 (h=2): pop index3 (h=6) -> width=1 -> area=6
           pop index2 (h=5) -> width=2 -> area=10  maxArea=10
i=6 (h=0, sentinel): pop remaining bars, no larger area found

Answer: 10 (the 5x2 rectangle spanning bars of height 5 and 6)
```

## Complexity

| Problem                                                        | Time                       | Space   |
|------------------------------------------------------------------|-----------------------------|---------|
| `mergeKLists` (23. Merge k Sorted Lists)                          | O(N log k), N = total nodes | O(k)    |
| `trap` (42. Trapping Rain Water)                                   | O(n)                        | O(1)    |
| `serialize`/`deserialize` (297. Serialize and Deserialize Binary Tree) | O(n)                    | O(n)    |
| `ladderLength` (127. Word Ladder)                                  | O(n^2 · L), n = words, L = word length | O(n) |
| `largestRectangleArea` (84. Largest Rectangle in Histogram)        | O(n)                        | O(n)    |

## Walkthrough

`05-mixed-practice-hard.ts` is self-contained with its own `ListNode` and
`TreeNode`:

- `mergeKLists(lists)` maintains a min-heap of `{ val, node }` keyed by
  node value. Repeatedly pop the smallest, attach it to the result, and if
  it had a `next`, push that into the heap — an O(N log k) generalization
  of the two-list merge from lesson 03.
- `trap(height)` walks two pointers inward from both ends, tracking
  `leftMax`/`rightMax`. Water trapped above the shorter side only depends
  on the shorter side's running max, so the pointer on the shorter side
  always advances.
- `serialize(root)` does a preorder traversal, writing `'#'` for every
  `null` child so the shape is fully recoverable. `deserialize(data)`
  replays the same preorder order, consuming one token per call to rebuild
  each node and its children.
- `ladderLength(beginWord, endWord, wordList)` treats every word as a graph
  node with an implicit edge to any word one letter away, then runs BFS
  (queue of `[word, steps]`) to find the shortest transformation path —
  BFS guarantees the first time `endWord` is reached is via the fewest
  steps.
- `largestRectangleArea(heights)` uses the monotonic stack traced above:
  each bar is pushed once and popped once, giving O(n) total despite the
  nested-looking `while` inside the `for`.
- `firstMissingPositive(nums)` (exercise) solves LeetCode 41 in O(n)
  time/O(1) extra space by placing each value `v` (1 <= v <= n) at index
  `v - 1` via swaps, then scanning for the first index whose value is wrong.

## LeetCode practice

- 23. Merge k Sorted Lists (Hard)
- 42. Trapping Rain Water (Hard)
- 297. Serialize and Deserialize Binary Tree (Hard)
- 127. Word Ladder (Hard)
- 84. Largest Rectangle in Histogram (Hard)

## Key takeaways

- Hard problems are usually two Medium ideas stacked (heap + merge,
  two pointers + running max, BFS + implicit graph) — decompose before
  coding.
- A min-heap generalizes two-way merging to k-way merging with the same
  "pop smallest, push its successor" loop.
- BFS explores in increasing distance order, which is exactly why it (not
  DFS) answers "shortest path/fewest steps" questions like Word Ladder.
- A monotonic stack turns an apparent O(n^2) "for every bar, look at every
  other bar" problem into O(n) because each element is pushed and popped
  at most once.

Companion code: [`05-mixed-practice-hard.ts`](./05-mixed-practice-hard.ts)
