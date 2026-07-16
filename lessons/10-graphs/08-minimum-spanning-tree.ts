// Companion code for ./08-minimum-spanning-tree.md
import { UnionFind } from './05-union-find';

/** An undirected weighted edge, used as Kruskal's input candidate list. */
export interface WeightedEdge {
  readonly from: number;
  readonly to: number;
  readonly weight: number;
}

/** Kruskal's algorithm: sort all candidate edges by weight ascending, and greedily add
 * an edge to the MST whenever it connects two components that aren't already joined
 * (checked and merged via Union-Find). Works on a disconnected graph too, in which case
 * the result is a minimum spanning *forest* with fewer than vertexCount - 1 edges. */
export function kruskalMST(
  vertexCount: number,
  edges: readonly WeightedEdge[]
): { mstEdges: WeightedEdge[]; totalWeight: number } {
  const sorted = [...edges].sort((a, b) => a.weight - b.weight);
  const uf = new UnionFind(vertexCount);
  const mstEdges: WeightedEdge[] = [];
  let totalWeight = 0;

  for (const edge of sorted) {
    if (uf.union(edge.from, edge.to)) {
      mstEdges.push(edge);
      totalWeight += edge.weight;
    }
  }

  return { mstEdges, totalWeight };
}

// Exercise: return just the number of edges Kruskal's algorithm selected
// (should equal vertexCount - 1 for a connected graph, fewer if disconnected).
export function mstEdgeCountStub(_vertexCount: number, _edges: readonly WeightedEdge[]): number {
  throw new Error('not implemented');
}
// Solution:
export function mstEdgeCount(vertexCount: number, edges: readonly WeightedEdge[]): number {
  return kruskalMST(vertexCount, edges).mstEdges.length;
}

// --- LeetCode 1584. Min Cost to Connect All Points (Medium) ---
// https://leetcode.com/problems/min-cost-to-connect-all-points/
// Every pair of points is a candidate edge weighted by Manhattan distance; the answer
// is the total weight of the minimum spanning tree over the complete graph they form.
export function minCostConnectPoints(points: readonly number[][]): number {
  const n = points.length;
  const edges: WeightedEdge[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const weight = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
      edges.push({ from: i, to: j, weight });
    }
  }
  return kruskalMST(n, edges).totalWeight;
}

// --- run ---
if (require.main === module) {
  // points: (0,0) (2,2) (3,10) (5,2) (7,0)
  // Manhattan distances between every pair, sorted ascending:
  //   (1,3)=3, (0,1)=4, (3,4)=4, (0,3)=7, (0,4)=7, (1,4)=7, (1,2)=9, (2,3)=10, (0,2)=13, (2,4)=14
  // Kruskal picks (1,3)=3, (0,1)=4, (3,4)=4, then skips same-component edges until (1,2)=9
  // connects the last component: total = 3 + 4 + 4 + 9 = 20.
  const points = [[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]];
  console.assert(minCostConnectPoints(points) === 20, 'minimum cost to connect all 5 points should be 20');

  const smallGraphEdges: WeightedEdge[] = [
    { from: 0, to: 1, weight: 1 },
    { from: 1, to: 2, weight: 2 },
    { from: 0, to: 2, weight: 3 },
  ];
  const { mstEdges, totalWeight } = kruskalMST(3, smallGraphEdges);
  console.assert(totalWeight === 3, 'triangle MST should skip the heaviest edge, total weight 1 + 2 = 3');
  console.assert(mstEdges.length === 2, 'a connected 3-vertex MST should have exactly 2 edges');
  console.assert(mstEdgeCount(3, smallGraphEdges) === 2, 'mstEdgeCount should agree with kruskalMST');

  // Disconnected graph: {0,1} and {2,3} have no edge between them, so the "MST" is
  // really a minimum spanning forest with only 2 edges, not vertexCount - 1 = 3.
  const disconnectedEdges: WeightedEdge[] = [
    { from: 0, to: 1, weight: 5 },
    { from: 2, to: 3, weight: 7 },
  ];
  console.assert(
    mstEdgeCount(4, disconnectedEdges) === 2,
    'a disconnected graph yields a spanning forest, fewer than vertexCount - 1 edges'
  );

  console.log('08-minimum-spanning-tree: all assertions passed');
}
