// Companion code for ./03-bfs-graphs.md
import type { AdjacencyList } from './01-graph-fundamentals';

/** Breadth-first traversal order starting at `start`, using a FIFO queue. */
export function bfsTraversalOrder(graph: AdjacencyList, start: number): number[] {
  const visited = new Set<number>([start]);
  const order: number[] = [];
  const queue: number[] = [start];
  let head = 0;

  while (head < queue.length) {
    const current = queue[head++];
    order.push(current);
    for (const neighbor of graph.get(current) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return order;
}

/** Fewest-edges distance from `start` to every reachable vertex (BFS visits vertices in
 * non-decreasing distance order, so the first time a vertex is reached is the shortest). */
export function shortestHopsFrom(graph: AdjacencyList, start: number): Map<number, number> {
  const distance = new Map<number, number>([[start, 0]]);
  const queue: number[] = [start];
  let head = 0;

  while (head < queue.length) {
    const current = queue[head++];
    const currentDistance = distance.get(current) as number;
    for (const neighbor of graph.get(current) ?? []) {
      if (!distance.has(neighbor)) {
        distance.set(neighbor, currentDistance + 1);
        queue.push(neighbor);
      }
    }
  }

  return distance;
}

// Exercise: return the fewest-edges distance from start to target, or -1
// if target is unreachable.
export function bfsShortestDistanceStub(_graph: AdjacencyList, _start: number, _target: number): number {
  throw new Error('not implemented');
}
// Solution:
export function bfsShortestDistance(graph: AdjacencyList, start: number, target: number): number {
  return shortestHopsFrom(graph, start).get(target) ?? -1;
}

// --- LeetCode 1091. Shortest Path in Binary Matrix (Medium) ---
// https://leetcode.com/problems/shortest-path-in-binary-matrix/
// 8-directional BFS from (0,0) to (n-1,n-1); grid cells are 0 (open) or 1 (blocked).
// Returns the number of cells on the shortest path, or -1 if none exists.
export function shortestPathBinaryMatrix(grid: readonly number[][]): number {
  const n = grid.length;
  if (n === 0 || grid[0][0] !== 0 || grid[n - 1][n - 1] !== 0) return -1;

  const directions: ReadonlyArray<readonly [number, number]> = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];
  const visited: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  visited[0][0] = true;
  const queue: Array<[number, number, number]> = [[0, 0, 1]];
  let head = 0;

  while (head < queue.length) {
    const [r, c, dist] = queue[head++];
    if (r === n - 1 && c === n - 1) return dist;
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc] && grid[nr][nc] === 0) {
        visited[nr][nc] = true;
        queue.push([nr, nc, dist + 1]);
      }
    }
  }

  return -1;
}

// --- LeetCode 994. Rotting Oranges (Medium) ---
// https://leetcode.com/problems/rotting-oranges/
// Multi-source BFS: every initially-rotten cell (2) starts in the queue at minute 0;
// each level of the BFS rots all adjacent fresh oranges (1) and takes one minute.
export function orangesRotting(grid: readonly number[][]): number {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  const cells = grid.map((row) => [...row]);
  let fresh = 0;
  let queue: Array<[number, number]> = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cells[r][c] === 1) fresh++;
      else if (cells[r][c] === 2) queue.push([r, c]);
    }
  }
  if (fresh === 0) return 0;

  const directions: ReadonlyArray<readonly [number, number]> = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let minutes = 0;

  while (fresh > 0 && queue.length > 0) {
    const nextQueue: Array<[number, number]> = [];
    for (const [r, c] of queue) {
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && cells[nr][nc] === 1) {
          cells[nr][nc] = 2;
          fresh--;
          nextQueue.push([nr, nc]);
        }
      }
    }
    queue = nextQueue;
    minutes++;
  }

  return fresh === 0 ? minutes : -1;
}

// --- LeetCode 127. Word Ladder (Hard) ---
// https://leetcode.com/problems/word-ladder/
// BFS over an implicit graph where two words are neighbors if they differ by one letter.
// BFS guarantees the first time endWord is reached is via the shortest transformation chain.
export function wordLadderLength(beginWord: string, endWord: string, wordList: readonly string[]): number {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const visited = new Set<string>([beginWord]);
  const queue: Array<[string, number]> = [[beginWord, 1]];
  let head = 0;

  while (head < queue.length) {
    const [word, steps] = queue[head++];
    if (word === endWord) return steps;
    for (let i = 0; i < word.length; i++) {
      for (const letter of alphabet) {
        if (letter === word[i]) continue;
        const candidate = word.slice(0, i) + letter + word.slice(i + 1);
        if (wordSet.has(candidate) && !visited.has(candidate)) {
          visited.add(candidate);
          queue.push([candidate, steps + 1]);
        }
      }
    }
  }

  return 0;
}

// --- run ---
if (require.main === module) {
  // Same graph as lesson 02:
  //       0
  //      / \
  //     1   2
  //     |    \
  //     3     4
  //            \
  //             5
  const graph: AdjacencyList = new Map([
    [0, []], [1, []], [2, []], [3, []], [4, []], [5, []],
  ]);
  const undirectedEdges = [[0, 1], [0, 2], [1, 3], [2, 4], [4, 5]];
  for (const [a, b] of undirectedEdges) {
    graph.get(a)?.push(b);
    graph.get(b)?.push(a);
  }

  console.assert(
    JSON.stringify(bfsTraversalOrder(graph, 0)) === JSON.stringify([0, 1, 2, 3, 4, 5]),
    'BFS should visit vertices in non-decreasing distance from 0'
  );

  const hops = shortestHopsFrom(graph, 0);
  console.assert(hops.get(5) === 3, 'vertex 5 should be 3 hops away from 0');
  console.assert(hops.get(3) === 2, 'vertex 3 should be 2 hops away from 0');
  console.assert(bfsShortestDistance(graph, 0, 5) === 3, 'bfsShortestDistance should agree with shortestHopsFrom');
  console.assert(bfsShortestDistance(graph, 0, 99) === -1, 'unreachable vertex should report -1');

  console.assert(
    shortestPathBinaryMatrix([[0, 1], [1, 0]]) === 2,
    'a direct diagonal move should give a path of length 2'
  );
  console.assert(
    shortestPathBinaryMatrix([[0, 0, 0], [1, 1, 0], [1, 1, 0]]) === 4,
    'diagonal moves should shortcut the path to length 4'
  );
  console.assert(shortestPathBinaryMatrix([[1]]) === -1, 'a blocked start cell has no path');

  console.assert(
    orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]) === 4,
    'classic rotting-oranges grid should take 4 minutes'
  );
  console.assert(orangesRotting([[0, 2]]) === 0, 'a grid with no fresh oranges takes 0 minutes');
  console.assert(
    orangesRotting([[2, 1, 1], [0, 0, 0], [1, 1, 0]]) === -1,
    'fresh oranges cut off by empty cells can never rot'
  );

  const dictionaryWithGoal = ['hot', 'dot', 'dog', 'lot', 'log', 'cog'];
  console.assert(
    wordLadderLength('hit', 'cog', dictionaryWithGoal) === 5,
    'hit -> hot -> dot -> dog -> cog is the shortest 5-word ladder'
  );
  const dictionaryWithoutGoal = ['hot', 'dot', 'dog', 'lot', 'log'];
  console.assert(
    wordLadderLength('hit', 'cog', dictionaryWithoutGoal) === 0,
    'if endWord is missing from the word list, no ladder is possible'
  );

  console.log('03-bfs-graphs: all assertions passed');
}
