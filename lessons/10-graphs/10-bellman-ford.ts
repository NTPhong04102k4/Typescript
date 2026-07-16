// Companion code for ./10-bellman-ford.md
//
// Like lesson 06 (Dijkstra), this file is self-contained: it defines its own
// weighted [from, to, weight] edge shape rather than reusing lesson 01's
// unweighted AdjacencyList. Unlike Dijkstra, Bellman-Ford tolerates NEGATIVE
// edge weights and can DETECT a negative-weight cycle (a cycle whose total
// weight is negative, which makes "shortest path" meaningless).

/** A weighted directed edge from `from` to `to` costing `weight`. */
export interface WeightedEdge {
  readonly from: number;
  readonly to: number;
  readonly weight: number;
}

/** Builds a plain edge list from [from, to, weight] triples, mirroring each edge
 * (with the same weight) when the graph is undirected. Bellman-Ford iterates over
 * a flat edge list, so — unlike Dijkstra — it needs no adjacency map at all. */
export function buildWeightedEdgeList(
  edges: ReadonlyArray<readonly [number, number, number]>,
  directed: boolean
): WeightedEdge[] {
  const result: WeightedEdge[] = [];
  for (const [from, to, weight] of edges) {
    result.push({ from, to, weight });
    if (!directed) {
      result.push({ from: to, to: from, weight });
    }
  }
  return result;
}

/** Result of a Bellman-Ford run. When `hasNegativeCycle` is true, `dist` is not
 * meaningful (some distances can be driven arbitrarily low), so callers should
 * check the flag first. */
export interface BellmanFordResult {
  readonly dist: number[];
  readonly hasNegativeCycle: boolean;
}

/** Bellman-Ford single-source shortest path. Relaxes every edge V-1 times: after
 * i passes, every shortest path using at most i edges is settled, and a simple
 * path in a V-vertex graph has at most V-1 edges. A V-th pass that still relaxes
 * an edge proves a negative-weight cycle is reachable from the source. Returns
 * Infinity for vertices unreachable from `source`. */
export function bellmanFord(
  edges: readonly WeightedEdge[],
  source: number,
  vertexCount: number
): BellmanFordResult {
  const dist = new Array<number>(vertexCount).fill(Infinity);
  dist[source] = 0;

  // V-1 relaxation passes.
  for (let pass = 0; pass < vertexCount - 1; pass++) {
    let changed = false;
    for (const { from, to, weight } of edges) {
      if (dist[from] === Infinity) continue; // can't relax through an unreached vertex
      const candidate = dist[from] + weight;
      if (candidate < dist[to]) {
        dist[to] = candidate;
        changed = true;
      }
    }
    if (!changed) break; // early exit: a stable pass means we're done
  }

  // One extra pass: any further improvement means a reachable negative cycle.
  let hasNegativeCycle = false;
  for (const { from, to, weight } of edges) {
    if (dist[from] === Infinity) continue;
    if (dist[from] + weight < dist[to]) {
      hasNegativeCycle = true;
      break;
    }
  }

  return { dist, hasNegativeCycle };
}

// Exercise: reconstruct the shortest path (list of vertices) from source to target
// using a predecessor array filled during relaxation. Return [] if unreachable.
export function shortestPathStub(
  _edges: readonly WeightedEdge[],
  _source: number,
  _target: number,
  _vertexCount: number
): number[] {
  throw new Error('not implemented');
}
// Solution:
export function shortestPath(
  edges: readonly WeightedEdge[],
  source: number,
  target: number,
  vertexCount: number
): number[] {
  const dist = new Array<number>(vertexCount).fill(Infinity);
  const prev = new Array<number>(vertexCount).fill(-1);
  dist[source] = 0;

  for (let pass = 0; pass < vertexCount - 1; pass++) {
    let changed = false;
    for (const { from, to, weight } of edges) {
      if (dist[from] === Infinity) continue;
      if (dist[from] + weight < dist[to]) {
        dist[to] = dist[from] + weight;
        prev[to] = from;
        changed = true;
      }
    }
    if (!changed) break;
  }

  if (dist[target] === Infinity) return [];

  const path: number[] = [];
  for (let at: number = target; at !== -1; at = prev[at]) {
    path.push(at);
  }
  return path.reverse();
}

// Exercise: return true when a negative-weight cycle is reachable from `source`.
// Solution:
export function hasReachableNegativeCycle(
  edges: readonly WeightedEdge[],
  source: number,
  vertexCount: number
): boolean {
  return bellmanFord(edges, source, vertexCount).hasNegativeCycle;
}

// --- LeetCode 787. Cheapest Flights Within K Stops (Medium) ---
// https://leetcode.com/problems/cheapest-flights-within-k-stops/
// Bellman-Ford is a natural fit: "at most K stops" means "at most K+1 edges", so
// we run exactly K+1 relaxation passes. Crucially, each pass reads from a SNAPSHOT
// of the previous pass's distances (a copy), so a single pass cannot chain two
// edges together and overshoot the stop budget.
export function findCheapestPrice(
  n: number,
  flights: readonly number[][],
  src: number,
  dst: number,
  k: number
): number {
  let dist = new Array<number>(n).fill(Infinity);
  dist[src] = 0;

  for (let pass = 0; pass <= k; pass++) {
    const next = dist.slice();
    for (const [from, to, price] of flights) {
      if (dist[from] === Infinity) continue;
      if (dist[from] + price < next[to]) {
        next[to] = dist[from] + price;
      }
    }
    dist = next;
  }

  return dist[dst] === Infinity ? -1 : dist[dst];
}

// --- run ---
if (require.main === module) {
  // Directed weighted graph WITH a negative edge (but no negative cycle):
  //   0 --4--> 1
  //   0 --5--> 2
  //   1 --(-2)--> 2   (Dijkstra would mishandle this negative edge)
  //   2 --3--> 3
  const edges = buildWeightedEdgeList(
    [
      [0, 1, 4],
      [0, 2, 5],
      [1, 2, -2],
      [2, 3, 3],
    ],
    true
  );

  const { dist, hasNegativeCycle } = bellmanFord(edges, 0, 4);
  console.assert(
    JSON.stringify(dist) === JSON.stringify([0, 4, 2, 5]),
    'shortest distances from 0 should be [0, 4, 2, 5] (0->1->2 beats 0->2 thanks to the -2 edge)'
  );
  console.assert(!hasNegativeCycle, 'this graph has no negative cycle');

  console.assert(
    JSON.stringify(shortestPath(edges, 0, 3, 4)) === JSON.stringify([0, 1, 2, 3]),
    'cheapest 0->3 path routes through the negative edge: 0,1,2,3'
  );
  console.assert(
    JSON.stringify(shortestPath(edges, 3, 0, 4)) === JSON.stringify([]),
    'vertex 0 is unreachable from vertex 3'
  );

  // Unreachable vertex stays at Infinity.
  console.assert(bellmanFord(edges, 3, 4).dist[0] === Infinity, 'unreachable vertices stay at Infinity');

  // Negative cycle: 0 -> 1 -> 2 -> 0 with total weight 1 + (-2) + (-2) = -3.
  const negativeCycle = buildWeightedEdgeList(
    [
      [0, 1, 1],
      [1, 2, -2],
      [2, 0, -2],
    ],
    true
  );
  console.assert(
    hasReachableNegativeCycle(negativeCycle, 0, 3),
    'a reachable negative-weight cycle should be detected'
  );
  console.assert(
    bellmanFord(negativeCycle, 0, 3).hasNegativeCycle,
    'bellmanFord should flag the negative cycle'
  );

  // LeetCode 787 sample: cheapest price from 0 to 2 within 1 stop.
  console.assert(
    findCheapestPrice(3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1) === 200,
    'with 1 stop allowed, 0->1->2 costs 200'
  );
  console.assert(
    findCheapestPrice(3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0) === 500,
    'with 0 stops allowed, only the direct 0->2 flight (500) qualifies'
  );

  console.log('10-bellman-ford: all assertions passed');
}
