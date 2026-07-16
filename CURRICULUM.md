# DSA & LeetCode Curriculum — TypeScript (100 Lessons)

Each lesson lives at `lessons/<topic>/<NN-slug>.md` (theory) with a sibling
`<NN-slug>.ts` (runnable implementation + exercises + LeetCode-style
practice). Run any lesson file with `npm run run lessons/<topic>/<file>.ts`.

Every `.ts` lesson file:
- has a doc-comment header linking back to its `.md`
- exports its data structure / functions
- ends with a small `// --- run ---` block with `console.log`/`console.assert`
  demonstrations (no test framework needed)
- where relevant, includes 1-3 `// Exercise:` TODOs followed by a
  `// Solution:` implementation

Every `.md` lesson has: **Objective**, **Concept + ASCII diagram** (where
visual), **Complexity table**, **Walkthrough**, **LeetCode practice**
(problem names/numbers + difficulty), **Key takeaways**.

Status legend: `[ ]` not written yet, `[x]` written.

## 00 · Engine Internals — how DSA choices interact with the JS engine (6)
- [x] 01 Big-O primer & why it predicts real engine behavior
- [x] 02 Engine pipeline: parser → AST → Ignition bytecode → TurboFan JIT
- [x] 03 Reading bytecode with `node --print-bytecode`
- [x] 04 Memory layout of arrays: packed vs holey, SMI vs double, ASCII diagram
- [x] 05 Hidden classes & inline caches: why object/Map shape affects perf
- [x] 06 Capstone: benchmarking Array vs Map vs Set with bytecode notes

## 01 · Array (11)
- [x] 01 Array fundamentals & contiguous memory model
- [x] 02 Traversal & core ops (push/pop/shift/unshift complexity)
- [x] 03 Two pointers technique
- [x] 04 Sliding window technique
- [x] 05 Prefix sums & difference arrays
- [x] 06 Merge intervals & Dutch national flag partitioning
- [x] 07 Binary search on arrays
- [x] 08 2D array / matrix traversal patterns
- [x] 09 Kadane's algorithm & subarray problems
- [x] 10 In-place array tricks (rotate, dedupe, cyclic sort)
- [x] 11 LeetCode practice set: Array (8 problems, Easy→Hard)

## 02 · String (9)
- [x] 01 String fundamentals & immutability in JS/TS
- [x] 02 Traversal & two pointers (palindromes)
- [x] 03 Sliding window on strings
- [x] 04 Hashing & anagram techniques
- [x] 05 String building perf (concat vs array-join, engine notes)
- [x] 06 Pattern matching intuition (KMP) with ASCII trace
- [x] 07 Trie for strings
- [x] 08 String parsing & stack-based decoding
- [x] 09 LeetCode practice set: String

## 03 · Linked List / Node (8)
- [x] 01 Node fundamentals: struct-like type in TS
- [x] 02 Singly linked list implementation
- [x] 03 Doubly linked list implementation
- [x] 04 Fast & slow pointers (cycle detection)
- [x] 05 Reversal techniques (iterative & recursive)
- [x] 06 Merge & sort linked lists
- [x] 07 LRU cache via node + map
- [x] 08 LeetCode practice set: Linked List

## 04 · Stack (LIFO) (7)
- [x] 01 Stack fundamentals & LIFO, ASCII diagram
- [x] 02 Implementing Stack: array-backed vs node-backed
- [x] 03 Monotonic stack pattern
- [x] 04 Expression evaluation & parsing with stacks
- [x] 05 Stack & the call stack (link to Engine Internals)
- [x] 06 Min-stack & multi-stack designs
- [x] 07 LeetCode practice set: Stack

## 05 · Queue (FIFO) (7)
- [x] 01 Queue fundamentals & FIFO, ASCII diagram
- [x] 02 Implementing Queue: array vs circular buffer vs linked list
- [x] 03 Deque (double-ended queue)
- [x] 04 Monotonic queue / sliding window maximum
- [x] 05 BFS using a queue
- [x] 06 Task scheduling & rate limiting with queues
- [x] 07 LeetCode practice set: Queue

## 06 · Heap / Priority Queue (8)
- [x] 01 Heap fundamentals: complete binary tree as array, ASCII diagram
- [x] 02 Min-heap & max-heap implementation
- [x] 03 Heapify, insert, extract-min/max
- [x] 04 Priority queue applications
- [x] 05 Top-K problems using heap
- [x] 06 K-way merge using heap
- [x] 07 Median-finding with two heaps
- [x] 08 LeetCode practice set: Heap

## 07 · Map & Set (8)
- [x] 01 Hash table fundamentals, ASCII bucket diagram
- [x] 02 JS Map vs Object vs `Record<>` in TS (hidden-class link)
- [x] 03 Set operations & use cases
- [x] 04 Frequency counting patterns
- [x] 05 Two-sum family & complement patterns
- [x] 06 Grouping patterns (anagrams, categorize)
- [x] 07 LRU/LFU-adjacent map tricks
- [x] 08 LeetCode practice set: Map/Set

## 08 · Types: interface, struct, type (6)
- [x] 01 `type` vs `interface` in TypeScript
- [x] 02 Struct-like patterns: readonly, tuples, records
- [x] 03 Generics for reusable DSA structures
- [x] 04 Discriminated unions for tree/graph nodes
- [x] 05 Enums & literal types for state machines
- [x] 06 Building a type-safe mini DSA library (barrel export)

## 09 · Trees (9)
- [x] 01 Tree fundamentals & terminology, ASCII tree diagram
- [x] 02 DFS traversal: pre/in/post-order
- [x] 03 BFS / level-order traversal
- [x] 04 Binary Search Tree operations
- [x] 05 Balanced trees intuition (AVL/Red-Black overview)
- [x] 06 Trie revisited as a tree of characters
- [x] 07 Tree recursion patterns (height, diameter, LCA)
- [x] 08 Serialize/deserialize & tree construction
- [x] 09 LeetCode practice set: Trees

## 10 · Graphs (9)
- [x] 01 Graph fundamentals & representations (adjacency list/matrix)
- [x] 02 DFS on graphs
- [x] 03 BFS on graphs
- [x] 04 Topological sort
- [x] 05 Union-Find (Disjoint Set)
- [x] 06 Shortest path: Dijkstra with a heap
- [x] 07 Cycle detection (directed & undirected)
- [x] 08 Minimum spanning tree (Kruskal/Prim overview)
- [x] 09 LeetCode practice set: Graphs

## 11 · Sorting & Searching (6)
- [x] 01 Comparison sorts overview (bubble/insertion/selection), ASCII trace
- [x] 02 Merge sort & quicksort (divide and conquer)
- [x] 03 Non-comparison sorts (counting/radix) & engine array notes
- [x] 04 Binary search deep dive & search-space reduction
- [x] 05 Sorting/searching interview patterns
- [x] 06 LeetCode practice set: Sorting/Searching

## 12 · Capstone (6)
- [x] 01 Recursion & backtracking primer
- [x] 02 Dynamic programming primer (arrays/maps as memo)
- [x] 03 Mixed practice set 1 (Easy, cross-topic)
- [x] 04 Mixed practice set 2 (Medium, cross-topic)
- [x] 05 Mixed practice set 3 (Hard, cross-topic)
- [x] 06 Final review: choosing the right data structure + engine perf cheat sheet

---
**Total: 100 lessons across 13 topics.**
