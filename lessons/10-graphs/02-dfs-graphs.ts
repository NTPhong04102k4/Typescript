// Companion code for ./02-dfs-graphs.md
import type { AdjacencyList } from './01-graph-fundamentals';

/** Depth-first traversal order starting at `start`, using the call stack for recursion. */
export function dfsRecursive(graph: AdjacencyList, start: number): number[] {
  const visited = new Set<number>();
  const order: number[] = [];

  const visit = (vertex: number): void => {
    if (visited.has(vertex)) return;
    visited.add(vertex);
    order.push(vertex);
    for (const neighbor of graph.get(vertex) ?? []) {
      visit(neighbor);
    }
  };

  visit(start);
  return order;
}

/** Same traversal as dfsRecursive, but with an explicit stack instead of recursion.
 * Neighbors are pushed in reverse so the first neighbor is popped (and visited) first,
 * matching the left-to-right order dfsRecursive produces. */
export function dfsIterative(graph: AdjacencyList, start: number): number[] {
  const visited = new Set<number>();
  const order: number[] = [];
  const stack: number[] = [start];

  while (stack.length > 0) {
    const current = stack.pop() as number;
    if (visited.has(current)) continue;
    visited.add(current);
    order.push(current);
    const neighbors = graph.get(current) ?? [];
    for (let i = neighbors.length - 1; i >= 0; i--) {
      stack.push(neighbors[i]);
    }
  }

  return order;
}

/** Counts connected components by running a DFS flood-fill from every unvisited vertex. */
export function connectedComponentsCount(graph: AdjacencyList): number {
  const visited = new Set<number>();
  let count = 0;

  for (const vertex of graph.keys()) {
    if (visited.has(vertex)) continue;
    count++;
    const stack: number[] = [vertex];
    while (stack.length > 0) {
      const current = stack.pop() as number;
      if (visited.has(current)) continue;
      visited.add(current);
      for (const neighbor of graph.get(current) ?? []) {
        if (!visited.has(neighbor)) stack.push(neighbor);
      }
    }
  }

  return count;
}

// Exercise: given a graph and two vertices, return true if a path exists
// between them (a single connected-component membership check via DFS).
export function hasPathDFSStub(_graph: AdjacencyList, _start: number, _target: number): boolean {
  throw new Error('not implemented');
}
// Solution:
export function hasPathDFS(graph: AdjacencyList, start: number, target: number): boolean {
  return dfsRecursive(graph, start).includes(target);
}

// --- LeetCode 200. Number of Islands (Medium) ---
// https://leetcode.com/problems/number-of-islands/
// Flood-fill every unvisited '1' cell with DFS, counting how many flood-fills it takes.
export function numIslands(grid: readonly string[][]): number {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  const visited: boolean[][] = Array.from({ length: rows }, () => new Array(cols).fill(false));
  let islands = 0;

  const floodFill = (r: number, c: number): void => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (visited[r][c] || grid[r][c] === '0') return;
    visited[r][c] = true;
    floodFill(r + 1, c);
    floodFill(r - 1, c);
    floodFill(r, c + 1);
    floodFill(r, c - 1);
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1' && !visited[r][c]) {
        islands++;
        floodFill(r, c);
      }
    }
  }

  return islands;
}

// --- LeetCode 695. Max Area of Island (Medium) ---
// https://leetcode.com/problems/max-area-of-island/
// Same flood-fill idea as numIslands, but each fill returns its cell count instead of
// just incrementing a counter.
export function maxAreaOfIsland(grid: readonly number[][]): number {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  const visited: boolean[][] = Array.from({ length: rows }, () => new Array(cols).fill(false));

  const areaFrom = (r: number, c: number): number => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return 0;
    if (visited[r][c] || grid[r][c] === 0) return 0;
    visited[r][c] = true;
    return 1 + areaFrom(r + 1, c) + areaFrom(r - 1, c) + areaFrom(r, c + 1) + areaFrom(r, c - 1);
  };

  let maxArea = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1 && !visited[r][c]) {
        maxArea = Math.max(maxArea, areaFrom(r, c));
      }
    }
  }

  return maxArea;
}

// --- LeetCode 133. Clone Graph (Medium) ---
// https://leetcode.com/problems/clone-graph/
// DFS with a Map from original node -> clone, so cycles don't cause infinite recursion:
// the second time a node is reached, its clone already exists and is returned immediately.
export class GraphNode {
  val: number;
  neighbors: GraphNode[];

  constructor(val: number, neighbors: GraphNode[] = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}

export function cloneGraph(node: GraphNode | null): GraphNode | null {
  if (node === null) return null;
  const clones = new Map<GraphNode, GraphNode>();

  const visit = (original: GraphNode): GraphNode => {
    const existing = clones.get(original);
    if (existing) return existing;
    const copy = new GraphNode(original.val);
    clones.set(original, copy);
    for (const neighbor of original.neighbors) {
      copy.neighbors.push(visit(neighbor));
    }
    return copy;
  };

  return visit(node);
}

// --- run ---
if (require.main === module) {
  // Graph:
  //       0
  //      / \
  //     1   2
  //     |    \
  //     3     4
  //            \
  //             5
  const edges = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 4, to: 5 },
  ];
  const graph: AdjacencyList = new Map([
    [0, []], [1, []], [2, []], [3, []], [4, []], [5, []], [6, []],
  ]);
  for (const { from, to } of edges) {
    graph.get(from)?.push(to);
    graph.get(to)?.push(from);
  }

  console.assert(
    JSON.stringify(dfsRecursive(graph, 0)) === JSON.stringify([0, 1, 3, 2, 4, 5]),
    'recursive DFS should visit 0, 1, 3, 2, 4, 5 in that order'
  );
  console.assert(
    JSON.stringify(dfsIterative(graph, 0)) === JSON.stringify([0, 1, 3, 2, 4, 5]),
    'iterative DFS (reversed neighbor pushes) should match the recursive order'
  );
  console.assert(hasPathDFS(graph, 0, 5), 'a path should exist from 0 to 5');
  console.assert(!hasPathDFS(graph, 3, 6), 'vertex 6 is an isolated component, unreachable from 3');

  // Vertex 6 has no edges, so it forms its own component alongside {0,1,2,3,4,5}.
  console.assert(connectedComponentsCount(graph) === 2, 'graph should have 2 connected components');

  const islandGrid = [
    ['1', '1', '0', '0'],
    ['1', '1', '0', '0'],
    ['0', '0', '1', '0'],
    ['0', '0', '0', '1'],
  ];
  console.assert(numIslands(islandGrid) === 3, 'grid should contain exactly 3 islands');

  const areaGrid = [
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [1, 1, 0, 0],
  ];
  console.assert(maxAreaOfIsland(areaGrid) === 3, 'largest island should have area 3');

  const n1 = new GraphNode(1);
  const n2 = new GraphNode(2);
  const n3 = new GraphNode(3);
  const n4 = new GraphNode(4);
  n1.neighbors = [n2, n4];
  n2.neighbors = [n1, n3];
  n3.neighbors = [n2, n4];
  n4.neighbors = [n1, n3];

  const clone = cloneGraph(n1) as GraphNode;
  console.assert(clone !== n1, 'clone should be a different object than the original root');
  console.assert(clone.val === 1, 'clone root should keep the original value 1');
  console.assert(clone.neighbors.length === 2, 'clone root should have 2 neighbors');
  console.assert(
    clone.neighbors[0].val === 2 && clone.neighbors[1].val === 4,
    'clone root neighbors should have values 2 and 4, in original order'
  );
  console.assert(clone.neighbors[0] !== n2, 'clone neighbors should also be fresh objects, not originals');

  console.log('02-dfs-graphs: all assertions passed');
}
