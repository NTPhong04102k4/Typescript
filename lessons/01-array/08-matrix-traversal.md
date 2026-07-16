# 2D Array / Matrix Traversal Patterns

**Objective:** Model a matrix as a flat, row-major array and learn the standard traversal patterns (spiral, rotate, boundary marking) built on top of it.

## Concept

A 2D array in most engines (including how you should reason about it) is
actually a flat, contiguous 1D array addressed with row-major arithmetic:

```
flatIndex(row, col) = row * numCols + col

matrix (3x4):                flat layout (row-major):
[ 0  1  2  3 ]
[ 4  5  6  7 ]                index:  0  1  2  3  4  5  6  7  8  9 10 11
[ 8  9 10 11 ]                value:  0  1  2  3  4  5  6  7  8  9 10 11

flatIndex(1, 2) = 1*4 + 2 = 6  -> value 6 ✓
```

Spiral traversal shrinks four shifting boundaries (`top`, `bottom`,
`left`, `right`) inward one ring at a time:

```
[ 1  2  3 ]        visit order: 1 2 3 6 9 8 7 4 5
[ 4  5  6 ]        top row -> right col -> bottom row -> left col
[ 7  8  9 ]        then shrink all four boundaries and repeat
```

## Complexity

| Operation                          | Time     | Space |
|--------------------------------------|----------|-------|
| `flattenIndex` (address arithmetic)    | O(1)     | O(1)  |
| `spiralOrder` (visit every cell once)  | O(rows * cols) | O(rows * cols) output |
| `rotateImage` (in-place transpose+flip)| O(n^2)   | O(1)  |
| `setMatrixZeroes` (marker-based)       | O(rows * cols) | O(1)  |

## Walkthrough

`08-matrix-traversal.ts` builds the row-major mental model, then applies
it:

- `flattenIndex` is the row-major arithmetic from the diagram — the same
  address computation lesson 1 did for 1D arrays, extended to 2D.
- `spiralOrder` solves LeetCode 54 by shrinking `top`/`bottom`/`left`/
  `right` boundaries inward, visiting the top row, right column, bottom
  row, then left column of each shrinking ring.
- `rotateImage` (exercise) solves LeetCode 48 in place: transpose the
  matrix (swap `matrix[row][col]` with `matrix[col][row]`), then reverse
  each row — the composition of those two O(n^2) passes is a 90-degree
  clockwise rotation with O(1) extra space.
- `setMatrixZeroes` (exercise) solves LeetCode 73 without an auxiliary
  grid: it uses the matrix's own first row and first column as marker
  space, tracking separately whether the first row/column themselves
  originally contained a zero.

## LeetCode practice

- 54. Spiral Matrix (Medium)
- 48. Rotate Image (Medium)
- 73. Set Matrix Zeroes (Medium)
- 74. Search a 2D Matrix (Medium)

## Key takeaways

- A matrix is conceptually a flat array with row-major address
  arithmetic — `row * numCols + col`.
- Spiral/boundary traversal patterns work by shrinking four edges inward
  instead of tracking visited cells.
- In-place matrix transforms (rotate) often decompose into two simpler
  O(1)-space passes (transpose + reverse).
- Reusing part of the input (first row/column) as marker space is a
  standard way to hit O(1) extra space on matrix problems.

Companion code: [`08-matrix-traversal.ts`](./08-matrix-traversal.ts)
