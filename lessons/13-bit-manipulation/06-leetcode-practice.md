# LeetCode Practice: Bit Manipulation

**Objective:** Consolidate the topic with a graded set of interview problems, from Easy XOR/popcount tricks to Medium add-without-plus and subset enumeration — reusing the functions built in lessons 02–04.

## Concept

Bit-manipulation problems tend to cluster around a handful of ideas, all
introduced earlier in this topic:

```
 136 Single Number   -> XOR cancels pairs        (lesson 02)
 191 Number of 1 Bits -> Kernighan popcount       (lesson 03)
 338 Counting Bits    -> dp[i>>1] + (i&1)          (lesson 03)
 268 Missing Number   -> XOR indices with values  (this file)
 371 Sum of Two Ints  -> XOR sum + carry shift     (this file)
  78 Subsets          -> enumerate 2^n masks       (lesson 04)
```

Two are worth spelling out. **Missing Number** XORs together every index
`0..n` and every array value; identical numbers cancel, leaving only the
absent one:

```
 nums = [3, 0, 1],  n = 3
 acc = 3 ^ (0^3) ^ (1^0) ^ (2^1) = 2   (the missing number)
```

**Sum of Two Integers** adds without `+`. `a ^ b` sums each column ignoring
carries; `(a & b) << 1` is the carry to add next round; repeat until no carry:

```
 a=0011 b=0101
 sum   = 0011 ^ 0101 = 0110   carry = (0011 & 0101)<<1 = 0010
 sum   = 0110 ^ 0010 = 0100   carry = (0110 & 0010)<<1 = 0100
 sum   = 0100 ^ 0100 = 0000   carry = (0100 & 0100)<<1 = 1000
 sum   = 0000 ^ 1000 = 1000   carry = 0  -> answer 8
```

## Complexity

| Problem | Time | Space |
|---------|------|-------|
| 136 Single Number | O(n) | O(1) |
| 191 Number of 1 Bits | O(set bits) | O(1) |
| 338 Counting Bits | O(n) | O(n) |
| 268 Missing Number | O(n) | O(1) |
| 371 Sum of Two Integers | O(1) (≤32 carry rounds) | O(1) |
| 78 Subsets | O(n · 2^n) | O(n · 2^n) |

## Walkthrough

[`06-leetcode-practice.ts`](./06-leetcode-practice.ts) leans on earlier lessons
rather than reimplementing: it re-exports `singleNumber` (136) from lesson 02,
wraps `popcount` as `hammingWeight` (191) and `countBits` as `countingBits` (338)
from lesson 03, and wraps `allSubsets` as `subsets` (78) from lesson 04.

The two new solutions live here. `missingNumber` seeds the accumulator with
`nums.length` (index `n`, which has no array slot) and XORs each `i ^ nums[i]`,
so all matched index/value pairs cancel and the missing number survives.
`getSum` runs the XOR-plus-carry loop until `b` (the carry) is `0`; because JS
truncates every bitwise op to 32 bits, two's-complement wraparound makes negative
sums like `-5 + -7 = -12` work and guarantees the loop terminates.

## LeetCode practice

- **136. Single Number** (Easy) — XOR the array; pairs cancel.
- **191. Number of 1 Bits** (Easy) — Kernighan popcount.
- **338. Counting Bits** (Easy) — `dp[i >> 1] + (i & 1)`.
- **268. Missing Number** (Easy) — XOR every index with every value.
- **371. Sum of Two Integers** (Medium) — XOR sum plus shifted carry, no `+`.
- **78. Subsets** (Medium) — enumerate all `2^n` bitmasks.

## Key takeaways

- Most bit problems reduce to one of: XOR cancellation, popcount, a `dp[i>>1]` recurrence, or `2^n` mask enumeration.
- XOR self-inverse (`x ^ x === 0`) solves both "find the unique value" and "find the missing value".
- Addition decomposes into a carry-free sum (`^`) plus a carry (`(a & b) << 1`) applied repeatedly.
- JS's 32-bit bitwise truncation is what makes `getSum` handle negatives and terminate.
- Composing earlier lessons keeps solutions short — the practice set is mostly one-liners over lessons 02–04.

Companion code: [`06-leetcode-practice.ts`](./06-leetcode-practice.ts)
