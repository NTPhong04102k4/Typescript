# Engine & Memory Optimization: Writing Code V8 Can Run Fast

**Objective:** Apply engine-aware micro-optimizations — monomorphic object shapes, typed arrays for hot loops, packed (not holey) arrays, and Map vs plain object — to cut the constant factor that Big-O ignores. This lesson is the practical payoff of topic 00 (Engine Internals).

## Concept

Lessons 01-03 lowered the asymptotic cost. But two O(n) loops can still
differ by 10x depending on how the JavaScript engine represents your data.
These are the four highest-leverage habits, each tied directly to a topic-00
lesson.

**1. Monomorphic object shapes** (topic 00, lesson 05). V8 gives every object
a hidden class based on its keys *and their insertion order*. Build every
object the same way — same factory, same field order — so a hot read like
`p.x` stays *monomorphic* (fixed offset, no shape check). Varying shapes
degrade the call site to polymorphic, then megamorphic (generic lookup).

```
createPoint(x, y) -> { x, y }  (always this order)
   p1 {x,y}  p2 {x,y}  p3 {x,y}   -> ONE hidden class -> monomorphic  (fast)

vs. mixing { x, y } and { y, x } or adding keys later
   -> several hidden classes -> polymorphic/megamorphic  (slow)
```

**2. Typed arrays for numeric hot loops** (topic 00, lesson 04). An
`Int32Array` is a contiguous buffer of unboxed 32-bit ints with a fixed
elements kind — no boxing, no type check per element, cache-friendly stride.
For integer-heavy inner loops it beats a general `number[]`.

**3. Packed, not holey, arrays** (topic 00, lesson 04). Filling front-to-back
with `push` keeps an array PACKED (fastest). `new Array(n)` allocates a HOLEY
backing store, adding a hole-check to every read — permanently, since
elements-kind transitions are one-way.

```
buildPackedSquares:  [] then push 0,1,4,9...   -> PACKED_SMI  (no hole check)
buildHoleyThenFill:  new Array(6) then fill     -> HOLEY      (hole check/read)
                     ^ both hold [0,1,4,9,16,25], different internal layout
```

**4. Map vs plain object** (topic 00, lesson 05). For dynamic, unknown-ahead
keys, use a `Map`: it is built for that and never demotes to the slow
dictionary mode the way a plain object does once it is used as a hash table
(and it sidesteps inherited-key hazards like `__proto__`). Reserve plain
objects for small, fixed, known-ahead key sets — exactly the case where a
stable hidden class makes them fast.

## Complexity

Big-O is identical across each pair; only the constant factor moves.

| Choice | Big-O | Constant-factor effect | Engine cause |
|---|---|---|---|
| Monomorphic vs mixed shapes | O(n) both | monomorphic much faster per read | hidden class / inline cache |
| `Int32Array` vs `number[]` (int loop) | O(n) both | typed array faster, less memory | unboxed elements kind |
| Packed vs holey array | O(n) both | packed avoids per-read hole check | packed vs holey elements kind |
| `Map` vs object (dynamic keys) | O(1) avg both | Map avoids dictionary-mode demotion | hidden class → dictionary fallback |

## Walkthrough

[`04-engine-memory-optimization.ts`](./04-engine-memory-optimization.ts) is
deliberately correctness-checkable — the speed claims are documented, not
asserted, because wall-clock timing is flaky.

`createPoint` is the monomorphic factory: every `Point` gets `{ x, y }` in
the same order, so `totalManhattanFromOrigin`'s `p.x`/`p.y` reads hit a
monomorphic inline cache. `toInt32Array` copies numbers into an `Int32Array`
and `sumInt32` is the tight numeric loop that benefits from it.
`buildPackedSquares` (push-based, packed) and `buildHoleyThenFill`
(`new Array(n)`, holey) produce identical values — the assertion proves
equality while the comment explains the layout difference. `frequenciesWithMap`
and `frequenciesWithObject` (null-prototype) tally the same counts, framing
the Map-vs-object choice.

The exercises stay on theme: `dotProduct` is a typed-array hot loop, and
`mostFrequent` uses a `Map` tally for dynamic string keys.

## LeetCode practice

- **1. Two Sum** (Easy) — a `Map` is the natural index store for dynamic keys (contrast with a fixed-shape object).
- **347. Top K Frequent Elements** (Medium) — Map-based frequency tally, exactly `frequenciesWithMap` + selection.
- **238. Product of Array Except Self** (Medium) — tight numeric loops over packed arrays; a good candidate for typed-array storage.

## Key takeaways

- Algorithmic optimization sets the Big-O; engine-aware optimization sets the
  constant factor — both matter, and this topic covers both.
- Build objects with a consistent shape (same factory, same key order) to
  keep hot property reads monomorphic (topic 00, lesson 05).
- Use `Int32Array`/typed arrays for integer-heavy hot loops: unboxed,
  contiguous, fixed elements kind (topic 00, lesson 04).
- Fill arrays front-to-back with `push` to stay packed; `new Array(n)` and
  sparse writes create holey arrays with a per-read cost that never reverts.
- Prefer `Map` for dynamic keys and plain objects for small fixed shapes —
  matching the structure to how V8 optimizes each (topic 00, lesson 05).

Companion code: [`04-engine-memory-optimization.ts`](./04-engine-memory-optimization.ts)
