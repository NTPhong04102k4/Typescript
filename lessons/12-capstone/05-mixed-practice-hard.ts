// Companion code for ./05-mixed-practice-hard.md
// Self-contained: no cross-topic imports.

/** Minimal singly linked list node, local to this file. */
export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

/** Builds a node chain from an array; returns null for an empty array. */
export function arrayToList(values: readonly number[]): ListNode | null {
  let head: ListNode | null = null;
  let tail: ListNode | null = null;
  for (const value of values) {
    const node = new ListNode(value);
    if (head === null || tail === null) {
      head = node;
      tail = node;
    } else {
      tail.next = node;
      tail = node;
    }
  }
  return head;
}

/** Collects the values of a node chain into an array, head to tail. */
export function listToArray(head: ListNode | null): number[] {
  const values: number[] = [];
  let current = head;
  while (current !== null) {
    values.push(current.val);
    current = current.next;
  }
  return values;
}

interface HeapItem {
  val: number;
  node: ListNode;
}

/** Array-backed min-heap of { val, node }, ordered by val. Local to this file. */
class ListNodeMinHeap {
  private readonly items: HeapItem[] = [];

  size(): number {
    return this.items.length;
  }

  push(item: HeapItem): void {
    this.items.push(item);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.items[parent].val <= this.items[i].val) break;
      [this.items[parent], this.items[i]] = [this.items[i], this.items[parent]];
      i = parent;
    }
  }

  pop(): HeapItem | undefined {
    if (this.items.length === 0) return undefined;
    const top = this.items[0];
    const last = this.items.pop() as HeapItem;
    if (this.items.length > 0) {
      this.items[0] = last;
      let i = 0;
      const n = this.items.length;
      while (true) {
        const left = i * 2 + 1;
        const right = i * 2 + 2;
        let smallest = i;
        if (left < n && this.items[left].val < this.items[smallest].val) smallest = left;
        if (right < n && this.items[right].val < this.items[smallest].val) smallest = right;
        if (smallest === i) break;
        [this.items[smallest], this.items[i]] = [this.items[i], this.items[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}

// LeetCode 23: Merge k Sorted Lists -- min-heap k-way merge, O(N log k).
export function mergeKLists(lists: ReadonlyArray<ListNode | null>): ListNode | null {
  const heap = new ListNodeMinHeap();
  for (const node of lists) {
    if (node !== null) heap.push({ val: node.val, node });
  }

  const dummy = new ListNode(0);
  let tail = dummy;
  while (heap.size() > 0) {
    const { node } = heap.pop() as HeapItem;
    tail.next = node;
    tail = node;
    if (node.next !== null) heap.push({ val: node.next.val, node: node.next });
  }
  return dummy.next;
}

// LeetCode 42: Trapping Rain Water -- two pointers, track running max from
// each side; water above the shorter side depends only on that side's max.
export function trap(height: readonly number[]): number {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
      right--;
    }
  }
  return water;
}

/** Minimal binary tree node, local to this file. */
export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val: number = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// LeetCode 297: Serialize and Deserialize Binary Tree -- preorder with '#'
// null markers, so the exact shape round-trips.
export function serialize(root: TreeNode | null): string {
  const tokens: string[] = [];
  function walk(node: TreeNode | null): void {
    if (node === null) {
      tokens.push('#');
      return;
    }
    tokens.push(String(node.val));
    walk(node.left);
    walk(node.right);
  }
  walk(root);
  return tokens.join(',');
}

export function deserialize(data: string): TreeNode | null {
  const tokens = data.split(',');
  let index = 0;
  function build(): TreeNode | null {
    const token = tokens[index];
    index++;
    if (token === '#') return null;
    const node = new TreeNode(Number(token));
    node.left = build();
    node.right = build();
    return node;
  }
  return build();
}

// LeetCode 127: Word Ladder -- BFS over the implicit graph of one-letter
// transformations; BFS's level order guarantees the shortest path length.
export function ladderLength(beginWord: string, endWord: string, wordList: readonly string[]): number {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const queue: Array<[string, number]> = [[beginWord, 1]];
  const visited = new Set<string>([beginWord]);

  while (queue.length > 0) {
    const [word, steps] = queue.shift() as [string, number];
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

// LeetCode 84: Largest Rectangle in Histogram -- monotonic increasing stack
// of indices; a shorter bar finalizes every taller bar behind it.
export function largestRectangleArea(heights: readonly number[]): number {
  const stack: number[] = [];
  let maxArea = 0;
  for (let i = 0; i <= heights.length; i++) {
    const currentHeight = i === heights.length ? 0 : heights[i];
    while (stack.length > 0 && heights[stack[stack.length - 1]] > currentHeight) {
      const height = heights[stack.pop() as number];
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }
  return maxArea;
}

// Exercise: implement firstMissingPositive(nums) (LeetCode 41) -- O(n) time,
// O(1) extra space, by placing each value v (1 <= v <= n) at index v - 1.
// Solution:
export function firstMissingPositive(nums: readonly number[]): number {
  const n = nums.length;
  const arr = [...nums];
  for (let i = 0; i < n; i++) {
    while (arr[i] > 0 && arr[i] <= n && arr[arr[i] - 1] !== arr[i]) {
      const target = arr[i] - 1;
      [arr[i], arr[target]] = [arr[target], arr[i]];
    }
  }
  for (let i = 0; i < n; i++) {
    if (arr[i] !== i + 1) return i + 1;
  }
  return n + 1;
}

// --- run ---
if (require.main === module) {
  const merged = mergeKLists([arrayToList([1, 4, 5]), arrayToList([1, 3, 4]), arrayToList([2, 6])]);
  console.assert(
    JSON.stringify(listToArray(merged)) === JSON.stringify([1, 1, 2, 3, 4, 4, 5, 6]),
    'mergeKLists should merge [1,4,5],[1,3,4],[2,6] into [1,1,2,3,4,4,5,6]'
  );

  console.assert(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) === 6, 'trap should compute 6 units of water');
  console.assert(trap([4, 2, 0, 3, 2, 5]) === 9, 'trap should compute 9 units of water');

  const tree = new TreeNode(1, new TreeNode(2), new TreeNode(3, new TreeNode(4), new TreeNode(5)));
  const roundTripped = deserialize(serialize(tree));
  console.assert(roundTripped !== null && roundTripped.val === 1, 'round trip should preserve root value 1');
  console.assert(
    roundTripped?.left?.val === 2 && roundTripped.left?.left === null && roundTripped.left?.right === null,
    'round trip should preserve the leaf node holding 2'
  );
  console.assert(
    roundTripped?.right?.val === 3 && roundTripped.right?.left?.val === 4 && roundTripped.right?.right?.val === 5,
    'round trip should preserve the right subtree shape'
  );

  console.assert(
    ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']) === 5,
    'ladderLength("hit","cog",...) should be 5 (hit->hot->dot->dog->cog)'
  );
  console.assert(
    ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']) === 0,
    'ladderLength should be 0 when endWord is not in the word list'
  );

  console.assert(largestRectangleArea([2, 1, 5, 6, 2, 3]) === 10, 'largestRectangleArea should be 10');

  console.assert(firstMissingPositive([1, 2, 0]) === 3, 'firstMissingPositive([1,2,0]) should be 3');
  console.assert(firstMissingPositive([3, 4, -1, 1]) === 2, 'firstMissingPositive([3,4,-1,1]) should be 2');
  console.assert(firstMissingPositive([7, 8, 9, 11, 12]) === 1, 'firstMissingPositive([7,8,9,11,12]) should be 1');

  console.log('05-mixed-practice-hard: all assertions passed');
}
