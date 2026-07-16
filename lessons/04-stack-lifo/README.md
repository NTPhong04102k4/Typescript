# 04 · Stack (LIFO)

Stacks restrict access to a single end — the top — which is what gives
them their Last-In-First-Out guarantee. This topic builds a shared
`IStack<T>` contract and two backing implementations (array vs
node-based), then layers on the patterns that contract unlocks: the
monotonic stack for "next greater/smaller" problems, expression parsing
and evaluation, the real JS call stack (which is a stack under the
hood), and designs like min-stack and multi-stack that keep auxiliary
stacks in sync for O(1) queries. Each lesson builds on the previous one,
so work through them in order.

Lessons:
- 01 — Stack fundamentals & LIFO, ASCII diagram
- 02 — Implementing Stack: array-backed vs node-backed
- 03 — Monotonic stack pattern
- 04 — Expression evaluation & parsing with stacks
- 05 — Stack & the call stack (link to Engine Internals)
- 06 — Min-stack & multi-stack designs
- 07 — LeetCode practice set: Stack
