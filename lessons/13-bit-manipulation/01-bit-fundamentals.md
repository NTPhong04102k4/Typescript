# Bit Fundamentals

**Objective:** Read integers as sequences of binary digits, apply the core bitwise operators (AND, OR, XOR, NOT, shifts), understand how two's complement represents negative numbers, and navigate JavaScript's 32-bit bitwise quirks — especially `>>>` vs `>>`.

## Concept

Every integer is a string of bits. The value `5` in 8 bits is:

```
 bit index:  7  6  5  4  3  2  1  0
 value:      0  0  0  0  0  1  0  1   = 4 + 1 = 5
```

The bitwise operators combine two numbers bit-by-bit:

```
   1100  (12)          1100          1100          ~1100
 & 1010  (10)        | 1010        ^ 1010        = ...0011  (flip every bit)
 ------              ------        ------
   1000  (8)           1110          0110
   AND                 OR            XOR
```

- **AND (`&`)** keeps a 1 only where *both* bits are 1.
- **OR (`|`)** keeps a 1 where *either* bit is 1.
- **XOR (`^`)** keeps a 1 where the bits *differ* — and `x ^ x === 0`, `x ^ 0 === x`, which makes XOR the workhorse of later lessons.
- **NOT (`~`)** flips every bit.

**Shifts** move bits left or right. `x << k` multiplies by `2^k`; `x >> k` divides by `2^k`.

**Two's complement.** JavaScript's bitwise operators treat numbers as 32-bit *signed* integers. The top bit (bit 31) is the sign bit. Negative numbers are stored as the complement plus one, which is why `~x === -(x + 1)`:

```
 5   = 00000000 00000000 00000000 00000101
 ~5  = 11111111 11111111 11111111 11111010  = -6
```

**The `>>>` vs `>>` quirk.** Arithmetic shift `>>` copies the sign bit down (so `-1 >> 28` stays negative), while the logical shift `>>>` fills the vacated high bits with `0` and always yields an unsigned result:

```
 -1 as 32-bit:  11111111 ... 11111111
 -1 >> 28   ->  11111111 ... 11111111  = -1   (sign extended)
 -1 >>> 28  ->  00000000 ... 00001111  = 15   (zero filled)
```

The idiom `x >>> 0` reinterprets any value as an unsigned 32-bit integer (`0 .. 4294967295`), which is essential when you want `toString(2)` to print a negative number's actual bit pattern.

## Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Any single bitwise op (`&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`) | O(1) | O(1) |
| `toBinary` (width w) | O(w) | O(w) |
| `fromBinary` (length L) | O(L) | O(1) |

## Walkthrough

[`01-bit-fundamentals.ts`](./01-bit-fundamentals.ts) wraps each operator in a
named function so the behavior is testable. `toBinary` runs `value >>> 0` before
`toString(2)` so negatives render as their 32-bit two's complement pattern, then
pads and slices to a fixed `width`. `bitNot` demonstrates the `~x === -(x + 1)`
identity directly in its assertions (`~0 === -1`, `~5 === -6`).

The shift functions make the `>>` / `>>>` distinction concrete: `shiftRight(-1, 28)`
stays `-1` because the sign bit is copied down, while `shiftRightUnsigned(-1, 28)`
is `15` because the high bits are zero-filled. `toUnsigned32` is just `value >>> 0`,
turning `-1` into `4294967295`. The exercises reinforce this by reading the sign
bit with `(value >>> 31) & 1` instead of comparing against `< 0`.

## LeetCode practice

- **190. Reverse Bits** (Easy) — build the result by shifting bits out of the input and into the answer; a natural follow-up once `>>>` feels comfortable.
- **461. Hamming Distance** (Easy) — count differing bits via XOR (developed fully in lesson 03).

## Key takeaways

- JavaScript bitwise operators work on 32-bit **signed** integers, no matter how large the number looks.
- Two's complement means `~x === -(x + 1)`; the sign lives in bit 31.
- `>>` sign-extends (keeps negatives negative); `>>>` zero-fills and returns an unsigned result.
- Use `x >>> 0` whenever you need the true unsigned bit pattern (e.g. before `toString(2)`).
- XOR's `x ^ x === 0` / `x ^ 0 === x` identities power most of the tricks in later lessons.

Companion code: [`01-bit-fundamentals.ts`](./01-bit-fundamentals.ts)
