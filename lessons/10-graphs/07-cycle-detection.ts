// Companion code for ./07-cycle-detection.md
import type { AdjacencyList } from './01-graph-fundamentals';
import { UnionFind } from './05-union-find';

/** Directed-graph cycle detection via 3-color DFS: 'unvisited' -> 'visiting' -> 'done'.
 * Re-entering a 'visiting' vertex means the current path looped back on itself. */
export function hasCycleDirected(graph: AdjacencyList, vertexCount: number): boolean {
  const state = new Array<'unvisited' | 'visiting' | 'done'>(vertexCount).fill('unvisited');
  let cycleFound = false;

  const visit = (v: number): void => {
    if (cycleFound || state[v] === 'done') return;
    if (state[v] === 'visiting') {
      cycleFound = true;
      return;
    }
    state[v] = 'visiting';
    for (const neighbor of graph.get(v) ?? []) {
      if (cycleFound) return;
      visit(neighbor);
    }
    if (cycleFound) return;
    state[v] = 'done';
  };

  for (let v = 0; v < vertexCount; v++) {
    if (!cycleFound) visit(v);
  }

  return cycleFound;
}

/** Undirected-graph cycle detection via Union-Find: process each edge once (only when
 * neighbor > vertex, since addEdge mirrors every undirected edge onto both endpoints).
 * A cycle exists the moment an edge connects two vertices already in the same set. */
export function hasCycleUndirected(graph: AdjacencyList, vertexCount: number): boolean {
  const uf = new UnionFind(vertexCount);
  for (const [vertex, neighbors] of graph) {
    for (const neighbor of neighbors) {
      if (neighbor <= vertex) continue;
      if (!uf.union(vertex, neighbor)) return true;
    }
  }
  return false;
}

// Exercise: dispatch to the right cycle check based on whether the graph is directed.
export function hasCycleStub(_graph: AdjacencyList, _vertexCount: number, _directed: boolean): boolean {
  throw new Error('not implemented');
}
// Solution:
export function hasCycle(graph: AdjacencyList, vertexCount: number, directed: boolean): boolean {
  return directed ? hasCycleDirected(graph, vertexCount) : hasCycleUndirected(graph, vertexCount);
}

// --- LeetCode 802. Find Eventual Safe States (Medium) ---
// https://leetcode.com/problems/find-eventual-safe-states/
// A node is "safe" if every path from it eventually reaches a terminal node (no outgoing
// edges) without ever looping. 3-color DFS: color 2 (safe) is only assigned to a node
// once every one of its neighbors also resolves to safe; color 1 (currently on the
// active DFS path) reached again means a cycle, so that node can never be marked safe.
export function eventualSafeNodes(graph: readonly number[][]): number[] {
  const n = graph.length;
  const color = new Array<number>(n).fill(0); // 0 = unvisited, 1 = visiting, 2 = safe

  const isSafe = (node: number): boolean => {
    if (color[node] === 2) return true;
    if (color[node] === 1) return false;
    color[node] = 1;
    for (const neighbor of graph[node]) {
      if (!isSafe(neighbor)) return false;
    }
    color[node] = 2;
    return true;
  };

  const safeNodes: number[] = [];
  for (let node = 0; node < n; node++) {
    if (isSafe(node)) safeNodes.push(node);
  }
  return safeNodes;
}

// --- run ---
if (require.main === module) {
  // Directed diamond DAG (acyclic): 0->1, 0->2, 1->3, 2->3
  const dag: AdjacencyList = new Map([
    [0, [1, 2]], [1, [3]], [2, [3]], [3, []],
  ]);
  console.assert(!hasCycleDirected(dag, 4), 'a diamond DAG should have no cycle');
  console.assert(!hasCycle(dag, 4, true), 'hasCycle should dispatch to hasCycleDirected correctly');

  // Directed 3-cycle: 0 -> 1 -> 2 -> 0
  const directedCycle: AdjacencyList = new Map([
    [0, [1]], [1, [2]], [2, [0]],
  ]);
  console.assert(hasCycleDirected(directedCycle, 3), 'a 3-cycle should be detected');

  // Undirected tree (no cycle): 0-1, 1-2, 2-3
  const undirectedTree: AdjacencyList = new Map([
    [0, [1]], [1, [0, 2]], [2, [1, 3]], [3, [2]],
  ]);
  console.assert(!hasCycleUndirected(undirectedTree, 4), 'a tree has no cycle');
  console.assert(!hasCycle(undirectedTree, 4, false), 'hasCycle should dispatch to hasCycleUndirected correctly');

  // Undirected 4-cycle: 0-1, 1-2, 2-3, 3-0
  const undirectedCycle: AdjacencyList = new Map([
    [0, [1, 3]], [1, [0, 2]], [2, [1, 3]], [3, [2, 0]],
  ]);
  console.assert(hasCycleUndirected(undirectedCycle, 4), 'a 4-cycle should be detected');

  console.assert(
    JSON.stringify(eventualSafeNodes([[1, 2], [2, 3], [5], [0], [5], [], []])) === JSON.stringify([2, 4, 5, 6]),
    'nodes 2, 4, 5, 6 should be the eventual safe states'
  );

  console.log('07-cycle-detection: all assertions passed');
}
