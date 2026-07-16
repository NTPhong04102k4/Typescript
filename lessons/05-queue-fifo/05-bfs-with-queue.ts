// Companion code for ./05-bfs-with-queue.md

import { LinkedListQueue } from './02-implementing-queue';

export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

/**
 * Breadth-first shortest path over an unweighted graph given as an
 * adjacency map. BFS explores the graph one "ring" at a time via the
 * queue, so the first time `target` is reached is guaranteed to be via a
 * shortest path.
 */
export function bfsShortestPath(
  graph: ReadonlyMap<string, readonly string[]>,
  start: string,
  target: string
): string[] | null {
  if (start === target) return [start];

  const visited = new Set<string>([start]);
  const queue = new LinkedListQueue<string[]>();
  queue.enqueue([start]);

  while (!queue.isEmpty()) {
    const path = queue.dequeue() as string[];
    const node = path[path.length - 1];

    for (const neighbor of graph.get(node) ?? []) {
      if (visited.has(neighbor)) continue;
      const nextPath = [...path, neighbor];
      if (neighbor === target) return nextPath;
      visited.add(neighbor);
      queue.enqueue(nextPath);
    }
  }

  return null;
}

// LeetCode 102: Binary Tree Level Order Traversal (Medium)
export function levelOrder(root: TreeNode | null): number[][] {
  if (root === null) return [];

  const result: number[][] = [];
  const queue = new LinkedListQueue<TreeNode>();
  queue.enqueue(root);

  while (!queue.isEmpty()) {
    const levelSize = queue.size;
    const level: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.dequeue() as TreeNode;
      level.push(node.val);
      if (node.left !== null) queue.enqueue(node.left);
      if (node.right !== null) queue.enqueue(node.right);
    }

    result.push(level);
  }

  return result;
}

// LeetCode 199: Binary Tree Right Side View (Medium)
export function rightSideView(root: TreeNode | null): number[] {
  if (root === null) return [];

  const result: number[] = [];
  const queue = new LinkedListQueue<TreeNode>();
  queue.enqueue(root);

  while (!queue.isEmpty()) {
    const levelSize = queue.size;

    for (let i = 0; i < levelSize; i++) {
      const node = queue.dequeue() as TreeNode;
      if (i === levelSize - 1) result.push(node.val);
      if (node.left !== null) queue.enqueue(node.left);
      if (node.right !== null) queue.enqueue(node.right);
    }
  }

  return result;
}

// LeetCode 994: Rotting Oranges (Medium)
// Multi-source BFS: every initially rotten orange is a level-0 source.
// Each BFS level corresponds to one elapsed minute.
export function orangesRotting(grid: number[][]): number {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  const queue = new LinkedListQueue<[number, number]>();
  let freshCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.enqueue([r, c]);
      else if (grid[r][c] === 1) freshCount++;
    }
  }

  if (freshCount === 0) return 0;

  const directions: ReadonlyArray<[number, number]> = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let minutes = 0;

  while (!queue.isEmpty() && freshCount > 0) {
    const levelSize = queue.size;

    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.dequeue() as [number, number];

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr][nc] !== 1) continue;
        grid[nr][nc] = 2;
        freshCount--;
        queue.enqueue([nr, nc]);
      }
    }

    minutes++;
  }

  return freshCount === 0 ? minutes : -1;
}

// Exercise: find the minimum depth of a binary tree using BFS, stopping
// at the first leaf encountered (this also solves LeetCode 111, Easy).
// Solution:
export function minDepth(root: TreeNode | null): number {
  if (root === null) return 0;

  const queue = new LinkedListQueue<[TreeNode, number]>();
  queue.enqueue([root, 1]);

  while (!queue.isEmpty()) {
    const [node, depth] = queue.dequeue() as [TreeNode, number];
    if (node.left === null && node.right === null) return depth;
    if (node.left !== null) queue.enqueue([node.left, depth + 1]);
    if (node.right !== null) queue.enqueue([node.right, depth + 1]);
  }

  return 0;
}

// --- run ---
if (require.main === module) {
  const graph = new Map<string, string[]>([
    ['A', ['B', 'C']],
    ['B', ['A', 'D']],
    ['C', ['A', 'D']],
    ['D', ['B', 'C', 'E']],
    ['E', ['D']],
  ]);
  const path = bfsShortestPath(graph, 'A', 'E');
  console.assert(path !== null && path.length === 4, 'BFS finds a shortest A -> E path (4 nodes)');

  const tree: TreeNode = {
    val: 1,
    left: { val: 2, left: { val: 4, left: null, right: null }, right: null },
    right: { val: 3, left: null, right: null },
  };
  console.assert(
    JSON.stringify(levelOrder(tree)) === JSON.stringify([[1], [2, 3], [4]]),
    'level order groups node values by depth'
  );
  console.assert(
    JSON.stringify(rightSideView(tree)) === JSON.stringify([1, 3, 4]),
    'right side view keeps the last node visited per level'
  );
  console.assert(minDepth(tree) === 2, 'shortest path to a leaf is via node 3, depth 2');

  const grid = [
    [2, 1, 1],
    [1, 1, 0],
    [0, 1, 1],
  ];
  console.assert(orangesRotting(grid) === 4, 'LeetCode 994 example');

  console.log('All lesson 05 checks passed.');
}
