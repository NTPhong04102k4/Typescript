# 08 · Types: interface, struct, type

This topic is not an algorithm topic — it is the type-level foundation the
rest of the curriculum builds on. It covers TypeScript's type system itself:
`type` vs `interface`, struct-like patterns (`readonly`, tuples,
`Record<K, V>`), generics for reusable structures, discriminated unions for
tree/graph nodes, enums and literal types for state machines, and finally a
small type-safe "mini DSA library" that ties the previous lessons together
via a barrel export. Later topics (Linked List, Stack, Queue, Heap, Trees,
Graphs) all reuse the typing patterns established here — e.g. how a
`ListNode<T>`, `Stack<T>`, or `TreeNode` union should be declared.

Lessons:
- 01 — `type` vs `interface` in TypeScript
- 02 — Struct-like patterns: readonly, tuples, records
- 03 — Generics for reusable DSA structures
- 04 — Discriminated unions for tree/graph nodes
- 05 — Enums & literal types for state machines
- 06 — Building a type-safe mini DSA library (barrel export)
