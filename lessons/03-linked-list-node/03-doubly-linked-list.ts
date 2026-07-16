// See ./03-doubly-linked-list.md for the full lesson.

/** Struct-like doubly linked node: value plus pointers to both neighbors. */
export class DoublyListNode<T> {
  value: T;
  prev: DoublyListNode<T> | null;
  next: DoublyListNode<T> | null;

  constructor(
    value: T,
    prev: DoublyListNode<T> | null = null,
    next: DoublyListNode<T> | null = null
  ) {
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
}

/** Generic doubly linked list: O(1) push/pop at both ends. */
export class DoublyLinkedList<T> implements Iterable<T> {
  private head: DoublyListNode<T> | null = null;
  private tail: DoublyListNode<T> | null = null;
  private length = 0;

  get size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  pushFront(value: T): void {
    const node = new DoublyListNode(value, null, this.head);
    if (this.head !== null) {
      this.head.prev = node;
    }
    this.head = node;
    if (this.tail === null) {
      this.tail = node;
    }
    this.length++;
  }

  pushBack(value: T): void {
    const node = new DoublyListNode(value, this.tail, null);
    if (this.tail !== null) {
      this.tail.next = node;
    }
    this.tail = node;
    if (this.head === null) {
      this.head = node;
    }
    this.length++;
  }

  popFront(): T | undefined {
    if (this.head === null) {
      return undefined;
    }
    const node = this.head;
    this.head = node.next;
    if (this.head !== null) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }
    this.length--;
    return node.value;
  }

  // O(1): the tail's `prev` pointer removes the need to walk from head.
  popBack(): T | undefined {
    if (this.tail === null) {
      return undefined;
    }
    const node = this.tail;
    this.tail = node.prev;
    if (this.tail !== null) {
      this.tail.next = null;
    } else {
      this.head = null;
    }
    this.length--;
    return node.value;
  }

  // Walks from whichever end is nearer to `index`.
  private nodeAt(index: number): DoublyListNode<T> | null {
    if (index < 0 || index >= this.length) {
      return null;
    }
    if (index <= this.length / 2) {
      let current = this.head;
      for (let i = 0; i < index && current !== null; i++) {
        current = current.next;
      }
      return current;
    }
    let current = this.tail;
    for (let i = this.length - 1; i > index && current !== null; i--) {
      current = current.prev;
    }
    return current;
  }

  get(index: number): T | undefined {
    return this.nodeAt(index)?.value;
  }

  insertAt(index: number, value: T): void {
    if (index < 0 || index > this.length) {
      throw new RangeError(`insertAt index ${index} out of bounds`);
    }
    if (index === 0) {
      this.pushFront(value);
      return;
    }
    if (index === this.length) {
      this.pushBack(value);
      return;
    }
    const target = this.nodeAt(index)!;
    const before = target.prev!;
    const node = new DoublyListNode(value, before, target);
    before.next = node;
    target.prev = node;
    this.length++;
  }

  removeAt(index: number): T | undefined {
    const node = this.nodeAt(index);
    if (node === null) {
      return undefined;
    }
    if (node.prev !== null) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }
    if (node.next !== null) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
    this.length--;
    return node.value;
  }

  toArray(): T[] {
    const values: T[] = [];
    let current = this.head;
    while (current !== null) {
      values.push(current.value);
      current = current.next;
    }
    return values;
  }

  /** Walks from `tail` via `prev`, demonstrating reverse traversal. */
  reverseToArray(): T[] {
    const values: T[] = [];
    let current = this.tail;
    while (current !== null) {
      values.push(current.value);
      current = current.prev;
    }
    return values;
  }

  [Symbol.iterator](): Iterator<T> {
    let current = this.head;
    return {
      next(): IteratorResult<T> {
        if (current === null) {
          return { value: undefined, done: true };
        }
        const value = current.value;
        current = current.next;
        return { value, done: false };
      },
    };
  }
}

// LeetCode 430. Flatten a Multilevel Doubly Linked List (Medium)
// Node shape: value + prev + next + an optional child sub-list.
export class MultilevelDoublyListNode {
  val: number;
  prev: MultilevelDoublyListNode | null;
  next: MultilevelDoublyListNode | null;
  child: MultilevelDoublyListNode | null;

  constructor(val: number) {
    this.val = val;
    this.prev = null;
    this.next = null;
    this.child = null;
  }
}

export function flattenMultilevelList(
  head: MultilevelDoublyListNode | null
): MultilevelDoublyListNode | null {
  let current: MultilevelDoublyListNode | null = head;
  while (current !== null) {
    if (current.child !== null) {
      const next = current.next;
      const child = current.child;

      current.child = null;
      current.next = child;
      child.prev = current;

      let childTail = child;
      while (childTail.next !== null) {
        childTail = childTail.next;
      }
      childTail.next = next;
      if (next !== null) {
        next.prev = childTail;
      }
    }
    current = current.next;
  }
  return head;
}

// LeetCode 138. Copy List with Random Pointer (Medium)
// Node shape: value + next + a random pointer to any node (or null).
export class RandomListNode {
  val: number;
  next: RandomListNode | null;
  random: RandomListNode | null;

  constructor(val: number) {
    this.val = val;
    this.next = null;
    this.random = null;
  }
}

export function copyRandomList(head: RandomListNode | null): RandomListNode | null {
  if (head === null) {
    return null;
  }
  const clones = new Map<RandomListNode, RandomListNode>();

  let current: RandomListNode | null = head;
  while (current !== null) {
    clones.set(current, new RandomListNode(current.val));
    current = current.next;
  }

  current = head;
  while (current !== null) {
    const clone = clones.get(current)!;
    clone.next = current.next !== null ? clones.get(current.next)! : null;
    clone.random = current.random !== null ? clones.get(current.random)! : null;
    current = current.next;
  }

  return clones.get(head)!;
}

// LeetCode 1472. Design Browser History (Medium)
// Reuses DoublyListNode<string> directly as the history chain.
export class BrowserHistory {
  private current: DoublyListNode<string>;

  constructor(homepage: string) {
    this.current = new DoublyListNode(homepage);
  }

  visit(url: string): void {
    const node = new DoublyListNode(url, this.current, null);
    this.current.next = node;
    this.current = node;
  }

  back(steps: number): string {
    let remaining = steps;
    while (remaining > 0 && this.current.prev !== null) {
      this.current = this.current.prev;
      remaining--;
    }
    return this.current.value;
  }

  forward(steps: number): string {
    let remaining = steps;
    while (remaining > 0 && this.current.next !== null) {
      this.current = this.current.next;
      remaining--;
    }
    return this.current.value;
  }
}

// Exercise: remove an arbitrary node from a doubly linked chain in O(1),
// given only a reference to the node itself. This is the trick the LRU
// cache in lesson 07 relies on for O(1) eviction.
// Solution:
export function spliceOut<T>(node: DoublyListNode<T>): void {
  if (node.prev !== null) {
    node.prev.next = node.next;
  }
  if (node.next !== null) {
    node.next.prev = node.prev;
  }
  node.prev = null;
  node.next = null;
}

// Exercise: using both `prev` and `next`, check whether a doubly linked
// chain reads the same forwards and backwards, without copying to an array.
// Solution:
export function isPalindromeDoublyList<T>(head: DoublyListNode<T> | null): boolean {
  if (head === null) {
    return true;
  }
  let tail = head;
  while (tail.next !== null) {
    tail = tail.next;
  }

  let left: DoublyListNode<T> | null = head;
  let right: DoublyListNode<T> | null = tail;
  while (left !== null && right !== null && left !== right && left.prev !== right) {
    if (left.value !== right.value) {
      return false;
    }
    left = left.next;
    right = right.prev;
  }
  return true;
}

// --- run ---
if (require.main === module) {
  const list = new DoublyLinkedList<number>();
  list.pushBack(1);
  list.pushBack(2);
  list.pushBack(3);
  list.pushFront(0);
  console.log("list:", list.toArray());
  console.assert(JSON.stringify(list.toArray()) === JSON.stringify([0, 1, 2, 3]), "pushFront/pushBack order");
  console.assert(JSON.stringify(list.reverseToArray()) === JSON.stringify([3, 2, 1, 0]), "reverseToArray via prev");

  console.assert(list.get(1) === 1, "get(1) should be 1");
  console.assert(list.get(3) === 3, "get(3) should walk from tail side");

  list.insertAt(2, 99);
  console.assert(JSON.stringify(list.toArray()) === JSON.stringify([0, 1, 99, 2, 3]), "insertAt(2, 99)");
  const removed = list.removeAt(2);
  console.assert(removed === 99, "removeAt(2) should return 99");
  console.assert(JSON.stringify(list.toArray()) === JSON.stringify([0, 1, 2, 3]), "removeAt restores order");

  console.assert(list.popBack() === 3, "popBack should return 3 in O(1)");
  console.assert(list.popFront() === 0, "popFront should return 0");
  console.assert(JSON.stringify(list.toArray()) === JSON.stringify([1, 2]), "list after pops");
  console.assert([...list].join(",") === "1,2", "Symbol.iterator should support for...of / spread");

  // flattenMultilevelList: 1 - 2 - 3 with a child list (4 - 5) hanging off 2.
  const n1 = new MultilevelDoublyListNode(1);
  const n2 = new MultilevelDoublyListNode(2);
  const n3 = new MultilevelDoublyListNode(3);
  const n4 = new MultilevelDoublyListNode(4);
  const n5 = new MultilevelDoublyListNode(5);
  n1.next = n2;
  n2.prev = n1;
  n2.next = n3;
  n3.prev = n2;
  n2.child = n4;
  n4.next = n5;
  n5.prev = n4;
  const flatHead = flattenMultilevelList(n1);
  const flatValues: number[] = [];
  for (let n = flatHead; n !== null; n = n.next) flatValues.push(n.val);
  console.assert(flatValues.join(",") === "1,2,4,5,3", "flattenMultilevelList should splice the child list in place");

  // copyRandomList: two nodes, second node's random points back to the first.
  const r1 = new RandomListNode(7);
  const r2 = new RandomListNode(13);
  r1.next = r2;
  r2.random = r1;
  const copyHead = copyRandomList(r1)!;
  console.assert(copyHead !== r1, "copyRandomList should clone, not alias, the head");
  console.assert(copyHead.next!.random === copyHead, "cloned random pointer should point into the cloned list");
  console.assert(copyHead.next!.random !== r1, "cloned random pointer should not alias the original list");

  // BrowserHistory: worked example from LeetCode 1472's problem statement.
  const history = new BrowserHistory("leetcode.com");
  history.visit("google.com");
  history.visit("facebook.com");
  history.visit("youtube.com");
  console.assert(history.back(1) === "facebook.com", "back(1) should return facebook.com");
  console.assert(history.back(1) === "google.com", "back(1) again should return google.com");
  console.assert(history.forward(1) === "facebook.com", "forward(1) should return facebook.com");
  history.visit("linkedin.com");
  console.assert(history.forward(2) === "linkedin.com", "forward past the truncated branch should clamp at linkedin.com");
  console.assert(history.back(2) === "google.com", "back(2) should return google.com");
  console.assert(history.back(7) === "leetcode.com", "back(7) should clamp at the homepage");

  // spliceOut: remove the middle node (2) from 1 <-> 2 <-> 3.
  const a = new DoublyListNode(1);
  const b = new DoublyListNode(2);
  const c = new DoublyListNode(3);
  a.next = b;
  b.prev = a;
  b.next = c;
  c.prev = b;
  spliceOut(b);
  console.assert(a.next === c && c.prev === a, "spliceOut should relink neighbors around the removed node");

  console.assert(isPalindromeDoublyList(listFrom([1, 2, 3, 2, 1])) === true, "1,2,3,2,1 is a palindrome");
  console.assert(isPalindromeDoublyList(listFrom([1, 2, 2, 1])) === true, "1,2,2,1 is a palindrome");
  console.assert(isPalindromeDoublyList(listFrom([1, 2, 3])) === false, "1,2,3 is not a palindrome");

  console.log("03-doubly-linked-list checks passed");
}

// Small local helper for the run block only: builds a raw DoublyListNode
// chain (head returned) from an array, wiring prev/next both ways.
function listFrom<T>(values: T[]): DoublyListNode<T> | null {
  let head: DoublyListNode<T> | null = null;
  let tail: DoublyListNode<T> | null = null;
  for (const value of values) {
    const node = new DoublyListNode(value, tail, null);
    if (tail !== null) {
      tail.next = node;
    } else {
      head = node;
    }
    tail = node;
  }
  return head;
}
