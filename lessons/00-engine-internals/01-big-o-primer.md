# Big-O Primer & Why It Predicts Real Engine Behavior

**Objective:** Understand Big-O as a model of *growth rate*, and see why it
still predicts real V8 performance despite constant-factor noise from JIT
warmup, caching, and memory layout.

## Concept

Big-O describes how the cost of an operation scales as input size `n` grows,
ignoring constant factors. It is not a stopwatch reading — it is a shape.
Two algorithms with the same Big-O can run at very different wall-clock
speeds (one may have a smaller constant factor, better cache locality, or
be JIT-optimized more aggressively), but as `n` grows large enough, the
algorithm with the better asymptotic class always wins.

```
time
 ^                                   O(n^2)
 |                                 .
 |                              .
 |                           .
 |                        .              O(n log n)
 |                     .           . .
 |                  .        . .
 |               .      . .            O(n)
 |            . .   . .          . . . .
 |      . . .. . .                          O(log n)
 |. . .                                    O(1)
 +------------------------------------------------> n
```

At small `n`, curves overlap and constant factors (cache misses, hidden
class transitions, bytecode dispatch overhead) dominate — this is why a
"worse" algorithm can beat a "better" one on tiny inputs. At large `n`, the
curve shape wins every time. This is exactly why engines like V8 still
reward good Big-O: JIT optimization reduces constants, but it cannot change
an O(n^2) algorithm into an O(n) one.

## Complexity

| Operation                                   | Time     | Space |
|----------------------------------------------|----------|-------|
| Array index access (`constantAccess`)         | O(1)     | O(1)  |
| Binary search on sorted array (`binarySearch`)| O(log n) | O(1)  |
| Linear scan (`linearSearch`)                  | O(n)     | O(1)  |
| Nested-loop pair counting (`quadraticZeroSumPairCount`) | O(n^2) | O(1) |
| Hash map lookup (amortized)                   | O(1)*    | O(n)  |

\* Amortized O(1) assuming a well-distributed hash and no dictionary-mode
degradation (see lesson 05).

## Walkthrough

`01-big-o-primer.ts` implements one function per complexity class:
`constantAccess` (O(1)), `binarySearch` (O(log n)), `linearSearch` (O(n)),
and `quadraticZeroSumPairCount` (O(n^2)). The `timeIt` helper wraps
`performance.now()` from `perf_hooks` to measure wall-clock time for a
single call.

Three LeetCode problems are each implemented twice — once at the "obvious"
complexity and once optimized — so you can see the same problem move down
a complexity class:

- `twoSumBruteForce` (O(n^2)) vs `twoSumHashMap` (O(n))
- `containsDuplicateBrute` (O(n^2)) vs `containsDuplicateSet` (O(n))
- `maxProfitBrute` (O(n^2)) vs `maxProfitOnePass` (O(n))

The run block asserts that each brute-force/optimized pair produces
identical results, then times `linearSearch` vs `binarySearch` on a
10,000-element array to show the gap in practice.

## LeetCode practice

- 1. Two Sum (Easy) — O(n^2) nested loop vs O(n) hash map
- 217. Contains Duplicate (Easy) — O(n^2) pairwise compare vs O(n) Set
- 121. Best Time to Buy and Sell Stock (Easy) — O(n^2) brute force vs O(n) one-pass

## Key takeaways

- Big-O predicts the *trend* as `n → ∞`, not a specific millisecond count.
- Constant factors (engine warmup, cache locality, hidden classes) can flip
  results at small `n`; they never flip results at large enough `n`.
- The same problem often has a brute-force solution and a data-structure-
  backed solution one complexity class lower — recognizing that pattern is
  most of what "algorithmic thinking" means in interviews.
- O(1) amortized structures like `Map`/`Set` are still O(n) in the worst
  case if the engine falls back to dictionary mode (lesson 05).

Companion code: [`01-big-o-primer.ts`](./01-big-o-primer.ts)
