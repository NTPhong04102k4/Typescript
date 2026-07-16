// Companion code for ./09-leetcode-practice.md
import { UnionFind } from './05-union-find';

// Exercise: given an adjacency list (graph[v] = neighbors of v), return the
// out-degree of every vertex in order.
export function degreeSequenceStub(_graph: readonly number[][]): number[] {
  throw new Error('not implemented');
}
// Solution:
export function degreeSequence(graph: readonly number[][]): number[] {
  return graph.map((neighbors) => neighbors.length);
}

// --- LeetCode 1971. Find if Path Exists in Graph (Easy) ---
// https://leetcode.com/problems/find-if-path-exists-in-graph/
// Union every edge, then check whether source and destination ended up in the same set.
export function validPath(n: number, edges: readonly number[][], source: number, destination: number): boolean {
  const uf = new UnionFind(n);
  for (const [a, b] of edges) uf.union(a, b);
  return uf.connected(source, destination);
}

// --- LeetCode 547. Number of Provinces (Medium) ---
// https://leetcode.com/problems/number-of-provinces/
// isConnected is an adjacency matrix; union every direct connection and count
// the remaining disjoint sets (provinces).
export function findCircleNum(isConnected: readonly number[][]): number {
  const n = isConnected.length;
  const uf = new UnionFind(n);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i][j] === 1) uf.union(i, j);
    }
  }
  return uf.count;
}

// --- LeetCode 1319. Number of Operations to Make Network Connected (Medium) ---
// https://leetcode.com/problems/number-of-operations-to-make-network-connected/
// Connecting k disjoint components needs k - 1 extra cables, but only if there are at
// least n - 1 cables to work with in the first place (fewer can never connect n nodes).
export function makeConnected(n: number, connections: readonly number[][]): number {
  if (connections.length < n - 1) return -1;
  const uf = new UnionFind(n);
  for (const [a, b] of connections) uf.union(a, b);
  return uf.count - 1;
}

// --- LeetCode 785. Is Graph Bipartite? (Medium) ---
// https://leetcode.com/problems/is-graph-bipartite/
// BFS 2-coloring: color every vertex the opposite of its parent; a conflict (a
// neighbor already the same color) means the graph has an odd cycle and isn't bipartite.
export function isBipartite(graph: readonly number[][]): boolean {
  const n = graph.length;
  const color = new Array<number>(n).fill(0); // 0 = uncolored, 1 or -1 = the two colors

  for (let start = 0; start < n; start++) {
    if (color[start] !== 0) continue;
    color[start] = 1;
    const queue: number[] = [start];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++];
      for (const v of graph[u]) {
        if (color[v] === 0) {
          color[v] = -color[u];
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false;
        }
      }
    }
  }

  return true;
}

// --- LeetCode 399. Evaluate Division (Medium) ---
// https://leetcode.com/problems/evaluate-division/
// Each equation a/b = value becomes two weighted directed edges: a->b (weight value)
// and b->a (weight 1/value). A query a/b is then just the product of edge weights along
// any path from a to b, found via BFS.
export function calcEquation(
  equations: ReadonlyArray<readonly [string, string]>,
  values: readonly number[],
  queries: ReadonlyArray<readonly [string, string]>
): number[] {
  const graph = new Map<string, Array<{ node: string; weight: number }>>();
  const addNode = (node: string): void => {
    if (!graph.has(node)) graph.set(node, []);
  };
  equations.forEach(([a, b], i) => {
    addNode(a);
    addNode(b);
    graph.get(a)?.push({ node: b, weight: values[i] });
    graph.get(b)?.push({ node: a, weight: 1 / values[i] });
  });

  const query = (start: string, end: string): number => {
    if (!graph.has(start) || !graph.has(end)) return -1.0;
    if (start === end) return 1.0;
    const visited = new Set<string>([start]);
    const queue: Array<{ node: string; product: number }> = [{ node: start, product: 1.0 }];
    let head = 0;
    while (head < queue.length) {
      const { node, product } = queue[head++];
      if (node === end) return product;
      for (const { node: next, weight } of graph.get(node) ?? []) {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push({ node: next, product: product * weight });
        }
      }
    }
    return -1.0;
  };

  return queries.map(([a, b]) => query(a, b));
}

// --- LeetCode 990. Satisfiability of Equality Equations (Medium) ---
// https://leetcode.com/problems/satisfiability-of-equality-equations/
// Union every "a==b" pair first (order-independent), then check every "a!=b" pair for
// a contradiction: if a and b ended up in the same set, the equations are unsatisfiable.
export function equationsPossible(equations: readonly string[]): boolean {
  const uf = new UnionFind(26);
  const index = (letter: string): number => letter.charCodeAt(0) - 'a'.charCodeAt(0);

  for (const equation of equations) {
    if (equation[1] === '=') {
      uf.union(index(equation[0]), index(equation[3]));
    }
  }
  for (const equation of equations) {
    if (equation[1] === '!') {
      if (uf.connected(index(equation[0]), index(equation[3]))) return false;
    }
  }
  return true;
}

// --- LeetCode 1192. Critical Connections in a Network (Hard) ---
// https://leetcode.com/problems/critical-connections-in-a-network/
// Tarjan's bridge-finding algorithm: track each vertex's discovery time and "low-link"
// value (the earliest discovery time reachable via any back-edge from its subtree). An
// edge (u, v) is a bridge exactly when low[v] > discovery[u] -- v's subtree has no way
// back to u or anything earlier, so removing (u, v) disconnects the graph.
export function criticalConnections(n: number, connections: readonly number[][]): number[][] {
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of connections) {
    graph[a].push(b);
    graph[b].push(a);
  }

  const discovery = new Array<number>(n).fill(-1);
  const low = new Array<number>(n).fill(-1);
  const bridges: number[][] = [];
  let timer = 0;

  const dfs = (u: number, parent: number): void => {
    discovery[u] = timer;
    low[u] = timer;
    timer++;
    for (const v of graph[u]) {
      if (v === parent) continue;
      if (discovery[v] === -1) {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > discovery[u]) {
          bridges.push([u, v]);
        }
      } else {
        low[u] = Math.min(low[u], discovery[v]);
      }
    }
  };

  dfs(0, -1);
  return bridges;
}

// --- run ---
if (require.main === module) {
  console.assert(
    JSON.stringify(degreeSequence([[1, 2], [2], [], [0]])) === JSON.stringify([2, 1, 0, 1]),
    'degreeSequence should report each vertex\'s out-degree in order'
  );

  console.assert(validPath(3, [[0, 1], [1, 2], [2, 0]], 0, 2), '0 and 2 should be connected through the triangle');
  console.assert(
    !validPath(6, [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], 0, 5),
    '{0,1,2} and {3,4,5} are separate components, so 0 and 5 should not be connected'
  );

  console.assert(
    findCircleNum([[1, 1, 0], [1, 1, 0], [0, 0, 1]]) === 2,
    'two provinces: {0,1} directly connected, and {2} alone'
  );
  console.assert(
    findCircleNum([[1, 0, 0], [0, 1, 0], [0, 0, 1]]) === 3,
    'no connections at all means every city is its own province'
  );

  console.assert(
    makeConnected(4, [[0, 1], [0, 2], [1, 2]]) === 1,
    'the redundant edge in the {0,1,2} triangle can be repurposed to connect isolated node 3'
  );
  console.assert(
    makeConnected(6, [[0, 1], [0, 2], [0, 3]]) === -1,
    'only 3 cables can never connect 6 computers, regardless of arrangement'
  );

  console.assert(isBipartite([[1, 3], [0, 2], [1, 3], [0, 2]]), 'an even 4-cycle should be bipartite');
  console.assert(!isBipartite([[1, 2], [0, 2], [0, 1]]), 'an odd 3-cycle (triangle) should not be bipartite');

  const equations: Array<readonly [string, string]> = [['a', 'b'], ['b', 'c']];
  const queries: Array<readonly [string, string]> = [['a', 'c'], ['b', 'a'], ['a', 'e'], ['a', 'a'], ['x', 'x']];
  const results = calcEquation(equations, [2.0, 3.0], queries);
  console.assert(Math.abs(results[0] - 6.0) < 1e-9, 'a/c should evaluate to 2.0 * 3.0 = 6.0');
  console.assert(Math.abs(results[1] - 0.5) < 1e-9, 'b/a should evaluate to 1/2.0 = 0.5');
  console.assert(results[2] === -1.0, 'a/e should be -1.0 since e is never defined');
  console.assert(results[3] === 1.0, 'a/a should always be 1.0');
  console.assert(results[4] === -1.0, 'x/x should be -1.0 since x is never defined, even though start === end');

  console.assert(!equationsPossible(['a==b', 'b!=a']), 'a==b contradicts b!=a, so the equations are unsatisfiable');
  console.assert(equationsPossible(['b==a', 'a==b']), 'two equalities agreeing with each other should be satisfiable');
  console.assert(
    !equationsPossible(['a==b', 'c==a', 'b!=c']),
    'a==b and c==a force b==c, contradicting b!=c, regardless of statement order'
  );

  console.assert(
    JSON.stringify(criticalConnections(4, [[0, 1], [1, 2], [2, 0], [1, 3]])) === JSON.stringify([[1, 3]]),
    'edge [1,3] is the only bridge: removing it disconnects node 3, unlike the 0-1-2 triangle edges'
  );

  console.log('09-leetcode-practice: all assertions passed');
}
