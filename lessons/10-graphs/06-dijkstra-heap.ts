// Companion code for ./06-dijkstra-heap.md
//
// This lesson is intentionally self-contained: it defines its own small min-heap
// instead of importing MinHeap from the 06-heap-priority-queue topic, since a
// weighted graph needs its own edge/adjacency-list shape anyway.

/** Returns negative if a sorts before b, positive if after, 0 if tied. */
type Comparator<T> = (a: T, b: T) => number;

/** Minimal binary min-heap: the smallest element per `compare` is always at index 0. */
class MinHeap<T> {
  private data: T[] = [];

  constructor(private readonly compare: Comparator<T>) {}

  get size(): number {
    return this.data.length;
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  push(value: T): void {
    this.data.push(value);
    this.siftUp(this.data.length - 1);
  }

  pop(): T | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop() as T;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  private siftUp(index: number): void {
    let i = index;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(this.data[i], this.data[parent]) < 0) {
        this.swap(i, parent);
        i = parent;
      } else {
        break;
      }
    }
  }

  private siftDown(index: number): void {
    let i = index;
    const n = this.data.length;
    for (;;) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && this.compare(this.data[left], this.data[smallest]) < 0) smallest = left;
      if (right < n && this.compare(this.data[right], this.data[smallest]) < 0) smallest = right;
      if (smallest === i) break;
      this.swap(i, smallest);
      i = smallest;
    }
  }

  private swap(i: number, j: number): void {
    const tmp = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = tmp;
  }
}

/** A weighted directed edge to `to` costing `weight`. */
export interface WeightedEdge {
  readonly to: number;
  readonly weight: number;
}

/** Weighted adjacency list: vertex -> list of (neighbor, weight) pairs. */
export type WeightedAdjacencyList = Map<number, WeightedEdge[]>;

/** Builds a weighted adjacency list from a vertex count and a [from, to, weight] edge list. */
export function buildWeightedAdjacencyList(
  vertexCount: number,
  edges: ReadonlyArray<readonly [number, number, number]>,
  directed: boolean
): WeightedAdjacencyList {
  const graph: WeightedAdjacencyList = new Map();
  for (let v = 0; v < vertexCount; v++) graph.set(v, []);
  for (const [from, to, weight] of edges) {
    graph.get(from)?.push({ to, weight });
    if (!directed) {
      graph.get(to)?.push({ to: from, weight });
    }
  }
  return graph;
}

/** Dijkstra's algorithm: shortest distance from `source` to every vertex, using a
 * min-heap keyed on tentative distance so the closest unvisited vertex is always
 * processed next. Returns Infinity for vertices unreachable from source. */
export function dijkstra(graph: WeightedAdjacencyList, source: number, vertexCount: number): number[] {
  const dist = new Array<number>(vertexCount).fill(Infinity);
  dist[source] = 0;

  const heap = new MinHeap<[number, number]>((a, b) => a[1] - b[1]); // [vertex, distance]
  heap.push([source, 0]);
  const visited = new Array<boolean>(vertexCount).fill(false);

  while (!heap.isEmpty()) {
    const [u, d] = heap.pop() as [number, number];
    if (visited[u]) continue;
    visited[u] = true;

    for (const { to, weight } of graph.get(u) ?? []) {
      const candidate = d + weight;
      if (candidate < dist[to]) {
        dist[to] = candidate;
        heap.push([to, candidate]);
      }
    }
  }

  return dist;
}

// Exercise: return true if target is reachable from source within `budget` total weight.
export function hasPathWithinBudgetStub(
  _graph: WeightedAdjacencyList,
  _source: number,
  _target: number,
  _vertexCount: number,
  _budget: number
): boolean {
  throw new Error('not implemented');
}
// Solution:
export function hasPathWithinBudget(
  graph: WeightedAdjacencyList,
  source: number,
  target: number,
  vertexCount: number,
  budget: number
): boolean {
  const dist = dijkstra(graph, source, vertexCount);
  return dist[target] <= budget;
}

// --- LeetCode 743. Network Delay Time (Medium) ---
// https://leetcode.com/problems/network-delay-time/
// times[i] = [u, v, w] (1-indexed nodes); a signal sent from k needs
// max(dist) time to reach every node, or -1 if some node is unreachable.
export function networkDelayTime(times: readonly number[][], n: number, k: number): number {
  const edges: Array<[number, number, number]> = times.map(
    ([u, v, w]): [number, number, number] => [u - 1, v - 1, w]
  );
  const graph = buildWeightedAdjacencyList(n, edges, true);
  const dist = dijkstra(graph, k - 1, n);
  const maxDist = Math.max(...dist);
  return maxDist === Infinity ? -1 : maxDist;
}

// --- run ---
if (require.main === module) {
  // Directed weighted graph (1-indexed in the problem, 0-indexed internally):
  //   1 --1--> 2 --1--> 3 --1--> 4
  const times = [[2, 1, 1], [2, 3, 1], [3, 4, 1]];
  const graph = buildWeightedAdjacencyList(
    4,
    times.map(([u, v, w]): [number, number, number] => [u - 1, v - 1, w]),
    true
  );

  const distFromNode2 = dijkstra(graph, 1, 4); // node 2 is index 1
  console.assert(
    JSON.stringify(distFromNode2) === JSON.stringify([1, 0, 1, 2]),
    'distances from node 2 should be [1, 0, 1, 2] for nodes [1,2,3,4]'
  );

  console.assert(networkDelayTime(times, 4, 2) === 2, 'signal from node 2 should reach every node within 2 units');
  console.assert(networkDelayTime([[1, 2, 1]], 2, 2) === -1, 'node 1 is unreachable from node 2');

  console.assert(
    hasPathWithinBudget(graph, 1, 3, 4, 2),
    'node 4 (index 3) should be reachable from node 2 (index 1) within budget 2'
  );
  console.assert(
    !hasPathWithinBudget(graph, 1, 3, 4, 0),
    'node 4 should not be reachable from node 2 within budget 0'
  );

  console.log('06-dijkstra-heap: all assertions passed');
}
