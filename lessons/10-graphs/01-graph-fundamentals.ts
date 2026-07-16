// See ./01-graph-fundamentals.md for the full lesson.

/** A directed edge from -> to. buildAdjacencyList mirrors it for undirected graphs. */
export interface Edge {
  readonly from: number;
  readonly to: number;
}

/** Adjacency list: vertex -> list of neighboring vertices. The shared representation
 * reused by every later lesson in this topic. */
export type AdjacencyList = Map<number, number[]>;

/** Creates an empty adjacency list with an entry for every vertex 0..vertexCount-1. */
export function createEmptyGraph(vertexCount: number): AdjacencyList {
  const graph: AdjacencyList = new Map();
  for (let v = 0; v < vertexCount; v++) {
    graph.set(v, []);
  }
  return graph;
}

/** Adds one edge to the adjacency list; mirrors it when the graph is undirected. */
export function addEdge(graph: AdjacencyList, from: number, to: number, directed: boolean): void {
  graph.get(from)?.push(to);
  if (!directed) {
    graph.get(to)?.push(from);
  }
}

/** Builds an adjacency list from a vertex count and an edge list. */
export function buildAdjacencyList(
  vertexCount: number,
  edges: readonly Edge[],
  directed: boolean
): AdjacencyList {
  const graph = createEmptyGraph(vertexCount);
  for (const edge of edges) {
    addEdge(graph, edge.from, edge.to, directed);
  }
  return graph;
}

/** Builds a vertexCount x vertexCount adjacency matrix (0/1) from an edge list. */
export function buildAdjacencyMatrix(
  vertexCount: number,
  edges: readonly Edge[],
  directed: boolean
): number[][] {
  const matrix: number[][] = Array.from({ length: vertexCount }, () => new Array(vertexCount).fill(0));
  for (const edge of edges) {
    matrix[edge.from][edge.to] = 1;
    if (!directed) {
      matrix[edge.to][edge.from] = 1;
    }
  }
  return matrix;
}

// Exercise: write degreeOf(graph, vertex) returning the out-degree (number of neighbors).
// Solution:
export function degreeOf(graph: AdjacencyList, vertex: number): number {
  return graph.get(vertex)?.length ?? 0;
}

// Exercise: write adjacencyListToMatrix(graph, vertexCount), converting an existing
// AdjacencyList into a 0/1 matrix without touching the original edge list.
// Solution:
export function adjacencyListToMatrix(graph: AdjacencyList, vertexCount: number): number[][] {
  const matrix: number[][] = Array.from({ length: vertexCount }, () => new Array(vertexCount).fill(0));
  for (const [from, neighbors] of graph) {
    for (const to of neighbors) {
      matrix[from][to] = 1;
    }
  }
  return matrix;
}

// LeetCode 997. Find the Town Judge (Easy)
// The judge trusts nobody but is trusted by everyone else: net trust score n - 1.
export function findJudge(n: number, trust: number[][]): number {
  const trustScore = new Array(n + 1).fill(0);
  for (const [a, b] of trust) {
    trustScore[a]--;
    trustScore[b]++;
  }
  for (let person = 1; person <= n; person++) {
    if (trustScore[person] === n - 1) return person;
  }
  return -1;
}

// LeetCode 1791. Find Center of Star Graph (Easy)
// In a star graph, the center appears in every edge; the first two edges suffice to find it.
export function findCenter(edges: number[][]): number {
  const [first, second] = edges;
  const [a, b] = first;
  const [c, d] = second;
  if (a === c || a === d) return a;
  return b;
}

// --- run ---
if (require.main === module) {
  const edges: Edge[] = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
  ];

  const directedGraph = buildAdjacencyList(4, edges, true);
  console.log('directed adjacency list:', directedGraph);
  console.assert(JSON.stringify(directedGraph.get(0)) === JSON.stringify([1, 2]), '0 -> [1, 2] in directed graph');
  console.assert(JSON.stringify(directedGraph.get(1)) === JSON.stringify([2]), '1 -> [2] in directed graph');
  console.assert(JSON.stringify(directedGraph.get(2)) === JSON.stringify([3]), '2 -> [3] in directed graph');
  console.assert(JSON.stringify(directedGraph.get(3)) === JSON.stringify([]), '3 has no outgoing edges');

  const undirectedGraph = buildAdjacencyList(4, edges, false);
  console.assert(JSON.stringify(undirectedGraph.get(0)) === JSON.stringify([1, 2]), 'undirected 0 -> [1, 2]');
  console.assert(JSON.stringify(undirectedGraph.get(1)) === JSON.stringify([0, 2]), 'undirected 1 -> [0, 2]');
  console.assert(JSON.stringify(undirectedGraph.get(2)) === JSON.stringify([0, 1, 3]), 'undirected 2 -> [0, 1, 3]');
  console.assert(JSON.stringify(undirectedGraph.get(3)) === JSON.stringify([2]), 'undirected 3 -> [2]');

  const matrix = buildAdjacencyMatrix(4, edges, true);
  console.log('directed adjacency matrix:', matrix);
  console.assert(
    JSON.stringify(matrix) === JSON.stringify([
      [0, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 0],
    ]),
    'directed adjacency matrix should match the edge list'
  );
  console.assert(
    JSON.stringify(adjacencyListToMatrix(directedGraph, 4)) === JSON.stringify(matrix),
    'adjacencyListToMatrix should agree with buildAdjacencyMatrix'
  );

  console.assert(degreeOf(directedGraph, 0) === 2, 'vertex 0 has out-degree 2');
  console.assert(degreeOf(directedGraph, 3) === 0, 'vertex 3 has out-degree 0');

  console.assert(findJudge(2, [[1, 2]]) === 2, 'findJudge should identify vertex 2 as the judge');
  console.assert(findJudge(3, [[1, 3], [2, 3]]) === -1, 'findJudge should return -1 when nobody qualifies');

  console.assert(
    findCenter([[1, 2], [2, 3], [4, 2]]) === 2,
    'findCenter should identify vertex 2 as the star center'
  );

  console.log('All lesson 01 checks passed.');
}
