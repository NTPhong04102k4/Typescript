// Companion code for ./04-mixed-practice-medium.md
// Self-contained: no cross-topic imports.

// LeetCode 56: Merge Intervals -- sort by start, then sweep and extend.
export function mergeIntervals(intervals: readonly number[][]): number[][] {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].map((pair) => [...pair]).sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const curr = sorted[i];
    if (curr[0] <= last[1]) {
      last[1] = Math.max(last[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }
  return merged;
}

// LeetCode 146: LRU Cache -- a Map's insertion order doubles as recency
// order: delete + re-set on access, evict the first (oldest) key on overflow.
export class LRUCache {
  private readonly capacity: number;
  private readonly cache: Map<number, number> = new Map();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key) as number;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}

// LeetCode 207: Course Schedule -- Kahn's algorithm (BFS topological sort).
// If every course can be dequeued at in-degree 0, the graph has no cycle.
export function canFinish(numCourses: number, prerequisites: readonly number[][]): boolean {
  const adjacency: number[][] = Array.from({ length: numCourses }, () => []);
  const inDegree: number[] = new Array(numCourses).fill(0);
  for (const [course, prereq] of prerequisites) {
    adjacency[prereq].push(course);
    inDegree[course]++;
  }

  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  let visited = 0;
  while (queue.length > 0) {
    const curr = queue.shift() as number;
    visited++;
    for (const next of adjacency[curr]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }

  return visited === numCourses;
}

// LeetCode 215: Kth Largest Element in an Array -- straightforward sort.
// (A size-k min-heap or quickselect gets this to O(n log k) / average O(n).)
export function findKthLargest(nums: readonly number[], k: number): number {
  const sorted = [...nums].sort((a, b) => b - a);
  return sorted[k - 1];
}

// LeetCode 3: Longest Substring Without Repeating Characters -- sliding
// window with a last-seen-index map to jump the window start forward.
export function lengthOfLongestSubstring(s: string): number {
  const lastSeenAt = new Map<string, number>();
  let start = 0;
  let maxLength = 0;
  for (let end = 0; end < s.length; end++) {
    const char = s[end];
    const prevIndex = lastSeenAt.get(char);
    if (prevIndex !== undefined && prevIndex >= start) {
      start = prevIndex + 1;
    }
    lastSeenAt.set(char, end);
    maxLength = Math.max(maxLength, end - start + 1);
  }
  return maxLength;
}

// Exercise: implement numIslands(grid) (LeetCode 200) -- DFS flood-fill
// every connected '1' starting from each unvisited land cell.
// Solution:
export function numIslands(grid: readonly string[][]): number {
  const rows = grid.length;
  if (rows === 0) return 0;
  const cols = grid[0].length;
  const visited: boolean[][] = Array.from({ length: rows }, () => new Array(cols).fill(false));
  let islands = 0;

  function flood(r: number, c: number): void {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (visited[r][c] || grid[r][c] === '0') return;
    visited[r][c] = true;
    flood(r + 1, c);
    flood(r - 1, c);
    flood(r, c + 1);
    flood(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1' && !visited[r][c]) {
        islands++;
        flood(r, c);
      }
    }
  }
  return islands;
}

// Exercise: implement productExceptSelf(nums) (LeetCode 238) -- for each
// index, the product of every element except itself, without division.
// Solution:
export function productExceptSelf(nums: readonly number[]): number[] {
  const n = nums.length;
  const result: number[] = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }
  return result;
}

// --- run ---
if (require.main === module) {
  console.assert(
    JSON.stringify(
      mergeIntervals([
        [1, 3],
        [2, 6],
        [8, 10],
        [15, 18],
      ])
    ) ===
      JSON.stringify([
        [1, 6],
        [8, 10],
        [15, 18],
      ]),
    'mergeIntervals should merge overlapping [1,3]/[2,6] into [1,6]'
  );

  const lru = new LRUCache(2);
  lru.put(1, 1);
  lru.put(2, 2);
  console.assert(lru.get(1) === 1, 'lru.get(1) should return 1');
  lru.put(3, 3); // evicts key 2 (least recently used)
  console.assert(lru.get(2) === -1, 'lru.get(2) should return -1 after eviction');
  lru.put(4, 4); // evicts key 1
  console.assert(lru.get(1) === -1, 'lru.get(1) should return -1 after eviction');
  console.assert(lru.get(3) === 3, 'lru.get(3) should return 3');
  console.assert(lru.get(4) === 4, 'lru.get(4) should return 4');

  console.assert(canFinish(2, [[1, 0]]) === true, 'canFinish should be true with a valid order 0 -> 1');
  console.assert(
    canFinish(2, [
      [1, 0],
      [0, 1],
    ]) === false,
    'canFinish should be false when there is a cycle'
  );

  console.assert(findKthLargest([3, 2, 1, 5, 6, 4], 2) === 5, 'findKthLargest should find 5 as the 2nd largest');
  console.assert(
    findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) === 4,
    'findKthLargest should find 4 as the 4th largest'
  );

  console.assert(lengthOfLongestSubstring('abcabcbb') === 3, 'lengthOfLongestSubstring("abcabcbb") should be 3');
  console.assert(lengthOfLongestSubstring('bbbbb') === 1, 'lengthOfLongestSubstring("bbbbb") should be 1');
  console.assert(lengthOfLongestSubstring('pwwkew') === 3, 'lengthOfLongestSubstring("pwwkew") should be 3');

  const grid = [
    ['1', '1', '0', '0'],
    ['1', '1', '0', '0'],
    ['0', '0', '1', '0'],
    ['0', '0', '0', '1'],
  ];
  console.assert(numIslands(grid) === 3, 'numIslands should count 3 separate islands');

  console.assert(
    JSON.stringify(productExceptSelf([1, 2, 3, 4])) === JSON.stringify([24, 12, 8, 6]),
    'productExceptSelf([1,2,3,4]) should be [24,12,8,6]'
  );

  console.log('04-mixed-practice-medium: all assertions passed');
}
