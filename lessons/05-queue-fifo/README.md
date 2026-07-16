# 05 · Queue (FIFO)

Queues enforce First-In-First-Out order: whatever entered first leaves
first, which makes them the natural structure for anything processed in
arrival order — job schedulers, breadth-first search frontiers, rate
limiters, and sliding-window aggregations. This topic builds a `Queue<T>`
from scratch (naive array, circular buffer, linked list), extends it to a
`Deque<T>` for both-ends access, then applies queues to monotonic-window
problems, graph/tree BFS, task scheduling, and a final practice set. Each
lesson's companion `.ts` file reuses classes from earlier lessons where it
makes sense, so work through them in order.

Lessons:
- 01 — Queue fundamentals & FIFO, ASCII diagram
- 02 — Implementing Queue: array vs circular buffer vs linked list
- 03 — Deque (double-ended queue)
- 04 — Monotonic queue / sliding window maximum
- 05 — BFS using a queue
- 06 — Task scheduling & rate limiting with queues
- 07 — LeetCode practice set: Queue
