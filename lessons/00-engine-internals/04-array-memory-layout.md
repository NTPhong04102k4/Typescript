# Memory Layout of Arrays: Packed vs Holey, SMI vs Double

**Objective:** Understand V8's internal "elements kind" lattice — packed
vs holey, SMI vs double vs tagged — and why it silently determines how
fast your array operations run.

## Concept

Every JS array in V8 is tagged internally with an **elements kind**
describing two independent things:

1. **Value kind** — what's stored: small integers (SMI, unboxed), doubles
   (unboxed but still 8 bytes each), or tagged pointers (anything else,
   including mixed types — boxed and generic).
2. **Packedness** — whether the backing store is contiguous ("packed") or
   has gaps ("holey") from `delete`, sparse assignment, or `new Array(n)`.

```
                more general value kind -->
                SMI            DOUBLE           TAGGED
              +--------+     +---------+      +---------+
      packed  | [1|2|3]|     |[1.5|2.5]|      |[1|"x"|3]|   <-- packed:
              +--------+     +---------+      +---------+       contiguous
                  |               |                |
                  v               v                v
              +--------+     +---------+      +---------+
      holey   |[1|_|3] |     |[1.5|_|2]|      |[1|_|"x"]|   <-- holey:
              +--------+     +---------+      +---------+       has gaps
```

Transitions only ever move **right** (more general value kind) or **down**
(packed → holey) — never back. Push an integer, then a float, and the
whole array becomes `DOUBLE_ELEMENTS` permanently, even if you never store
another float. Delete one index, and the whole array becomes `HOLEY_*`
permanently, even after you "fill the hole back in." Reads from holey
arrays need an extra hole-check per access (and a slow-path prototype-chain
lookup if a hole is found); reads from tagged/generic arrays need a
runtime type check per access. Packed SMI arrays need neither — that's why
they're fastest.

## Complexity

| Access pattern                              | Time (per read)          | Notes                          |
|-----------------------------------------------|---------------------------|---------------------------------|
| `PACKED_SMI_ELEMENTS` read                    | O(1), no extra checks     | fastest                         |
| `PACKED_DOUBLE_ELEMENTS` read                  | O(1), no hole check       | unboxed doubles, larger stride  |
| `HOLEY_SMI_ELEMENTS` / `HOLEY_DOUBLE_ELEMENTS` read | O(1) + hole check    | branch per access               |
| `PACKED_ELEMENTS` / `HOLEY_ELEMENTS` read      | O(1) + type check (+ hole check) | most general, slowest    |
| Dictionary-mode read (very sparse array)      | O(1) hashed, but far slower constant | see lesson 05 for the object analogue |

## Walkthrough

`04-array-memory-layout.ts` defines the `ElementsKind` union and models the
lattice with two independent, monotonic dimensions: `ValueKind`
(`'smi' | 'double' | 'tagged'`) and `Packedness` (`'packed' | 'holey'`).
`TrackedArray` tracks both as you call `push`, `setAt`, and `deleteAt`,
escalating via `absorbValueKind` but never de-escalating — mirroring V8's
real one-way transitions. `combineElementsKind` maps the pair back to a
concrete `ElementsKind`, and `describeElementsKind` explains each kind in
plain English.

`createPackedArray`/`createHoleyArray` build real JS arrays (not the
`TrackedArray` model) so `sumArray` and `timeIt` (using `performance.now()`
from `perf_hooks`) can benchmark actual packed vs holey iteration.

The three LeetCode solutions were chosen because each one only ever swaps
or overwrites existing numeric slots — none of them call `delete`, use
sparse indices, or introduce mixed types — so, per this lesson's model,
none of them would ever escalate a real V8 array past `PACKED_SMI_ELEMENTS`.

## LeetCode practice

- 283. Move Zeroes (Easy) — in-place compaction keeps the array packed
- 448. Find All Numbers Disappeared in an Array (Easy) — array-as-bitmap via sign flipping, no auxiliary structure
- 41. First Missing Positive (Hard) — cyclic sort via in-place swaps

## Key takeaways

- Elements-kind transitions are one-way: once an array holds a double or a
  non-number, or once it gets a hole, it never returns to the faster kind.
- "Packed" (no holes) and "SMI/unboxed" (no boxed doubles or tagged
  pointers) are two separate, both-important properties.
- Code that never calls `delete`, never skips indices, and never mixes
  value types keeps the engine's fastest array representation.
- This is exactly the kind of engine-level cost that Big-O (lesson 01)
  doesn't capture — two O(n) loops over "arrays" can differ by a large
  constant factor purely from elements kind.

Companion code: [`04-array-memory-layout.ts`](./04-array-memory-layout.ts)
