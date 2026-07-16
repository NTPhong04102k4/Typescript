# 06 · Heap / Priority Queue

A heap gives O(1) peek and O(log n) insert/extract for the min or max
element, which is exactly what "keep processing the most urgent/smallest/
largest item next" problems need. This topic builds a generic `MinHeap`/
`MaxHeap` on top of a plain array (the classic complete-binary-tree-as-array
layout) in lessons 01-03, then spends the rest of the topic applying it:
priority queues, Top-K selection, k-way merges, and streaming medians via
two heaps. Work through the lessons in order — every lesson after 03 reuses
the heap class built there instead of redefining it.

Lessons:
- 01 — Heap fundamentals: complete binary tree as array, ASCII diagram
- 02 — Min-heap & max-heap implementation
- 03 — Heapify, insert, extract-min/max
- 04 — Priority queue applications
- 05 — Top-K problems using heap
- 06 — K-way merge using heap
- 07 — Median-finding with two heaps
- 08 — LeetCode practice set: Heap
