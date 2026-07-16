// Companion code for ./11-floyd-warshall.md
//
// Self-contained weighted lesson (like 06-dijkstra-heap and 10-bellman-ford):
// it works on a dense distance MATRIX built from [from, to, weight] triples,
// not on lesson 01's unweighted AdjacencyList. Floyd-Warshall solves the
// ALL-PAIRS shortest path problem via dynamic programming: it considers each
// vertex k in turn as a possible intermediate stop and relaxes every (i, j) pair.

/** Builds a vertexCount x vertexCount distance matrix from [from, to, weight]
 * triples. dist[i][i] = 0, dist[i][j] = Infinity when no direct edge exists.
 * When two direct edges share endpoints, the smaller weight wins. */
export function buildDistanceMatrix(
  vertexCount: number,
  edges: ReadonlyArray<readonly [number, number, number]>,
  directed: boolean
): number[][] {
  const dist: number[][] = Array.from({ length: vertexCount }, () =>
    new Array<number>(vertexCount).fill(Infinity)
  );
  for (let v = 0; v < vertexCount; v++) dist[v][v] = 0;
  for (const [from, to, weight] of edges) {
    if (weight < dist[from][to]) dist[from][to] = weight;
    if (!directed && weight < dist[to][from]) dist[to][from] = weight;
  }
  return dist;
}

/** Floyd-Warshall: shortest distances between EVERY pair of vertices. For each
 * intermediate vertex k, every pair (i, j) asks "is going i -> k -> j shorter
 * than the best i -> j found so far?". After all k, dist[i][j] is the true
 * shortest distance. Operates on a copy so the input matrix is left untouched.
 * Guards against relaxing through unreachable vertices (Infinity) to avoid
 * Infinity + Infinity arithmetic. */
export function floydWarshall(matrix: readonly number[][]): number[][] {
  const n = matrix.length;
  const dist: number[][] = matrix.map((row) => row.slice());

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      if (dist[i][k] === Infinity) continue; // i can't reach k, so i->k->j is useless
      for (let j = 0; j < n; j++) {
        if (dist[k][j] === Infinity) continue;
        const throughK = dist[i][k] + dist[k][j];
        if (throughK < dist[i][j]) {
          dist[i][j] = throughK;
        }
      }
    }
  }

  return dist;
}

/** A negative-weight cycle exists iff some vertex ends up with a negative
 * distance to itself after Floyd-Warshall (i.e. dist[i][i] < 0). */
export function hasNegativeCycle(matrix: readonly number[][]): boolean {
  const dist = floydWarshall(matrix);
  for (let i = 0; i < dist.length; i++) {
    if (dist[i][i] < 0) return true;
  }
  return false;
}

// Exercise: render a distance matrix as aligned ASCII, printing 'inf' for
// Infinity. Handy for watching the matrix update between k iterations.
export function formatMatrixStub(_matrix: readonly number[][]): string {
  throw new Error('not implemented');
}
// Solution:
export function formatMatrix(matrix: readonly number[][]): string {
  const cell = (value: number): string => (value === Infinity ? 'inf' : String(value));
  let width = 3;
  for (const row of matrix) {
    for (const value of row) width = Math.max(width, cell(value).length);
  }
  return matrix
    .map((row) => row.map((value) => cell(value).padStart(width)).join(' '))
    .join('\n');
}

// --- LeetCode 1334. Find the City With the Smallest Number of Neighbors at a
// Threshold Distance (Medium) ---
// https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/
// Run Floyd-Warshall once for all-pairs distances, then for each city count how
// many others sit within `distanceThreshold`. Return the city with the fewest
// such neighbors, breaking ties toward the LARGEST index.
export function findTheCity(
  n: number,
  edges: readonly number[][],
  distanceThreshold: number
): number {
  const matrix = buildDistanceMatrix(
    n,
    edges.map(([u, v, w]): [number, number, number] => [u, v, w]),
    false
  );
  const dist = floydWarshall(matrix);

  let bestCity = -1;
  let fewestReachable = Infinity;
  for (let city = 0; city < n; city++) {
    let reachable = 0;
    for (let other = 0; other < n; other++) {
      if (other !== city && dist[city][other] <= distanceThreshold) reachable++;
    }
    if (reachable <= fewestReachable) {
      fewestReachable = reachable;
      bestCity = city; // <= tie-break keeps the larger index
    }
  }
  return bestCity;
}

// --- run ---
if (require.main === module) {
  // Directed weighted graph:
  //   0 --3--> 1 --1--> 2
  //   0 --8--> 2         (the two-hop 0->1->2 = 4 beats the direct 8)
  //   2 --2--> 3
  const matrix = buildDistanceMatrix(
    4,
    [
      [0, 1, 3],
      [1, 2, 1],
      [0, 2, 8],
      [2, 3, 2],
    ],
    true
  );

  console.log('initial distance matrix:\n' + formatMatrix(matrix));
  const dist = floydWarshall(matrix);
  console.log('all-pairs shortest paths:\n' + formatMatrix(dist));

  console.assert(dist[0][2] === 4, '0->1->2 (=4) should beat the direct 0->2 edge (=8)');
  console.assert(dist[0][3] === 6, '0->1->2->3 should total 6');
  console.assert(dist[3][0] === Infinity, 'vertex 0 is unreachable from vertex 3');
  console.assert(dist[1][1] === 0, 'distance from a vertex to itself is 0');

  console.assert(!hasNegativeCycle(matrix), 'this graph has no negative cycle');

  // Negative cycle 0 -> 1 -> 0 with total weight 1 + (-2) = -1.
  const negativeCycle = buildDistanceMatrix(2, [[0, 1, 1], [1, 0, -2]], true);
  console.assert(hasNegativeCycle(negativeCycle), 'a negative cycle drives some dist[i][i] below zero');

  // formatMatrix renders Infinity as 'inf'.
  console.assert(
    formatMatrix([[0, Infinity], [Infinity, 0]]) === '  0 inf\ninf   0',
    'formatMatrix should print inf for unreachable pairs'
  );

  // LeetCode 1334 sample.
  console.assert(
    findTheCity(4, [[0, 1, 3], [1, 2, 1], [1, 3, 4], [2, 3, 1]], 4) === 3,
    'city 3 has the fewest neighbors within threshold 4'
  );

  console.log('11-floyd-warshall: all assertions passed');
}
