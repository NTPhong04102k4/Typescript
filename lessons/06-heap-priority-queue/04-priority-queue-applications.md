# Priority Queue Applications

**Objective:** Use a heap-backed priority queue to model "serve the most urgent item next" problems, from generic scheduling to greedy interval/resource allocation.

## Concept

A priority queue is a `MinHeap`/`MaxHeap` wearing a different API: instead
of `push`/`pop`, callers think in terms of `enqueue(value, priority)` and
`dequeue()` returning the most urgent value. Underneath, "most urgent" is
just "current heap root."

```
enqueue('low', 3) enqueue('high', 1) enqueue('mid', 2)

Heap keyed on priority (lower number = more urgent, min-heap on priority):

           {high,1}
           /       \
     {low,3}     {mid,2}

dequeue() -> pops the root -> 'high'   (priority 1 is smallest)
dequeue() -> re-heapify     -> 'mid'   (priority 2 is next smallest)
dequeue() -> re-heapify     -> 'low'   (priority 3 is last)
```

Many greedy scheduling problems reduce to "track the smallest/largest of
a shrinking or growing set" — exactly what a heap is for:

- **Meeting Rooms II**: keep a min-heap of *end times* for rooms currently
  in use. A new meeting reuses a room if the earliest end time is already
  <= its start time; otherwise it needs a new room.
- **Furthest Building**: keep a min-heap of climb sizes already "spent" on
  ladders. When ladders run out, evict the *smallest* ladder-climb back to
  bricks — keeping the biggest climbs on the free resource.

```
Meeting Rooms II, intervals sorted by start:
  [0,30] [5,10] [15,20]

  process [0,30]: endTimes heap = {30}
  process [5,10]: peek=30 > 5 (no reuse)      -> endTimes = {30, 10}
  process [15,20]: peek=10 <= 15 (reuse room) -> pop 10, push 20
                                                   endTimes = {30, 20}
  final heap size = 2 rooms needed
```

## Complexity

| Operation                                | Time          | Space |
|--------------------------------------------|---------------|-------|
| `PriorityQueue.enqueue` / `.dequeue`        | O(log n)      | O(1) |
| `PriorityQueue.peek`                        | O(1)          | O(1) |
| `minMeetingRooms` (n intervals)             | O(n log n)    | O(n) |
| `furthestBuilding` (n buildings)            | O(n log ladders) | O(ladders) |

## Walkthrough

[`04-priority-queue-applications.ts`](./04-priority-queue-applications.ts)
defines `PriorityQueueItem<T>` and `PriorityQueue<T>`, which wraps a
`MinHeap<PriorityQueueItem<T>>` (imported from
[`./02-min-max-heap.ts`](./02-min-max-heap.ts)) and compares by
`.priority`. `minMeetingRooms` sorts intervals by start time, then uses a
`MinHeap<number>` of room end times exactly as diagrammed above.
`furthestBuilding` uses a `MinHeap<number>` of climb sizes: every uphill
climb is provisionally paid with a ladder (pushed onto the heap); once the
heap exceeds the ladder count, the cheapest climb is evicted and paid with
bricks instead, so bricks are always spent on the smallest climbs and
ladders are reserved for the biggest. The `sortByPriorityStub` exercise
asks you to drain a `PriorityQueue` into a plain array in service order.

## LeetCode practice

- **253. Meeting Rooms II** (Medium) — min-heap of meeting end times.
- **1642. Furthest Building You Can Reach** (Medium) — min-heap of ladder-
  covered climbs, greedily evicting the smallest.
- **295. Find Median from Data Stream** (Hard) — a two-heap priority-queue
  application, covered in depth in lesson 07.

## Key takeaways

- A priority queue is a heap plus a "priority" comparator — no new data
  structure, just a different vocabulary.
- Interval/scheduling problems that ask "how many resources are needed at
  once" often reduce to a min-heap of end times.
- Greedy resource-allocation problems (bricks vs. ladders) often reduce to
  "keep the best k choices in a heap, evict the worst when over budget."
- `enqueue`/`dequeue` are O(log n); reading the next item via `peek` is
  O(1).

Companion code: [`04-priority-queue-applications.ts`](./04-priority-queue-applications.ts)
