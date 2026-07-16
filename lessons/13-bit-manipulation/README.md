# 13 · Bit Manipulation

Bit manipulation treats integers as fixed-width strings of bits and solves
problems with the raw hardware operators — AND, OR, XOR, NOT, and shifts —
instead of arithmetic and collections. This topic starts from binary
representation and JavaScript's 32-bit signed quirks (lesson 01), builds up the
everyday tricks (get/set/clear/toggle, power-of-two, lowest set bit, XOR), then
scales those ideas into whole techniques: population counting, representing sets
as integers, enumerating subsets, and bitmask dynamic programming. Work through
the lessons in order — later files import functions (`singleNumber`, `popcount`,
`countBits`, `allSubsets`) directly from earlier ones instead of redefining them.
A note that recurs throughout: JS bitwise operators act on 32-bit signed
integers, so reach for `>>> 0` whenever you need an unsigned value.

Lessons:
- 01 — Bit fundamentals (binary, AND/OR/XOR/NOT/shifts, two's complement, `>>>` vs `>>`)
- 02 — Bit tricks (get/set/clear/toggle, isPowerOfTwo, `x & -x`, `x & (x-1)`, XOR swap & unique)
- 03 — Counting bits (Kernighan popcount, DP over `0..n`, Hamming distance)
- 04 — Bitmask subsets (enumerate `2^n` subsets, iterate submasks, sets as integers)
- 05 — Bitmask dynamic programming (Held-Karp TSP, counting with a visited-set mask)
- 06 — LeetCode practice set: Bit Manipulation
