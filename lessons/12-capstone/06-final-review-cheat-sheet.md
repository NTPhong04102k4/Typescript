# Final Review: Choosing the Right Data Structure + Engine Perf Cheat Sheet

**Objective:** Given a problem's requirements, quickly pick the data structure that satisfies them and recall its engine-level performance characteristics.

## Concept

Every structure in this curriculum optimizes for a different access
pattern. The fastest way to choose under pressure is to name the
*operation* you need most, then follow the flowchart to the structure that
makes it cheap:

```
                         What do you need FAST?
                                  |
        +---------+---------+----+----+---------+---------+---------+
        |         |         |         |         |         |         |
   index-based  order-     LIFO      FIFO      k-th      ordered   many-to-many
   access       preserving (undo/     (BFS/     extreme   range     relationships
   by position  fast       call       task      value     search/   (edges between
               lookup /    stack)     queue)    so far    sorted    entities)
               dedupe                            (top-K)   iteration
        |         |         |         |         |         |         |
        v         v         v         v         v         v         v
     Array    Map / Set    Stack     Queue     Heap /   Tree (BST, Graph
   (index      (hash                          Priority   balanced)  (adjacency
   arithmetic,  table,                        Queue                 list) +
   contiguous   O(1) avg                                             BFS/DFS/
   memory)      lookup)                                              Dijkstra/
                                                                       Union-Find
   Need character-by-character text work instead of generic
   elements? -> String (immutable in JS; build with an array/
   join or a mutable builder pattern for heavy concatenation,
   never `+=` in a hot loop).
```

Two follow-up questions narrow it further:

- **Need both LIFO order recovery AND fast lookup?** (e.g. undo history
  with dedup) -> Stack backed by a Map for membership checks.
- **Need a linked structure that also supports O(1) recency reordering?**
  (e.g. LRU cache) -> Map alone suffices in JS/TS, since `Map` preserves
  insertion order (see lesson 04's `LRUCache`) — you don't need a separate
  doubly linked list unless you're outside a language with that guarantee.

## Complexity

A single reference table across every structure in the curriculum. "Avg"
entries assume a well-distributed hash function (JS `Map`/`Set` use one
internally); worst case degrades to O(n) under adversarial collisions.

| Structure                      | Access            | Search              | Insert                        | Delete            | Use when...                                          |
|---------------------------------|-------------------|----------------------|--------------------------------|--------------------|-------------------------------------------------------|
| Array                            | O(1) by index     | O(n)                 | O(n) worst, O(1) amortized push at end | O(n)        | Index-based access, cache-friendly iteration           |
| String (immutable)               | O(1) read char     | O(n)                 | O(n) (rebuilds on concat)       | O(n)               | Text; batch-build instead of repeated `+=`             |
| Linked List (singly/doubly)      | O(n)               | O(n)                 | O(1) at a known node            | O(1) at a known node | Frequent insert/delete without shifting              |
| Stack (LIFO)                     | O(n)               | O(n)                 | O(1) push                       | O(1) pop           | Undo, DFS, expression parsing, monotonic stack         |
| Queue (FIFO)                      | O(n)               | O(n)                 | O(1) enqueue                    | O(1) dequeue       | BFS, task scheduling, rate limiting                    |
| Heap / Priority Queue             | O(1) peek min/max  | O(n)                 | O(log n)                        | O(log n) extract   | Top-K, k-way merge, running median, scheduling         |
| Map / Set (hash table)            | O(1) avg           | O(1) avg             | O(1) avg                        | O(1) avg           | Fast lookup, dedupe, frequency counting                |
| Tree (balanced BST)               | O(log n)           | O(log n)             | O(log n)                        | O(log n)           | Ordered data with fast search + range queries          |
| Graph (adjacency list)            | O(1) per neighbor list | O(V + E) traversal | O(1) add edge                  | O(degree)          | Relationships/networks; pick the algorithm per question |

## Walkthrough

`06-final-review-cheat-sheet.ts` has no new algorithms — it's a typed
reference you can import mentally (or literally) during review:

- `dataStructureCheatSheet` is a `readonly DataStructureProfile[]` mirroring
  the table above, one entry per structure, so the notes are queryable in
  code instead of only in prose.
- `describeStructure(name)` looks up a single entry by name — useful for
  quizzing yourself (`describeStructure('Heap (Priority Queue)')`).
- `recommendStructure(need)` (exercise) takes a normalized `Need` literal
  (e.g. `'fifo'`, `'top-k'`) and returns which structure name(s) satisfy it,
  encoding the flowchart above as an exhaustive `switch` so TypeScript
  flags any missing case at compile time.

## Key takeaways

- Name the operation you need fastest first ("I need to find duplicates
  quickly" -> Map/Set), then pick the structure — don't start from the
  structure and hope it fits.
- Average-case hash table performance (O(1)) assumes good distribution;
  always mention the worst case (O(n)) when discussing Map/Set/heap-backed
  designs in an interview.
- `Map`'s insertion-order guarantee in JS/TS is a genuine free feature —
  it replaces the classic "hash map + doubly linked list" LRU design from
  other languages.
- Graphs aren't one structure with one complexity — the adjacency list is
  cheap to build, but the traversal algorithm (BFS/DFS/Dijkstra/Union-Find)
  you run on top of it determines the real time complexity.
- When in doubt, sketch the flowchart from the operation you need, not the
  data you're given — arrays can simulate stacks/queues/heaps, so the
  *access pattern* is the real decision, not the storage.

## Graduation problems

- 212. Word Search II (Hard)
- 295. Find Median from Data Stream (Hard)
- 1235. Maximum Profit in Job Scheduling (Hard)

Companion code: [`06-final-review-cheat-sheet.ts`](./06-final-review-cheat-sheet.ts)
