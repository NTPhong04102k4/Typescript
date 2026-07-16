// Companion code for ./12-tarjan-scc.md
//
// Tarjan works on the UNWEIGHTED directed graph, so it reuses lesson 01's
// AdjacencyList (Map<number, number[]>) directly instead of defining a weighted
// shape. A strongly connected component (SCC) is a maximal set of vertices where
// every vertex can reach every other. Tarjan's algorithm finds all SCCs in a
// single DFS pass using discovery indices, "lowlink" values, and an explicit stack.

import type { AdjacencyList } from './01-graph-fundamentals';
import { buildAdjacencyList } from './01-graph-fundamentals';

/** Builds a DIRECTED adjacency list from [from, to] pairs — a thin wrapper over
 * lesson 01's buildAdjacencyList so callers read edges as tuples. */
export function buildDirectedGraph(
  vertexCount: number,
  edges: ReadonlyArray<readonly [number, number]>
): AdjacencyList {
  return buildAdjacencyList(
    vertexCount,
    edges.map(([from, to]) => ({ from, to })),
    true
  );
}

/** Tarjan's SCC algorithm.
 *
 * DFS assigns each vertex an increasing `index` (discovery time). `lowlink[v]`
 * is the smallest index reachable from v's DFS subtree, following tree edges and
 * at most one back/cross edge into a vertex still on the stack. When a vertex's
 * lowlink equals its own index, it is the ROOT of an SCC: pop the stack down to
 * (and including) that vertex to emit the component.
 *
 * Returns the SCCs; each component's vertices are in the order they were popped,
 * and components come out in reverse topological order of the condensation graph. */
export function tarjanSCC(graph: AdjacencyList, vertexCount: number): number[][] {
  const UNVISITED = -1;
  const index = new Array<number>(vertexCount).fill(UNVISITED);
  const lowlink = new Array<number>(vertexCount).fill(0);
  const onStack = new Array<boolean>(vertexCount).fill(false);
  const stack: number[] = [];
  const sccs: number[][] = [];
  let counter = 0;

  const strongConnect = (v: number): void => {
    index[v] = counter;
    lowlink[v] = counter;
    counter++;
    stack.push(v);
    onStack[v] = true;

    for (const w of graph.get(v) ?? []) {
      if (index[w] === UNVISITED) {
        // Tree edge: recurse, then absorb the child's lowlink.
        strongConnect(w);
        lowlink[v] = Math.min(lowlink[v], lowlink[w]);
      } else if (onStack[w]) {
        // Back/cross edge to a vertex in the current SCC-in-progress.
        lowlink[v] = Math.min(lowlink[v], index[w]);
      }
      // Edge to a vertex already assigned to a finished SCC: ignore.
    }

    // v is an SCC root: unwind the stack down to v.
    if (lowlink[v] === index[v]) {
      const component: number[] = [];
      for (;;) {
        const w = stack.pop() as number;
        onStack[w] = false;
        component.push(w);
        if (w === v) break;
      }
      sccs.push(component);
    }
  };

  for (let v = 0; v < vertexCount; v++) {
    if (index[v] === UNVISITED) strongConnect(v);
  }

  return sccs;
}

// Exercise: count how many strongly connected components the graph has.
export function countSCCsStub(_graph: AdjacencyList, _vertexCount: number): number {
  throw new Error('not implemented');
}
// Solution:
export function countSCCs(graph: AdjacencyList, vertexCount: number): number {
  return tarjanSCC(graph, vertexCount).length;
}

// Exercise: return true when the whole graph is one single SCC (fully mutually
// reachable). Return true for the trivial 1-vertex graph, false for the empty graph.
// Solution:
export function isStronglyConnected(graph: AdjacencyList, vertexCount: number): boolean {
  if (vertexCount === 0) return false;
  return tarjanSCC(graph, vertexCount).length === 1;
}

// --- LeetCode 1192. Critical Connections in a Network (Hard) ---
// https://leetcode.com/problems/critical-connections-in-a-network/
// A "critical connection" (bridge) is an UNDIRECTED edge whose removal disconnects
// the graph. This is the undirected cousin of Tarjan's SCC idea: the same
// discovery-index / lowlink machinery, but an edge (u, w) is a bridge exactly when
// lowlink[w] > disc[u] — nothing in w's subtree can reach u or earlier without it.
export function criticalConnections(
  n: number,
  connections: readonly number[][]
): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of connections) {
    adj[a].push(b);
    adj[b].push(a);
  }

  const disc = new Array<number>(n).fill(-1);
  const low = new Array<number>(n).fill(0);
  const bridges: number[][] = [];
  let timer = 0;

  const dfs = (u: number, parent: number): void => {
    disc[u] = timer;
    low[u] = timer;
    timer++;
    for (const w of adj[u]) {
      if (w === parent) continue; // don't walk straight back over the parent edge
      if (disc[w] === -1) {
        dfs(w, u);
        low[u] = Math.min(low[u], low[w]);
        if (low[w] > disc[u]) bridges.push([u, w]);
      } else {
        low[u] = Math.min(low[u], disc[w]);
      }
    }
  };

  for (let v = 0; v < n; v++) {
    if (disc[v] === -1) dfs(v, -1);
  }

  return bridges;
}

/** Normalizes SCC output for order-insensitive comparison: sort within each
 * component, then sort the components. Used by the assertions below. */
function normalizeSCCs(sccs: number[][]): number[][] {
  return sccs
    .map((component) => [...component].sort((a, b) => a - b))
    .sort((a, b) => a[0] - b[0]);
}

// --- run ---
if (require.main === module) {
  // Directed graph with three SCCs:
  //   {0,1,2} form a cycle 0->1->2->0
  //   2 -> 3, 3 -> 4, 4 -> 5, 5 -> 3  (so {3,4,5} form a cycle)
  //   6 is a lone sink reached from 5
  const graph = buildDirectedGraph(7, [
    [0, 1],
    [1, 2],
    [2, 0],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 3],
    [5, 6],
  ]);

  const sccs = tarjanSCC(graph, 7);
  console.log('SCCs:', sccs);
  console.assert(
    JSON.stringify(normalizeSCCs(sccs)) === JSON.stringify([[0, 1, 2], [3, 4, 5], [6]]),
    'should find SCCs {0,1,2}, {3,4,5}, and {6}'
  );
  console.assert(countSCCs(graph, 7) === 3, 'graph has exactly 3 strongly connected components');
  console.assert(!isStronglyConnected(graph, 7), 'the whole graph is not one SCC');

  // A single directed cycle IS strongly connected.
  const cycle = buildDirectedGraph(3, [[0, 1], [1, 2], [2, 0]]);
  console.assert(isStronglyConnected(cycle, 3), 'a directed 3-cycle is one SCC');
  console.assert(countSCCs(cycle, 3) === 1, 'a directed 3-cycle has exactly 1 SCC');

  // A DAG with no cycles: every vertex is its own SCC.
  const dag = buildDirectedGraph(3, [[0, 1], [1, 2]]);
  console.assert(countSCCs(dag, 3) === 3, 'a 3-vertex DAG has 3 singleton SCCs');

  // LeetCode 1192 sample: n = 4, connections form a triangle 0-1-2 plus a tail 1-3.
  // Only the tail edge 1-3 is critical.
  const bridges = criticalConnections(4, [[0, 1], [1, 2], [2, 0], [1, 3]]);
  console.assert(
    JSON.stringify(bridges.map((b) => [...b].sort((a, c) => a - c)).sort((a, c) => a[0] - c[0])) ===
      JSON.stringify([[1, 3]]),
    'only edge (1, 3) is a critical connection'
  );

  console.log('12-tarjan-scc: all assertions passed');
}
