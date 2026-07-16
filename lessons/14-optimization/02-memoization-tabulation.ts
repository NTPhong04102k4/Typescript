// Companion code for ./02-memoization-tabulation.md
//
// Two ways to reuse overlapping subproblems, turning exponential recursion
// into polynomial-time DP:
//   - Memoization (top-down): keep the recursion, cache each result.
//   - Tabulation (bottom-up): fill a table iteratively from base cases up.
// Both compute the same values; they differ in direction and in how easily
// the table can be space-optimized.

/**
 * Naive Fibonacci: recomputes the same subproblems exponentially.
 * fib(n) makes ~2^n calls — included only as the baseline to beat.
 * O(2^n) time, O(n) stack space.
 */
export function fibNaive(n: number): number {
  if (n < 2) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

/**
 * Top-down memoized Fibonacci: same recursion, but each fib(k) is computed
 * once and cached, so every later call is an O(1) hit. O(n) time, O(n) space.
 */
export function fibMemo(n: number, memo: Map<number, number> = new Map()): number {
  if (n < 2) return n;
  const cached = memo.get(n);
  if (cached !== undefined) return cached;
  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

/**
 * Bottom-up tabulated Fibonacci: fill dp[0..n] iteratively from the base
 * cases. No recursion, no stack. O(n) time, O(n) space.
 */
export function fibTab(n: number): number {
  if (n < 2) return n;
  const dp = new Array<number>(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

/**
 * Space-optimized Fibonacci: each dp[i] only needs the previous two values,
 * so the whole O(n) table collapses to two rolling variables. O(n) time,
 * O(1) space — the standard "shrink the DP table to its live window" move.
 */
export function fibRolling(n: number): number {
  if (n < 2) return n;
  let prev = 0;
  let curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}

/**
 * Grid unique paths (LeetCode 62): number of paths from the top-left to the
 * bottom-right of an rows x cols grid, moving only right or down. Full
 * bottom-up table: dp[r][c] = dp[r-1][c] + dp[r][c-1], with the first row and
 * column all 1 (only one way to reach an edge cell). O(rows*cols) time and space.
 */
export function uniquePathsTable(rows: number, cols: number): number {
  const dp: number[][] = Array.from({ length: rows }, () => new Array<number>(cols).fill(1));
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
    }
  }
  return dp[rows - 1][cols - 1];
}

/**
 * Space-optimized unique paths: a full row only ever reads the row above it
 * plus the cell to its left, so one array of width `cols` is enough. The
 * O(rows*cols) table drops to O(cols) space — the general "keep only the
 * previous row/column" DP optimization.
 */
export function uniquePathsRolling(rows: number, cols: number): number {
  const row = new Array<number>(cols).fill(1);
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      // row[c] still holds the value from the row above; row[c-1] is this row.
      row[c] = row[c] + row[c - 1];
    }
  }
  return row[cols - 1];
}

// Exercise: LeetCode 70. Climbing Stairs — number of ways to climb n stairs
// taking 1 or 2 steps at a time. (Same recurrence as Fibonacci; do it with
// O(1) rolling space.)
export function climbStairsStub(_n: number): number {
  throw new Error('not implemented');
}
// Solution:
export function climbStairs(n: number): number {
  if (n <= 2) return n;
  let prev = 1; // ways to reach step 1
  let curr = 2; // ways to reach step 2
  for (let i = 3; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}

// Exercise: LeetCode 198. House Robber — max sum of non-adjacent values.
// Do it bottom-up with O(1) space (each step chooses skip-this vs take-this).
export function robStub(_nums: readonly number[]): number {
  throw new Error('not implemented');
}
// Solution:
export function rob(nums: readonly number[]): number {
  let skip = 0; // best total not robbing the previous house
  let take = 0; // best total robbing (i.e. considering) up to the previous house
  for (const value of nums) {
    const next = Math.max(take, skip + value);
    skip = take;
    take = next;
  }
  return take;
}

// --- run ---
if (require.main === module) {
  // All four Fibonacci variants must agree on values.
  const expectedFib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
  for (let n = 0; n < expectedFib.length; n++) {
    console.assert(fibNaive(n) === expectedFib[n], `fibNaive(${n}) = ${expectedFib[n]}`);
    console.assert(fibMemo(n) === expectedFib[n], `fibMemo(${n}) = ${expectedFib[n]}`);
    console.assert(fibTab(n) === expectedFib[n], `fibTab(${n}) = ${expectedFib[n]}`);
    console.assert(fibRolling(n) === expectedFib[n], `fibRolling(${n}) = ${expectedFib[n]}`);
  }
  // The optimized variants stay correct far past where fibNaive is usable.
  console.assert(fibRolling(50) === 12586269025, 'fibRolling(50) = 12586269025');

  // Grid paths: full table and rolling row must agree.
  console.assert(uniquePathsTable(3, 7) === 28, 'unique paths in 3x7 grid = 28');
  console.assert(uniquePathsRolling(3, 7) === 28, 'rolling unique paths in 3x7 grid = 28');
  console.assert(uniquePathsTable(3, 3) === 6, 'unique paths in 3x3 grid = 6');
  console.assert(uniquePathsRolling(3, 3) === 6, 'rolling unique paths in 3x3 grid = 6');
  console.assert(uniquePathsRolling(1, 1) === 1, 'single cell has one path');

  console.assert(climbStairs(2) === 2, 'climbStairs(2) = 2');
  console.assert(climbStairs(3) === 3, 'climbStairs(3) = 3');
  console.assert(climbStairs(5) === 8, 'climbStairs(5) = 8');

  console.assert(rob([1, 2, 3, 1]) === 4, 'rob houses 1 and 3: 1 + 3 = 4');
  console.assert(rob([2, 7, 9, 3, 1]) === 12, 'rob houses 2, 9, 1: 2 + 9 + 1 = 12');
  console.assert(rob([]) === 0, 'rob nothing from empty street');

  console.log('02-memoization-tabulation: all assertions passed');
}
