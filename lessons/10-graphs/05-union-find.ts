// Companion code for ./05-union-find.md

/** Disjoint-set (union-find) over integers 0..size-1, with path compression on find
 * and union by rank to keep trees shallow. Reused by later lessons in this topic
 * (cycle detection, minimum spanning tree, LeetCode practice). */
export class UnionFind {
  private readonly parent: number[];
  private readonly rank: number[];
  private componentCount: number;

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array<number>(size).fill(0);
    this.componentCount = size;
  }

  /** Finds the root of x's set, flattening the path along the way (path compression). */
  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  /** Merges the sets containing a and b. Returns false if they were already the same
   * set (i.e. this edge is redundant), true if a merge happened. */
  union(a: number, b: number): boolean {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return false;

    if (this.rank[rootA] < this.rank[rootB]) {
      this.parent[rootA] = rootB;
    } else if (this.rank[rootA] > this.rank[rootB]) {
      this.parent[rootB] = rootA;
    } else {
      this.parent[rootB] = rootA;
      this.rank[rootA]++;
    }
    this.componentCount--;
    return true;
  }

  /** True if a and b are already in the same set. */
  connected(a: number, b: number): boolean {
    return this.find(a) === this.find(b);
  }

  /** Number of distinct sets remaining. */
  get count(): number {
    return this.componentCount;
  }
}

// Exercise: return true once every element has been unioned into a single set.
export function areAllConnectedStub(_uf: UnionFind): boolean {
  throw new Error('not implemented');
}
// Solution:
export function areAllConnected(uf: UnionFind): boolean {
  return uf.count === 1;
}

// --- LeetCode 323. Number of Connected Components in an Undirected Graph (Medium) ---
// https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/
// Union every edge's endpoints; whatever sets remain are the connected components.
export function countComponents(n: number, edges: readonly number[][]): number {
  const uf = new UnionFind(n);
  for (const [a, b] of edges) uf.union(a, b);
  return uf.count;
}

// --- LeetCode 684. Redundant Connection (Medium) ---
// https://leetcode.com/problems/redundant-connection/
// edges describe a tree plus exactly one extra edge. Union endpoints in order; the
// edge whose endpoints are already connected is the one that created the cycle.
export function findRedundantConnection(edges: readonly number[][]): number[] {
  const n = edges.length;
  const uf = new UnionFind(n + 1); // vertices are 1-indexed per the problem statement
  for (const [a, b] of edges) {
    if (!uf.union(a, b)) {
      return [a, b];
    }
  }
  throw new Error('no redundant connection found in a valid input');
}

// --- run ---
if (require.main === module) {
  const uf = new UnionFind(5);
  console.assert(uf.count === 5, 'a fresh UnionFind of size 5 should start with 5 components');
  console.assert(uf.union(0, 1) === true, 'unioning two fresh elements should succeed');
  console.assert(uf.union(1, 2) === true, 'unioning 2 into the {0,1} set should succeed');
  console.assert(uf.union(3, 4) === true, 'unioning 3 and 4 into their own set should succeed');
  console.assert(uf.union(0, 2) === false, '0 and 2 are already connected through 1');
  console.assert(uf.connected(0, 2), '0 and 2 should be in the same set after the unions above');
  console.assert(!uf.connected(0, 3), '{0,1,2} and {3,4} should still be separate sets');
  console.assert(uf.count === 2, 'exactly 2 components should remain: {0,1,2} and {3,4}');
  console.assert(!areAllConnected(uf), 'not everything is connected yet');
  uf.union(2, 3);
  console.assert(areAllConnected(uf), 'after bridging the two sets, everything should be connected');

  console.assert(
    countComponents(5, [[0, 1], [1, 2], [3, 4]]) === 2,
    '{0,1,2} and {3,4} should form 2 components'
  );
  console.assert(
    countComponents(5, [[0, 1], [1, 2], [2, 3], [3, 4]]) === 1,
    'a chain touching every vertex should form 1 component'
  );

  console.assert(
    JSON.stringify(findRedundantConnection([[1, 2], [1, 3], [2, 3]])) === JSON.stringify([2, 3]),
    'the edge closing the 1-2-3 triangle should be reported as redundant'
  );
  console.assert(
    JSON.stringify(findRedundantConnection([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]])) === JSON.stringify([1, 4]),
    'the edge closing the 1-2-3-4 cycle should be reported as redundant, before edge [1,5] is even considered'
  );

  console.log('05-union-find: all assertions passed');
}
