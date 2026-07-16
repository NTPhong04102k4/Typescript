// Companion code for ./04-topological-sort.md
import { type AdjacencyList, createEmptyGraph, addEdge } from './01-graph-fundamentals';

/** Kahn's algorithm: repeatedly remove a vertex with in-degree 0, decrementing its
 * neighbors' in-degrees. Returns null if a cycle prevents a full ordering. */
export function topologicalSortKahn(graph: AdjacencyList, vertexCount: number): number[] | null {
  const inDegree = new Array<number>(vertexCount).fill(0);
  for (const neighbors of graph.values()) {
    for (const neighbor of neighbors) inDegree[neighbor]++;
  }

  const queue: number[] = [];
  for (let v = 0; v < vertexCount; v++) {
    if (inDegree[v] === 0) queue.push(v);
  }

  const order: number[] = [];
  let head = 0;
  while (head < queue.length) {
    const current = queue[head++];
    order.push(current);
    for (const neighbor of graph.get(current) ?? []) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }

  return order.length === vertexCount ? order : null;
}

/** DFS-based topological sort: push each vertex to a postorder list only after all of
 * its descendants are done, then reverse. A vertex revisited while still "visiting"
 * means a cycle exists, so null is returned. */
export function topologicalSortDFS(graph: AdjacencyList, vertexCount: number): number[] | null {
  const state = new Array<'unvisited' | 'visiting' | 'done'>(vertexCount).fill('unvisited');
  const postorder: number[] = [];
  let hasCycle = false;

  const visit = (v: number): void => {
    if (state[v] === 'done') return;
    if (state[v] === 'visiting') {
      hasCycle = true;
      return;
    }
    state[v] = 'visiting';
    for (const neighbor of graph.get(v) ?? []) {
      if (hasCycle) return;
      visit(neighbor);
    }
    if (hasCycle) return;
    state[v] = 'done';
    postorder.push(v);
  };

  for (let v = 0; v < vertexCount; v++) {
    if (!hasCycle) visit(v);
  }

  return hasCycle ? null : postorder.reverse();
}

// Exercise: given any candidate ordering, verify it respects every edge in
// the graph (every edge u->v has u appearing before v in order).
export function isValidTopologicalOrderStub(_graph: AdjacencyList, _order: readonly number[]): boolean {
  throw new Error('not implemented');
}
// Solution:
export function isValidTopologicalOrder(graph: AdjacencyList, order: readonly number[]): boolean {
  const position = new Map<number, number>(order.map((vertex, index) => [vertex, index]));
  for (const [from, neighbors] of graph) {
    for (const to of neighbors) {
      const fromPos = position.get(from);
      const toPos = position.get(to);
      if (fromPos === undefined || toPos === undefined || fromPos >= toPos) return false;
    }
  }
  return true;
}

// --- LeetCode 207. Course Schedule (Medium) ---
// https://leetcode.com/problems/course-schedule/
// prerequisites[i] = [course, prereq] means prereq must be taken before course,
// i.e. an edge prereq -> course. All courses can finish iff the graph is acyclic.
export function canFinish(numCourses: number, prerequisites: readonly number[][]): boolean {
  const graph = createEmptyGraph(numCourses);
  for (const [course, prereq] of prerequisites) {
    addEdge(graph, prereq, course, true);
  }
  return topologicalSortKahn(graph, numCourses) !== null;
}

// --- LeetCode 210. Course Schedule II (Medium) ---
// https://leetcode.com/problems/course-schedule-ii/
// Same graph as canFinish, but return a valid course order instead of a boolean
// (empty array when no valid order exists).
export function findOrder(numCourses: number, prerequisites: readonly number[][]): number[] {
  const graph = createEmptyGraph(numCourses);
  for (const [course, prereq] of prerequisites) {
    addEdge(graph, prereq, course, true);
  }
  return topologicalSortKahn(graph, numCourses) ?? [];
}

// --- run ---
if (require.main === module) {
  // Diamond DAG: 0 must come before 1 and 2; both 1 and 2 must come before 3.
  //     0
  //    / \
  //   1   2
  //    \ /
  //     3
  const dag = createEmptyGraph(4);
  addEdge(dag, 0, 1, true);
  addEdge(dag, 0, 2, true);
  addEdge(dag, 1, 3, true);
  addEdge(dag, 2, 3, true);

  console.assert(
    JSON.stringify(topologicalSortKahn(dag, 4)) === JSON.stringify([0, 1, 2, 3]),
    'Kahn\'s algorithm should process 0, then 1 and 2, then 3'
  );
  console.assert(
    JSON.stringify(topologicalSortDFS(dag, 4)) === JSON.stringify([0, 2, 1, 3]),
    'DFS-based sort produces a different (still valid) order: postorder [3,1,2,0] reversed'
  );
  console.assert(isValidTopologicalOrder(dag, [0, 1, 2, 3]), 'Kahn\'s order should respect every edge');
  console.assert(isValidTopologicalOrder(dag, [0, 2, 1, 3]), 'DFS order should also respect every edge');
  console.assert(!isValidTopologicalOrder(dag, [3, 2, 1, 0]), 'a reversed order should violate every edge');

  // 3-cycle: 0 -> 1 -> 2 -> 0, no valid ordering exists.
  const cyclic = createEmptyGraph(3);
  addEdge(cyclic, 0, 1, true);
  addEdge(cyclic, 1, 2, true);
  addEdge(cyclic, 2, 0, true);
  console.assert(topologicalSortKahn(cyclic, 3) === null, 'Kahn\'s algorithm should detect the 3-cycle');
  console.assert(topologicalSortDFS(cyclic, 3) === null, 'DFS-based sort should detect the 3-cycle');

  console.assert(canFinish(2, [[1, 0]]) === true, 'course 1 depending only on course 0 has no cycle');
  console.assert(canFinish(2, [[1, 0], [0, 1]]) === false, 'mutual prerequisites form a cycle');

  console.assert(
    JSON.stringify(findOrder(4, [[1, 0], [2, 0], [3, 1], [3, 2]])) === JSON.stringify([0, 1, 2, 3]),
    'findOrder should reproduce the diamond DAG order via Kahn\'s algorithm'
  );
  console.assert(JSON.stringify(findOrder(2, [[1, 0], [0, 1]])) === JSON.stringify([]), 'a cyclic schedule has no valid order');

  console.log('04-topological-sort: all assertions passed');
}
