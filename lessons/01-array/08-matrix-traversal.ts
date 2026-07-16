// Companion code for ./08-matrix-traversal.md

/** Row-major address arithmetic: where (row, col) lives in a flat buffer. */
export function flattenIndex(row: number, col: number, numCols: number): number {
  return row * numCols + col;
}

// LeetCode 54: Spiral Matrix.
// Shrink four boundaries inward, visiting top row, right col, bottom row,
// left col of each ring in turn.
export function spiralOrder(matrix: readonly (readonly number[])[]): number[] {
  const result: number[] = [];
  if (matrix.length === 0 || matrix[0].length === 0) return result;

  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col++) result.push(matrix[top][col]);
    top++;

    for (let row = top; row <= bottom; row++) result.push(matrix[row][right]);
    right--;

    if (top <= bottom) {
      for (let col = right; col >= left; col--) result.push(matrix[bottom][col]);
      bottom--;
    }

    if (left <= right) {
      for (let row = bottom; row >= top; row--) result.push(matrix[row][left]);
      left++;
    }
  }

  return result;
}

// Exercise: implement LeetCode 48, Rotate Image -- rotate an n x n matrix
// 90 degrees clockwise in place.
// Solution:
export function rotateImage(matrix: number[][]): void {
  const n = matrix.length;

  // Transpose: swap across the main diagonal.
  for (let row = 0; row < n; row++) {
    for (let col = row + 1; col < n; col++) {
      const tmp = matrix[row][col];
      matrix[row][col] = matrix[col][row];
      matrix[col][row] = tmp;
    }
  }

  // Reverse each row to complete the 90-degree clockwise rotation.
  for (let row = 0; row < n; row++) {
    matrix[row].reverse();
  }
}

// Exercise: implement LeetCode 73, Set Matrix Zeroes -- if an element is
// 0, set its entire row and column to 0, using O(1) extra space by
// reusing the first row/column as marker storage.
// Solution:
export function setMatrixZeroes(matrix: number[][]): void {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  let firstRowHasZero = false;
  let firstColHasZero = false;

  for (let col = 0; col < numCols; col++) {
    if (matrix[0][col] === 0) firstRowHasZero = true;
  }
  for (let row = 0; row < numRows; row++) {
    if (matrix[row][0] === 0) firstColHasZero = true;
  }

  for (let row = 1; row < numRows; row++) {
    for (let col = 1; col < numCols; col++) {
      if (matrix[row][col] === 0) {
        matrix[row][0] = 0;
        matrix[0][col] = 0;
      }
    }
  }

  for (let row = 1; row < numRows; row++) {
    for (let col = 1; col < numCols; col++) {
      if (matrix[row][0] === 0 || matrix[0][col] === 0) {
        matrix[row][col] = 0;
      }
    }
  }

  if (firstRowHasZero) {
    for (let col = 0; col < numCols; col++) matrix[0][col] = 0;
  }
  if (firstColHasZero) {
    for (let row = 0; row < numRows; row++) matrix[row][0] = 0;
  }
}

// --- run ---
if (require.main === module) {
  console.assert(flattenIndex(1, 2, 4) === 6, 'row-major index of (1,2) with 4 columns should be 6');

  const spiral = spiralOrder([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
  console.assert(
    JSON.stringify(spiral) === JSON.stringify([1, 2, 3, 6, 9, 8, 7, 4, 5]),
    'spiralOrder should visit the 3x3 matrix in the classic spiral order'
  );

  const image = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  rotateImage(image);
  console.assert(
    JSON.stringify(image) === JSON.stringify([[7, 4, 1], [8, 5, 2], [9, 6, 3]]),
    'rotateImage should rotate the matrix 90 degrees clockwise'
  );

  const grid = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ];
  setMatrixZeroes(grid);
  console.assert(
    JSON.stringify(grid) === JSON.stringify([[1, 0, 1], [0, 0, 0], [1, 0, 1]]),
    'setMatrixZeroes should zero out the row and column of the original zero'
  );

  console.log('All lesson 08 checks passed.');
}
