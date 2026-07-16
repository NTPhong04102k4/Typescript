# Counting Bits

**Objective:** Count the set bits in an integer (population count / Hamming weight) efficiently with Brian Kernighan's trick, compute the counts for a whole range `0..n` with dynamic programming, and derive the Hamming distance between two numbers.

## Concept

The **population count** (or *Hamming weight*) of a number is how many of its
bits are 1. The naive way scans all 32 positions. **Brian Kernighan's trick**
does better: `n & (n - 1)` clears the lowest set bit, so the loop runs exactly
once per *set* bit rather than once per position:

```
 n = 10110  (three 1s)
 step 1: 10110 & 10101 = 10100   count = 1
 step 2: 10100 & 10011 = 10000   count = 2
 step 3: 10000 & 01111 = 00000   count = 3  -> done
```

**Counting bits for a range** `0..n` uses dynamic programming. Dropping the last
bit of `i` (`i >> 1`) gives a smaller number whose count we already know; adding
back the bit we dropped (`i & 1`) completes it:

```
 dp[i] = dp[i >> 1] + (i & 1)

 i : 0  1  2  3  4  5
 dp: 0  1  1  2  1  2
        |     |     |
      dp[0]+1 dp[1]+1  dp[2]+0 ...
```

**Hamming distance** between `a` and `b` is the popcount of `a ^ b`: XOR marks
every position where they differ, and we simply count those 1s.

## Complexity

| Operation | Time | Space |
|-----------|------|-------|
| `popcount` (Kernighan, k set bits) | O(k) | O(1) |
| `popcountNaive` (fixed width) | O(32) | O(1) |
| `countBits` (range 0..n) | O(n) | O(n) |
| `hammingDistance` | O(k) | O(1) |

## Walkthrough

[`03-count-bits.ts`](./03-count-bits.ts) opens with `popcount`, which masks
`n >>> 0` to treat the input as unsigned (so `popcount(-1)` is `32`, not a
sign-confused loop), then repeatedly runs `bits &= bits - 1` until zero,
incrementing once per set bit. `popcountNaive` is the O(32) contrast: it sums
`(bits >> i) & 1` across all positions, useful to see *why* Kernighan's version
is a win on sparse inputs.

`countBits` fills a `dp` array of length `n + 1` with the recurrence
`dp[i] = dp[i >> 1] + (i & 1)`, so every entry is O(1) and the whole range is
O(n). `hammingDistance` composes cleanly on top of `popcount`: it just returns
`popcount(a ^ b)`.

## LeetCode practice

- **191. Number of 1 Bits** (Easy) — `popcount` directly.
- **338. Counting Bits** (Easy) — the `dp[i >> 1] + (i & 1)` recurrence.
- **461. Hamming Distance** (Easy) — `popcount(a ^ b)`.

## Key takeaways

- `n & (n - 1)` clears the lowest set bit, so Kernighan's loop runs once per set bit — great when few bits are set.
- Mask with `n >>> 0` before counting so negative inputs are read as unsigned 32-bit values.
- `dp[i] = dp[i >> 1] + (i & 1)` computes popcounts for the whole range `0..n` in O(n) by reusing the answer for `i` with its last bit removed.
- Hamming distance is just the popcount of the XOR.

Companion code: [`03-count-bits.ts`](./03-count-bits.ts)
