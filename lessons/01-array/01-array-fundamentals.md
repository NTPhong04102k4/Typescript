# Array Fundamentals & Contiguous Memory Model

**Objective:** Understand why arrays give O(1) random access by modeling how elements are laid out in contiguous memory.

## Concept

An array is a single, contiguous block of memory. Every element has the
same size, so the engine can compute the memory address of any index with
pure arithmetic — no traversal required:

```
address(i) = baseAddress + i * elementSize
```

This is what makes `arr[i]` O(1): it is a multiplication and an addition,
not a walk through the structure.

```
baseAddress = 1000, elementSize = 8 bytes

index:     0      1      2      3      4
         +------+------+------+------+------+
values:  |  10  |  20  |  30  |  40  |  50  |
         +------+------+------+------+------+
address: 1000   1008   1016   1024   1032

address(3) = 1000 + 3 * 8 = 1024  ->  arr[3] === 40
```

Contrast this with structures that are *not* contiguous (linked lists,
trees): to reach element `i` you must follow `i` pointers one at a time,
which is O(n). Contiguity is the entire reason arrays are fast for
indexing and slow for insertion in the middle (shifting is required to
keep the block contiguous — covered in the next lesson).

## Complexity

| Operation                          | Time | Space |
|-------------------------------------|------|-------|
| Access by index (`arr[i]`)          | O(1) | O(1)  |
| Compute address of index            | O(1) | O(1)  |
| Linear search (`linearSearch`)      | O(n) | O(1)  |
| Build full memory layout (`length` cells) | O(n) | O(n)  |

## Walkthrough

`01-array-fundamentals.ts` simulates the memory model directly:

- `getElementAddress(baseAddress, elementSize, index)` performs the exact
  arithmetic from the diagram above.
- `simulateMemoryLayout(baseAddress, elementSize, length)` builds an array
  of `{ index, address }` cells so you can see every computed address at
  once.
- `randomAccess(arr, index)` demonstrates O(1) indexed access, throwing a
  `RangeError` for out-of-bounds/non-integer indices (bounds checking is
  still O(1), it's just a comparison).
- `linearSearch(arr, target)` demonstrates the O(n) alternative you need
  when you don't know the index — this is the baseline every later
  technique (two pointers, binary search, hashing) tries to beat.
- `isValidIndex` and `addressesForSlice` are the exercise solutions and
  reuse the address arithmetic above.
- `twoSum` implements LeetCode 1 with a single-pass hash map, showing how
  array traversal combines with auxiliary structures to cut linear search
  down to O(n) total instead of O(n^2).

## LeetCode practice

- 1. Two Sum (Easy)
- 217. Contains Duplicate (Easy)
- 448. Find All Numbers Disappeared in an Array (Easy)

## Key takeaways

- Arrays are contiguous memory; index access is arithmetic, not traversal.
- `address(i) = base + i * elementSize` is why `arr[i]` is O(1).
- Linear search is O(n) precisely because there's no shortcut without extra
  information — later lessons (sorted order, hashing) exist to avoid it.
- Bounds checking is a cheap O(1) comparison, not the source of any
  algorithmic complexity.

Companion code: [`01-array-fundamentals.ts`](./01-array-fundamentals.ts)
