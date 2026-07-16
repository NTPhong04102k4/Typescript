# Hidden Classes & Inline Caches: Why Object/Map Shape Affects Perf

**Objective:** Understand V8's hidden classes (internal object "shapes")
and inline caches (per-call-site type feedback), and why constructing
objects consistently is one of the highest-leverage JS performance habits.

## Concept

V8 never treats a plain object as a free-form hash table if it can avoid
it. Instead, every object gets an internal **hidden class** describing its
shape: the property keys, in the order they were first assigned. Objects
built with the same keys in the same order share a hidden class and get
fast, fixed-offset property access (like a struct in C). Objects with
different key sets or a different insertion order get a *different*
hidden class — even if they end up with the exact same keys.

```
const a = { x: 1, y: 2 };       const c = { y: 1, x: 2 };
const b = { x: 3, y: 4 };
      |                                  |
      v                                  v
 hidden class #1 { x, y }         hidden class #2 { y, x }
      ^                            (different insertion order!)
      |
   a, b share this hidden class -> fast, monomorphic property access
```

A call site that reads a property repeatedly (e.g. `p.x` inside a loop)
keeps an **inline cache (IC)**: a memo of which hidden class(es) it has
seen there before.

```
IC states, in order of speed:
 uninitialized -> monomorphic (1 shape)  -> polymorphic (2-4 shapes) -> megamorphic (5+ shapes)
      cold            fastest                  a few checks              generic slow lookup
```

Monomorphic call sites are fastest: V8 can hard-code "read the value 8
bytes into this object" with no runtime check. Megamorphic call sites fall
back to a much slower generic property lookup on every call. Deleting a
property (`delete obj.key`) is especially costly: V8 immediately demotes
that object out of the hidden-class system entirely into a **dictionary
mode** (a real, per-object hash table) — permanently, for that object.

## Complexity

| Access pattern                                | Time per property read     |
|--------------------------------------------------|-------------------------------|
| Monomorphic inline cache hit                      | O(1), fixed offset            |
| Polymorphic inline cache (2-4 shapes)              | O(k) shape checks, k small    |
| Megamorphic inline cache (5+ shapes)               | O(1) but a much larger constant (generic lookup) |
| Dictionary-mode object (post-`delete`)             | O(1) hashed, larger constant than any hidden-class path |

## Walkthrough

`05-hidden-classes-inline-caches.ts` models both concepts directly:

- `HiddenClassRegistry` assigns a numeric id per distinct shape signature
  (`Object.keys(obj).join(',')`), mirroring how any two objects with equal
  key order share a hidden class regardless of object identity.
- `InlineCacheSimulator.record` replays one call site seeing a sequence of
  objects and reports its `InlineCacheState`, exactly following V8's
  uninitialized → monomorphic → polymorphic → megamorphic progression.
- `createPointsConsistentOrder` builds every object with the same `{ x, y }`
  order (one shared hidden class); `createPointsTwoShapes` alternates
  `{ x, y }` and `{ y, x }` (two hidden classes) so `sumX` + `timeIt` can
  compare the two in practice.
- `demonstrateDeletionEffect` shows that `delete obj.y; obj.y = 20` changes
  the shape signature (`x,y,z` → `x,z,y`) even though the final key set is
  identical — insertion order is part of the shape. (Real V8 also demotes
  the object to dictionary mode on `delete`, which this simplified model
  does not simulate — see the code comment.)
- `MyHashSet`/`MyHashMap` are hand-built bucket hash tables: literally the
  fallback data structure V8 uses internally once an object can no longer
  benefit from hidden classes.

## LeetCode practice

- 705. Design HashSet (Easy) — a bucket hash table, the dictionary-mode fallback
- 706. Design HashMap (Easy) — same idea with key/value pairs
- 49. Group Anagrams (Medium) — grouping via `Map` keys sidesteps object-shape concerns entirely

## Key takeaways

- Hidden classes are keyed by property insertion order, not just the set
  of keys — build objects the same way every time (same constructor, same
  field order) to keep call sites monomorphic.
- Inline caches degrade in four stages; megamorphic call sites are the
  ones worth profiling and fixing first.
- `delete` is expensive beyond the O(1) removal cost — it can knock an
  object out of the hidden-class system entirely.
- Prefer `Map` for objects with fully dynamic/unknown keys — plain objects
  are optimized for consistent, known-ahead-of-time shapes (deeper
  comparison lives in topic 07's Map-vs-Object lesson).

Companion code: [`05-hidden-classes-inline-caches.ts`](./05-hidden-classes-inline-caches.ts)
