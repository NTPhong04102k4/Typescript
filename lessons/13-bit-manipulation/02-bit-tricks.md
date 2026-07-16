# Bit Tricks

**Objective:** Master the everyday single-bit operations (get, set, clear, toggle) and the classic constant-time idioms: `isPowerOfTwo`, isolating the lowest set bit with `x & -x`, clearing it with `x & (x - 1)`, swapping without a temporary, and finding a unique element with XOR.

## Concept

A **mask** `1 << i` is a number with a single 1 in position `i`. Combining it
with a value manipulates exactly that bit:

```
 value = 1010, i = 0

 get:    (value >> i) & 1   -> 0        read bit 0
 set:    value | (1 << i)   -> 1011     force bit 0 to 1
 clear:  value & ~(1 << i)  -> 1010     force bit 0 to 0
 toggle: value ^ (1 << i)   -> 1011     flip bit 0
```

**Power of two.** A power of two has exactly one set bit, so subtracting 1 flips
that bit and every lower zero, making `n & (n - 1) === 0`:

```
 8    = 1000
 8-1  = 0111
 &    = 0000   -> power of two
```

**Lowest set bit.** In two's complement, `-x` is `~x + 1`, which flips everything
above the lowest set bit but leaves that bit alone, so `x & -x` isolates it.
Conversely `x & (x - 1)` *clears* the lowest set bit — the engine behind
Kernighan's popcount in lesson 03:

```
 x        = 10110
 x & -x   = 00010   (isolate lowest set bit)
 x & (x-1)= 10100   (clear lowest set bit)
```

**XOR swap** exploits `a ^ a === 0` to exchange two values with no temporary,
and **XOR reduction** (`x ^ x === 0`) makes every paired element in an array
cancel, leaving only the unpaired one.

## Complexity

| Operation | Time | Space |
|-----------|------|-------|
| `getBit` / `setBit` / `clearBit` / `toggleBit` | O(1) | O(1) |
| `isPowerOfTwo` | O(1) | O(1) |
| `lowestSetBit` / `clearLowestSetBit` | O(1) | O(1) |
| `xorSwap` | O(1) | O(1) |
| `singleNumber` (n elements) | O(n) | O(1) |
| `bitDifference` (k differing bits) | O(k) | O(1) |

## Walkthrough

[`02-bit-tricks.ts`](./02-bit-tricks.ts) builds each idiom on the `1 << i` mask.
`getBit` shifts the target bit down to position 0 and masks it; `setBit`, `clearBit`,
and `toggleBit` OR / AND-NOT / XOR the mask in. `isPowerOfTwo` guards `n > 0` first
(so `0` is correctly rejected) then checks `(n & (n - 1)) === 0`.

`lowestSetBit` returns `x & -x` and `clearLowestSetBit` returns `x & (x - 1)` —
the two halves of the same idea. `xorSwap` runs the three-XOR dance and returns
the pair. `singleNumber` folds the array with `^`, so duplicates cancel and the
lone value remains. `bitDifference` XORs the two inputs and then repeatedly calls
`clearLowestSetBit`, counting once per differing bit — a preview of the popcount
loop in lesson 03.

## LeetCode practice

- **136. Single Number** (Easy) — XOR the whole array; pairs cancel.
- **231. Power of Two** (Easy) — the `n > 0 && (n & (n - 1)) === 0` check.
- **461. Hamming Distance** (Easy) — count set bits of `a ^ b`.

## Key takeaways

- The single-bit toolkit is one mask `1 << i` combined with `&`, `|`, `& ~`, or `^`.
- `n & (n - 1) === 0` (with `n > 0`) is the canonical power-of-two test.
- `x & -x` isolates the lowest set bit; `x & (x - 1)` clears it — memorize both.
- XOR cancels duplicates (`x ^ x === 0`), which solves "find the unique element" in O(n) time and O(1) space.

Companion code: [`02-bit-tricks.ts`](./02-bit-tricks.ts)
