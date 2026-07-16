# Building a type-safe mini DSA library (barrel export)

**Objective:** Combine this topic's generic structures into one "barrel" entry point — a curated, type-safe public API that hides internal file layout from callers.

## Concept

A **barrel** is a module whose only job is to re-export selected names from
other modules, so consumers import from one place instead of reaching into
internal files:

```
03-generics.ts  ---export { Stack, Queue, Pair, ... } --->
                                                             06-type-safe-dsa-library.ts  ---> consumer:
04-discriminated-unions.ts --export { TreeNode, ... } --->     (the "barrel")                 import { Stack, TreeNode, levelOrderSum }
                                                                                                 from './06-type-safe-dsa-library'
```

`export { X } from './module'` re-exports `X` **without** creating a local
binding — if the barrel file itself wants to *use* `X` (not just forward
it), it needs its own `import { X } from './module'` alongside the
re-export. Both can coexist in the same file without conflict, which is
exactly the pattern `06-type-safe-dsa-library.ts` uses.

## When to use

| Approach | Discoverability | Risk |
| --- | --- | --- |
| Barrel file re-exporting a curated set | High — one import path, IDE autocomplete shows the whole public surface | Can hide accidental circular imports between the re-exported modules; slightly indirect to trace a symbol back to its source |
| Deep imports (`import { Stack } from './03-generics'`) | Lower — callers must know internal file layout | None of the barrel's indirection; simplest to trace, but leaks internal structure |
| Single mega-file with everything defined inline | Highest within that file | Poor separation of concerns; defeats the purpose of splitting lessons/topics at all |

Barrels are the right call for a small, stable public API (like this
topic's mini library). They are less appropriate inside a large app where
they can cause accidental circular imports across many files — a tradeoff
worth knowing, not just a default to reach for everywhere.

## Walkthrough

`06-type-safe-dsa-library.ts` re-exports `Stack`, `Queue`, `Pair`,
`longest`, `HasLength`, `mapStack`, `Comparable`, and `maxOf` from
`./03-generics`, and `TreeNode`, `leaf`, `node`, `sumTree`, `heightOf`,
`countLeaves`, and `mirror` from `./04-discriminated-unions` — the curated
public surface of this topic's mini library.

It then adds its own convenience API built only from those re-exported
pieces: `stackOf`/`queueOf` (array → `Stack<T>`/`Queue<T>` builders) and
`levelOrderSum`, a BFS-style traversal over `TreeNode` using the barrel's
own `Queue<T>` — mirroring the level-order traversal pattern from LeetCode
102.

The exercises add `stackToQueueOrder` (drain a `Stack<T>` into an array
recording pop order) and `averageValue` (`sumTree` divided by a locally
computed node count), showing that barrel consumers can build new
functionality purely from the exported API without touching internals.

## LeetCode practice

- 102. Binary Tree Level Order Traversal (Medium) — the same `Queue<TreeNode>`-driven BFS as `levelOrderSum`.
- 199. Binary Tree Right Side View (Medium) — another level-order traversal built the same way, tracking the last node per level instead of a sum.
- 232. Implement Queue using Stacks (Easy) — a good exercise in composing the barrel's own `Stack<T>`/`Queue<T>` exports.

## Key takeaways

- `export { X } from './module'` re-exports without a local binding; import `X` separately if the barrel needs to use it too.
- A barrel gives consumers one stable import path and hides internal file layout — good for a small, curated public API.
- Barrels can hide circular-import risk between the modules they aggregate; that's a real cost to weigh against the discoverability benefit.
- New functionality (`stackOf`, `levelOrderSum`, `averageValue`) can be built entirely from re-exported pieces, proving the public API is actually sufficient.
- This lesson is the capstone of topic 08: every generic/union/enum pattern from lessons 01-05 is the type-level foundation the rest of the curriculum's `Stack<T>`, `Queue<T>`, `TreeNode`, and graph types build on.

Companion code: [`06-type-safe-dsa-library.ts`](./06-type-safe-dsa-library.ts)
