// Companion code for ./03-pruning-backtracking.md
//
// Backtracking explores a tree of partial solutions. Pruning (branch and
// bound) is the optimization: cut a branch the moment it cannot lead to a
// valid solution, instead of walking it to the bottom and rejecting the leaf.
// N-Queens makes the payoff dramatic — column and diagonal bitmasks let us
// reject a placement in O(1), shrinking the explored tree by orders of
// magnitude versus a solver that only checks validity at complete boards.

/** solutions: number of valid boards found; nodes: recursive calls made (search-tree size). */
export interface SearchResult {
  readonly solutions: number;
  readonly nodes: number;
}

/**
 * Naive N-Queens: place one queen per row trying EVERY column, with no
 * pruning during the descent — validity (columns + both diagonals) is only
 * checked once a board is complete. This explores the full n^n placement
 * tree; it exists purely as the baseline the pruned solver beats.
 */
export function nQueensNaive(n: number): SearchResult {
  let solutions = 0;
  let nodes = 0;
  const placement: number[] = []; // placement[row] = chosen column

  function isCompleteBoardValid(): boolean {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (placement[i] === placement[j]) return false; // same column
        if (Math.abs(placement[i] - placement[j]) === j - i) return false; // same diagonal
      }
    }
    return true;
  }

  function place(row: number): void {
    nodes++;
    if (row === n) {
      if (isCompleteBoardValid()) solutions++;
      return;
    }
    for (let c = 0; c < n; c++) {
      placement.push(c);
      place(row + 1);
      placement.pop();
    }
  }

  place(0);
  return { solutions, nodes };
}

/**
 * Pruned N-Queens using three bitmasks — occupied columns, "\" diagonals,
 * and "/" diagonals — so the set of legal columns for the next row is a
 * single bitwise expression and each conflict is rejected in O(1) before we
 * ever recurse into it. `available & -available` isolates the lowest legal
 * column bit; shifting the diagonal masks by one as we descend a row keeps
 * them aligned. Explores dramatically fewer nodes than nQueensNaive.
 */
export function nQueensPruned(n: number): SearchResult {
  let solutions = 0;
  let nodes = 0;
  const full = (1 << n) - 1; // n low bits set: all columns

  function place(row: number, cols: number, diag: number, anti: number): void {
    nodes++;
    if (row === n) {
      solutions++;
      return;
    }
    // Columns not attacked by any existing queen's column or diagonal:
    let available = full & ~(cols | diag | anti);
    while (available !== 0) {
      const bit = available & -available; // lowest set bit
      available ^= bit; // consume it
      place(
        row + 1,
        cols | bit,
        ((diag | bit) << 1) & full, // "\" diagonals shift left as rows advance
        (anti | bit) >> 1 // "/" diagonals shift right
      );
    }
  }

  place(0, 0, 0, 0);
  return { solutions, nodes };
}

/** Just the number of valid N-Queens boards, via the pruned search. */
export function countNQueensSolutions(n: number): number {
  return nQueensPruned(n).solutions;
}

// Exercise: early termination — return the FIRST valid placement (column per
// row) and stop the search immediately, or null if none exists. Reuse the
// same bitmask pruning, but bail out as soon as one solution is complete.
export function firstNQueensSolutionStub(_n: number): number[] | null {
  throw new Error('not implemented');
}
// Solution:
export function firstNQueensSolution(n: number): number[] | null {
  const full = (1 << n) - 1;
  const placement: number[] = [];

  function place(row: number, cols: number, diag: number, anti: number): boolean {
    if (row === n) return true; // complete: stop unwinding, keep placement
    let available = full & ~(cols | diag | anti);
    while (available !== 0) {
      const bit = available & -available;
      available ^= bit;
      const col = Math.log2(bit); // index of the single set bit
      placement[row] = col;
      if (place(row + 1, cols | bit, ((diag | bit) << 1) & full, (anti | bit) >> 1)) {
        return true; // early termination: propagate success up, explore no more branches
      }
    }
    return false;
  }

  return place(0, 0, 0, 0) ? placement.slice() : null;
}

// Exercise: LeetCode 51. N-Queens — return every distinct board as a list of
// strings, using '.' for empty and 'Q' for a queen. Use bitmask pruning.
export function solveNQueensStub(_n: number): string[][] {
  throw new Error('not implemented');
}
// Solution:
export function solveNQueens(n: number): string[][] {
  const full = (1 << n) - 1;
  const boards: string[][] = [];
  const placement: number[] = []; // placement[row] = column index

  function render(): string[] {
    return placement.map((col) => '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1));
  }

  function place(row: number, cols: number, diag: number, anti: number): void {
    if (row === n) {
      boards.push(render());
      return;
    }
    let available = full & ~(cols | diag | anti);
    while (available !== 0) {
      const bit = available & -available;
      available ^= bit;
      placement[row] = Math.log2(bit);
      place(row + 1, cols | bit, ((diag | bit) << 1) & full, (anti | bit) >> 1);
    }
  }

  place(0, 0, 0, 0);
  return boards;
}

// --- run ---
if (require.main === module) {
  // Known N-Queens solution counts (OEIS A000170).
  const expected: Record<number, number> = { 1: 1, 2: 0, 3: 0, 4: 2, 5: 10, 6: 4, 7: 40, 8: 92 };

  for (const key of Object.keys(expected)) {
    const n = Number(key);
    console.assert(
      nQueensPruned(n).solutions === expected[n],
      `pruned N-Queens(${n}) should have ${expected[n]} solutions`
    );
  }

  // Naive and pruned must agree on solution counts (only the tree size differs).
  for (let n = 1; n <= 6; n++) {
    console.assert(
      nQueensNaive(n).solutions === nQueensPruned(n).solutions,
      `naive and pruned agree on N-Queens(${n}) solution count`
    );
  }

  // Pruning must strictly shrink the explored search tree.
  const naive6 = nQueensNaive(6);
  const pruned6 = nQueensPruned(6);
  console.assert(pruned6.nodes < naive6.nodes, 'pruned search explores fewer nodes than naive');

  // Early termination returns a single valid placement.
  const first = firstNQueensSolution(8);
  console.assert(first !== null && first.length === 8, 'first 8-queens solution has 8 rows');
  console.assert(firstNQueensSolution(3) === null, 'no solution exists for 3-queens');

  // solveNQueens (LeetCode 51) returns the right number and shape of boards.
  const boards4 = solveNQueens(4);
  console.assert(boards4.length === 2, '4-queens has 2 distinct boards');
  console.assert(
    boards4.every((b) => b.length === 4 && b.every((r) => r.length === 4)),
    'each 4-queens board is a 4x4 grid of strings'
  );
  console.assert(
    boards4.every((b) => b.join('').split('').filter((ch) => ch === 'Q').length === 4),
    'each board places exactly 4 queens'
  );

  // Node-count comparison (pruned vs naive) for a few board sizes.
  for (const n of [4, 5, 6]) {
    const naive = nQueensNaive(n);
    const pruned = nQueensPruned(n);
    const factor = (naive.nodes / pruned.nodes).toFixed(1);
    console.log(
      `N=${n}: naive explored ${naive.nodes} nodes, pruned explored ${pruned.nodes} ` +
        `(${factor}x fewer) — both found ${pruned.solutions} solutions`
    );
  }

  console.log('03-pruning-backtracking: all assertions passed');
}
