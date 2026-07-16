// Companion code for ./03-mixed-practice-easy.md
// Self-contained: local ListNode/TreeNode types instead of cross-topic imports.

// LeetCode 1: Two Sum -- single-pass hash map lookup for the complement.
export function twoSum(nums: readonly number[], target: number): number[] {
  const seenAt = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    const complementIndex = seenAt.get(complement);
    if (complementIndex !== undefined) return [complementIndex, i];
    seenAt.set(nums[i], i);
  }
  return [];
}

// LeetCode 20: Valid Parentheses -- stack of expected closers.
export function isValidParentheses(s: string): boolean {
  const stack: string[] = [];
  const closerFor: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else {
      if (stack.pop() !== closerFor[char]) return false;
    }
  }
  return stack.length === 0;
}

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

// LeetCode 206: Reverse Linked List -- iterative pointer rewiring.
export function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;
  while (curr !== null) {
    const next: ListNode | null = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
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

// LeetCode 104: Maximum Depth of Binary Tree -- combine children's depths.
export function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

/** Minimal array-backed min-heap, local to this file. */
export class MinHeap {
  private readonly items: number[] = [];

  size(): number {
    return this.items.length;
  }

  peek(): number | undefined {
    return this.items[0];
  }

  push(value: number): void {
    this.items.push(value);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.items[parent] <= this.items[i]) break;
      [this.items[parent], this.items[i]] = [this.items[i], this.items[parent]];
      i = parent;
    }
  }

  pop(): number | undefined {
    if (this.items.length === 0) return undefined;
    const top = this.items[0];
    const last = this.items.pop() as number;
    if (this.items.length > 0) {
      this.items[0] = last;
      let i = 0;
      const n = this.items.length;
      while (true) {
        const left = i * 2 + 1;
        const right = i * 2 + 2;
        let smallest = i;
        if (left < n && this.items[left] < this.items[smallest]) smallest = left;
        if (right < n && this.items[right] < this.items[smallest]) smallest = right;
        if (smallest === i) break;
        [this.items[smallest], this.items[i]] = [this.items[i], this.items[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}

// LeetCode 703: Kth Largest Element in a Stream -- keep a min-heap of size k;
// its root is always the k-th largest value seen so far.
export class KthLargest {
  private readonly k: number;
  private readonly heap: MinHeap = new MinHeap();

  constructor(k: number, nums: readonly number[]) {
    this.k = k;
    for (const num of nums) this.add(num);
  }

  add(val: number): number {
    this.heap.push(val);
    if (this.heap.size() > this.k) this.heap.pop();
    return this.heap.peek() as number;
  }
}

// Exercise: implement invertTree(root) (LeetCode 226) -- recursively swap
// every node's left and right children.
// Solution:
export function invertTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  const left = invertTree(root.left);
  const right = invertTree(root.right);
  root.left = right;
  root.right = left;
  return root;
}

// Exercise: implement mergeTwoLists(l1, l2) (LeetCode 21) -- merge two
// sorted lists into one sorted list using a dummy head.
// Solution:
export function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy;
  let a = l1;
  let b = l2;
  while (a !== null && b !== null) {
    if (a.val <= b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a ?? b;
  return dummy.next;
}

// --- run ---
if (require.main === module) {
  console.assert(
    JSON.stringify(twoSum([2, 7, 11, 15], 9)) === JSON.stringify([0, 1]),
    'twoSum should find indices [0,1] for target 9'
  );

  console.assert(isValidParentheses('()[]{}') === true, '()[]{} should be valid');
  console.assert(isValidParentheses('(]') === false, '(] should be invalid');
  console.assert(isValidParentheses('([)]') === false, '([)] should be invalid');
  console.assert(isValidParentheses('{[]}') === true, '{[]} should be valid');

  const reversed = reverseList(arrayToList([1, 2, 3, 4, 5]));
  console.assert(
    JSON.stringify(listToArray(reversed)) === JSON.stringify([5, 4, 3, 2, 1]),
    'reverseList should reverse [1,2,3,4,5] to [5,4,3,2,1]'
  );

  const tree = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
  console.assert(maxDepth(tree) === 3, 'maxDepth of [3,9,20,null,null,15,7] should be 3');
  console.assert(maxDepth(null) === 0, 'maxDepth of an empty tree should be 0');

  const kthLargest = new KthLargest(3, [4, 5, 8, 2]);
  console.assert(kthLargest.add(3) === 4, 'add(3) should return 4');
  console.assert(kthLargest.add(5) === 5, 'add(5) should return 5');
  console.assert(kthLargest.add(10) === 5, 'add(10) should return 5');
  console.assert(kthLargest.add(9) === 8, 'add(9) should return 8');
  console.assert(kthLargest.add(4) === 8, 'add(4) should return 8');

  const inverted = invertTree(new TreeNode(2, new TreeNode(1), new TreeNode(3)));
  console.assert(
    inverted !== null && inverted.left?.val === 3 && inverted.right?.val === 1,
    'invertTree([2,1,3]) should swap children to [2,3,1]'
  );

  const merged = mergeTwoLists(arrayToList([1, 2, 4]), arrayToList([1, 3, 4]));
  console.assert(
    JSON.stringify(listToArray(merged)) === JSON.stringify([1, 1, 2, 3, 4, 4]),
    'mergeTwoLists([1,2,4],[1,3,4]) should be [1,1,2,3,4,4]'
  );

  console.log('03-mixed-practice-easy: all assertions passed');
}
