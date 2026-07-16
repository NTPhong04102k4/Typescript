# In-Place Array Tricks (Rotate, Dedupe, Cyclic Sort)

**Objective:** Rearrange an array's contents using only O(1) extra space by exploiting reversal, read/write pointers, and index-as-destination tricks.

## Concept

**Rotate via three reversals** — rotating right by `k` is the same as
reversing the whole array, then reversing each of the two resulting
pieces:

```
nums:  [ 1 2 3 4 5 6 7 ]   k = 3

1. reverse all:            [ 7 6 5 4 3 2 1 ]
2. reverse first k:        [ 5 6 7 4 3 2 1 ]
3. reverse the rest:       [ 5 6 7 1 2 3 4 ]   <- rotated right by 3
```

**Cyclic sort** — when values are known to be in range `[1, n]`, each
value has a "home" index (`value - 1`). Swap every value toward its home
until every slot holds its own value, then scan once for the first slot
that doesn't match:

```
nums:  [ 3 4 -1 1 ]           n = 4, valid range [1, 4]

nums[0]=3 belongs at index 2 -> swap:  [ -1 4 3 1 ]
nums[0]=-1 out of range, skip
nums[1]=4 belongs at index 3 -> swap:  [ -1 1 3 4 ]
nums[1]=1 belongs at index 0 -> swap:  [ 1 -1 3 4 ]
nums[1]=-1 out of range, skip
nums[2]=3 already home, nums[3]=4 already home

scan: index 1 holds -1, not 2  ->  first missing positive is 2
```

## Complexity

| Operation                            | Time | Space |
|------------------------------------------|------|-------|
| `rotateArray` (three reversals)            | O(n) | O(1)  |
| `removeDuplicatesSorted` (read/write ptrs) | O(n) | O(1)  |
| `firstMissingPositive` (cyclic sort)       | O(n) | O(1)  |

## Walkthrough

`10-in-place-tricks.ts` implements all three tricks:

- `reverseRange` is a small shared helper that reverses `nums[left..right]`
  in place — the primitive used three times by `rotateArray`.
- `rotateArray` solves LeetCode 189 by reversing the whole array, then the
  first `k` elements, then the rest, exactly as diagrammed above.
- `removeDuplicatesSorted` (exercise) solves LeetCode 26 with a
  read/write pointer pair: `writeIndex` only advances when the current
  value differs from the last value written, compacting duplicates out in
  a single pass.
- `firstMissingPositive` (exercise) solves LeetCode 41 with cyclic sort:
  it repeatedly swaps each in-range value to its home index (`value - 1`)
  until no more swaps help, then the first index `i` where `nums[i] !== i
  + 1` reveals the answer.

## LeetCode practice

- 189. Rotate Array (Medium)
- 26. Remove Duplicates from Sorted Array (Easy)
- 41. First Missing Positive (Hard)
- 283. Move Zeroes (Easy)

## Key takeaways

- Rotating an array in place decomposes into three simpler O(1)-space
  reversals.
- Read/write (slow/fast) pointers compact an array in place without a
  second buffer, as long as you only need to keep elements in their
  original relative order.
- Cyclic sort turns "where should this value go" into an O(n) in-place
  placement whenever values are known to fall in a bounded range like
  `[1, n]`.
- All three tricks avoid extra memory by treating the array itself as the
  scratch space.

Companion code: [`10-in-place-tricks.ts`](./10-in-place-tricks.ts)
