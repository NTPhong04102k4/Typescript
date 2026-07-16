// Companion code for ./05-bit-dp.md

/**
 * Held-Karp travelling-salesman DP. `dist[i][j]` is the cost of going from city
 * i to city j. Returns the minimum cost of a closed tour that starts at city 0,
 * visits every city exactly once, and returns to 0.
 *
 * State: `dp[mask][last]` = cheapest way to have visited exactly the set of
 * cities in `mask` (which always includes city 0) and currently be sitting at
 * city `last`. The bitmask encodes the "visited set" in a single integer, which
 * is what makes the 2^n * n state space tractable.
 */
export function shortestTour(dist: readonly number[][]): number {
  const n = dist.length;
  if (n <= 1) return 0;
  const full = 1 << n;
  const INF = Number.POSITIVE_INFINITY;

  // dp[mask][last]; seed: only city 0 visited, sitting at city 0, cost 0.
  const dp: number[][] = Array.from({ length: full }, () => new Array<number>(n).fill(INF));
  dp[1][0] = 0;

  for (let mask = 1; mask < full; mask++) {
    if ((mask & 1) === 0) continue; // every valid state includes the start city 0
    for (let last = 0; last < n; last++) {
      const current = dp[mask][last];
      if (current === INF) continue;
      for (let next = 0; next < n; next++) {
        if ((mask >> next) & 1) continue; // next already visited
        const nextMask = mask | (1 << next);
        const candidate = current + dist[last][next];
        if (candidate < dp[nextMask][next]) dp[nextMask][next] = candidate;
      }
    }
  }

  // Close the tour: from each possible last city back to city 0.
  let best = INF;
  for (let last = 0; last < n; last++) {
    if (dp[full - 1][last] === INF) continue;
    best = Math.min(best, dp[full - 1][last] + dist[last][0]);
  }
  return best;
}

// Exercise: count the number of Hamiltonian paths that start at node 0 and
// visit every node exactly once, where adj[u][v] === 1 means the move u -> v is
// allowed. Use dp[mask][last] as the number of ways to reach `last` having
// visited exactly `mask`.
export function countHamiltonianPathsStub(_adj: readonly number[][]): number {
  throw new Error('not implemented');
}
// Solution:
export function countHamiltonianPaths(adj: readonly number[][]): number {
  const n = adj.length;
  if (n === 0) return 0;
  const full = 1 << n;

  const dp: number[][] = Array.from({ length: full }, () => new Array<number>(n).fill(0));
  dp[1][0] = 1; // one way: start at node 0 with only node 0 visited

  for (let mask = 1; mask < full; mask++) {
    if ((mask & 1) === 0) continue;
    for (let last = 0; last < n; last++) {
      const ways = dp[mask][last];
      if (ways === 0) continue;
      for (let next = 0; next < n; next++) {
        if ((mask >> next) & 1) continue;
        if (adj[last][next] !== 1) continue;
        dp[mask | (1 << next)][next] += ways;
      }
    }
  }

  let total = 0;
  for (let last = 0; last < n; last++) total += dp[full - 1][last];
  return total;
}

// --- run ---
if (require.main === module) {
  // A symmetric 4-city distance matrix.
  const dist = [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0],
  ];
  // Optimal closed tour 0 -> 1 -> 3 -> 2 -> 0 costs 10 + 25 + 30 + 15 = 80.
  console.assert(shortestTour(dist) === 80, 'optimal 4-city tour costs 80');
  console.assert(shortestTour([[0]]) === 0, 'a single city needs no travel');

  // Complete graph on 3 nodes: from node 0 the Hamiltonian paths are
  // 0-1-2 and 0-2-1, so there should be 2.
  const complete3 = [
    [0, 1, 1],
    [1, 0, 1],
    [1, 1, 0],
  ];
  console.assert(countHamiltonianPaths(complete3) === 2, 'K3 has 2 Hamiltonian paths from node 0');

  // A path graph 0 - 1 - 2: only 0-1-2 works, so exactly 1.
  const line3 = [
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
  ];
  console.assert(countHamiltonianPaths(line3) === 1, 'the path graph has 1 Hamiltonian path from node 0');

  console.log('05-bit-dp: all assertions passed');
}
