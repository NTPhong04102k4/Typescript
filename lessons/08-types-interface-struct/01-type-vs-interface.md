# `type` vs `interface` in TypeScript

**Objective:** Understand when `type` and `interface` are interchangeable, and when a real feature difference (declaration merging, unions, intersections) forces a choice.

## Concept

TypeScript is **structurally typed**: two declarations with the same shape
are compatible regardless of how they were declared. `PointInterface` and
`PointType` below describe the exact same shape and can be passed to the
same function:

```
interface PointInterface { x: number; y: number; }
type      PointType      = { x: number; y: number; };

              both satisfy
                  |
                  v
        function distanceFromOrigin(p: { x: number; y: number }): number
```

The two forms diverge in three places:

1. **Declaration merging** — reopening an `interface` with the same name
   merges the members into one type. A `type` alias can never be
   redeclared; the second declaration is a compile error.
2. **Unions / primitive aliases** — `type NodeId = string | number` has no
   `interface` equivalent. Interfaces only describe object/function shapes.
3. **Composition** — interfaces compose via `extends` (multiple at once);
   types compose via `&` (intersection). Both end up expressing the same
   final shape, just with different syntax.

```
interface Config { name: string }      \
interface Config { version: number }    >--- merge ---> { name; version }
                                        /
```

## When to use

| Situation | Prefer |
| --- | --- |
| Public object/class API that consumers might extend or augment | `interface` |
| Modeling a union, tuple, or function type | `type` |
| Aliasing a primitive or mapped/conditional type | `type` |
| Combining multiple shapes | `interface extends` (readable) or `type &` (flexible, works with unions too) |
| A class's contract (`implements`) | `interface` (conventional, though a `type` alias for an object shape also works) |
| No particular reason either way | Either — pick one and stay consistent within a file/module |

## Walkthrough

`01-type-vs-interface.ts` opens with `PointInterface` and `PointType`,
both consumed by `distanceFromOrigin` to show structural interchangeability.

`Config` is declared twice as an `interface` to demonstrate **declaration
merging** — `describeConfig` only compiles because the merged type exposes
both `name` and `version`. The file also comments out the `type` equivalent
to make explicit that merging a `type` alias is a compile error.

`NodeId` and `Direction` show the union/primitive-alias case that `type`
uniquely covers.

`HasLength`, `HasValue<T>`, and `Sized<T>` show multi-`extends` composition;
`Box<T>` is a class that `implements Sized<T>`. `SizedType<T>` shows the
`type`-intersection equivalent of the same shape.

The exercises define `Comparator<T>` (a union of a function type and the
literal `'default'`) and `resolveComparator`, which resolves it to a
concrete comparator function — a small taste of the union-typing lessons 04
and 05 build on.

## LeetCode practice

`type` vs `interface` is a declaration-style choice, not an algorithm, so it
has no dedicated LeetCode problems of its own. The structures it enables
show up everywhere else in this curriculum instead:

- 146. LRU Cache (Medium) — the node/map structs are naturally typed with `interface`.
- 133. Clone Graph (Medium) — a graph node interface with `neighbors: Node[]` is a direct extension of the `Sized<T>`-style composition shown here.

## Key takeaways

- Structural typing means `interface` and `type` object shapes are interchangeable at the call site.
- Only `interface` supports declaration merging; only `type` supports unions, tuples, and primitive aliases.
- `extends` (interface) and `&` (type) both express composition — pick based on readability and whether unions are involved.
- A class can `implements` either an `interface` or an object-shaped `type` alias.
- Consistency within a codebase matters more than which one you pick when both work equally well.

Companion code: [`01-type-vs-interface.ts`](./01-type-vs-interface.ts)
