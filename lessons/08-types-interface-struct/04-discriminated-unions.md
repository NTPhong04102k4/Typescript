# Discriminated unions for tree/graph nodes

**Objective:** Model tree and graph node variants as a tagged union so the compiler enforces exhaustive, type-narrowed handling of every case.

## Concept

A **discriminated union** is a union of object types that all share one
literal-typed field (the "tag" or "discriminant"). Switching on the tag
narrows the rest of the object's type in each branch:

```
type TreeNode =
  | { kind: 'leaf'; value: number }
  | { kind: 'node'; value: number; left: TreeNode; right: TreeNode }

switch (t.kind) {
  case 'leaf':                 t : { kind: 'leaf'; value: number }
    return t.value;                     ^ left/right not accessible here — correctly so
  case 'node':                 t : { kind: 'node'; value; left; right }
    return t.value + sumTree(t.left) + sumTree(t.right);
  default:                     t : never   <-- compiler proves every case is handled
    const check: never = t;
}
```

Assigning the unreachable `default` branch's value to a `never`-typed
variable is the standard **exhaustiveness check**: if a new variant is ever
added to `TreeNode` without updating the switch, the assignment stops
compiling instead of silently doing the wrong thing at runtime.

## When to use

| Modeling choice | Pros | Cons |
| --- | --- | --- |
| Discriminated union (`kind: 'leaf' \| 'node'`) | Exhaustiveness checked by the compiler; no invalid states representable; narrows automatically | Every variant's shape must be written out; deeply nested unions can get verbose |
| Class hierarchy (`abstract class Node`, subclasses) | Familiar OOP shape; can attach methods per variant | No compiler-enforced exhaustiveness on `instanceof` chains; more runtime overhead per node |
| Single interface with optional/nullable fields (`left?: TreeNode \| null`) | Simple, matches typical LeetCode `TreeNode` class signature | Invalid states are representable (e.g. a "leaf" that still has a stray `left`); no narrowing benefit |

For internal library code, prefer the discriminated union — it is what
makes `sumTree`, `heightOf`, and `mirror` provably total functions. For
LeetCode itself, you'll usually be handed the optional-field class form (as
in `TreeNode { val, left, right }`) — this lesson's union is how you'd
redesign it for a real codebase.

## Walkthrough

`04-discriminated-unions.ts` defines `TreeNode` as `{ kind: 'leaf'; value }`
or `{ kind: 'node'; value; left; right }`, with `leaf`/`node` constructor
helpers. `sumTree`, `heightOf`, and `countLeaves` all switch on `t.kind`
with the `never`-check exhaustiveness pattern.

`VertexState` applies the same idea to graph traversal status
(`unvisited` / `visiting` / `visited`, each carrying only the fields that
make sense for that state — `discoveredAt` only exists once a vertex is
being or has been visited). `describeVertex` narrows and formats each case.

The exercises implement `mirror` (swap every node's children, LeetCode 226)
and `isBalanced` (height difference of subtrees ≤ 1 at every node),
both structured as the same exhaustive switch.

## LeetCode practice

- 226. Invert Binary Tree (Easy) — exactly the `mirror` exercise in this file.
- 104. Maximum Depth of Binary Tree (Easy) — the same recursion shape as `heightOf`.
- 133. Clone Graph (Medium) — cloning requires tracking a visited/in-progress/done state per node, the same shape as `VertexState`.

## Key takeaways

- A discriminated union's shared literal tag (`kind`) is what lets TypeScript narrow the rest of the type per branch.
- The `default: { const x: never = t; }` pattern turns "did I handle every case" into a compile error instead of a runtime surprise.
- Discriminated unions make invalid states unrepresentable — a `'leaf'` variant simply has no `left`/`right` fields to misuse.
- The same tagged-union technique models tree nodes, graph traversal state, and (lesson 05) state-machine states — it is one general tool.
- Real LeetCode signatures usually use a nullable-field class instead; the union form here is the "how you'd design it for production" version.

Companion code: [`04-discriminated-unions.ts`](./04-discriminated-unions.ts)
