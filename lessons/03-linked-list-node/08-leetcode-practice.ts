// See ./08-leetcode-practice.md for the full lesson.

import { ListNode, arrayToList, listToArray } from "./01-node-fundamentals";
import { findMiddleFastSlow } from "./04-fast-slow-pointers";
import { reverseIterative } from "./05-reversal";
import { DoublyListNode } from "./03-doubly-linked-list";

// LeetCode 160. Intersection of Two Linked Lists (Easy)
// Each pointer walks its own list, then switches to the *other* list's
// head once it runs out. Both pointers then cover lenA + lenB nodes total
// before meeting at the intersection node (or at null, together, if the
// lists never intersect).
export function getIntersectionNode(
  headA: ListNode<number> | null,
  headB: ListNode<number> | null
): ListNode<number> | null {
  if (headA === null || headB === null) {
    return null;
  }
  let a: ListNode<number> | null = headA;
  let b: ListNode<number> | null = headB;
  while (a !== b) {
    a = a !== null ? a.next : headB;
    b = b !== null ? b.next : headA;
  }
  return a;
}

// LeetCode 19. Remove Nth Node From End of List (Medium)
// A dummy head absorbs the edge case of removing the real head. `fast`
// gets an n-step head start so `slow` lands on the node just before the
// target once `fast` reaches the last node.
export function removeNthFromEnd(head: ListNode<number> | null, n: number): ListNode<number> | null {
  const dummy = new ListNode<number>(0, head);
  let fast: ListNode<number> | null = dummy;
  for (let i = 0; i < n; i++) {
    fast = fast!.next;
  }
  let slow = dummy;
  while (fast!.next !== null) {
    fast = fast!.next;
    slow = slow.next!;
  }
  slow.next = slow.next!.next;
  return dummy.next;
}

// LeetCode 86. Partition List (Medium)
// Build two chains while walking the input once — one for values < x, one
// for values >= x — preserving each chain's relative order, then join
// the first chain's tail to the second chain's head.
export function partitionList(head: ListNode<number> | null, x: number): ListNode<number> | null {
  const lessDummy = new ListNode<number>(0);
  const greaterOrEqualDummy = new ListNode<number>(0);
  let lessTail = lessDummy;
  let greaterOrEqualTail = greaterOrEqualDummy;

  let current = head;
  while (current !== null) {
    if (current.value < x) {
      lessTail.next = current;
      lessTail = current;
    } else {
      greaterOrEqualTail.next = current;
      greaterOrEqualTail = current;
    }
    current = current.next;
  }
  greaterOrEqualTail.next = null;
  lessTail.next = greaterOrEqualDummy.next;
  return lessDummy.next;
}

// LeetCode 143. Reorder List (Medium)
// L0->L1->...->Ln becomes L0->Ln->L1->Ln-1->...: find the middle (lesson
// 04), reverse the second half (lesson 05), then weave the two halves
// together one node at a time. Mutates the list in place, like the
// original problem requires.
export function reorderList(head: ListNode<number> | null): void {
  if (head === null || head.next === null) {
    return;
  }
  const middle = findMiddleFastSlow(head)!;
  const secondHead = middle.next;
  middle.next = null;
  const secondReversed = reverseIterative(secondHead);

  let first: ListNode<number> | null = head;
  let second: ListNode<number> | null = secondReversed;
  while (second !== null) {
    const firstNext = first!.next;
    const secondNext = second.next;
    first!.next = second;
    second.next = firstNext;
    first = firstNext;
    second = secondNext;
  }
}

// LeetCode 61. Rotate List (Medium)
// Link the tail back to the head to make the list circular, walk to the
// node that will become the new tail (length - k % length steps from the
// old head), then cut the circle there.
export function rotateRight(head: ListNode<number> | null, k: number): ListNode<number> | null {
  if (head === null || head.next === null || k === 0) {
    return head;
  }
  let length = 1;
  let tail = head;
  while (tail.next !== null) {
    tail = tail.next;
    length++;
  }

  const shift = k % length;
  if (shift === 0) {
    return head;
  }

  tail.next = head;
  const stepsToNewTail = length - shift;
  let newTail = head;
  for (let i = 1; i < stepsToNewTail; i++) {
    newTail = newTail.next!;
  }
  const newHead = newTail.next!;
  newTail.next = null;
  return newHead;
}

// Exercise: solve LeetCode 82. Remove Duplicates from Sorted List II by
// dropping *every* node whose value repeats, unlike lesson 02's
// `removeDuplicatesFromSortedList` (83), which keeps one copy of each
// repeated value.
// Solution:
export function deleteDuplicatesAll(head: ListNode<number> | null): ListNode<number> | null {
  const dummy = new ListNode<number>(0, head);
  let prev = dummy;
  let current = head;
  while (current !== null) {
    if (current.next !== null && current.next.value === current.value) {
      const duplicateValue = current.value;
      while (current !== null && current.value === duplicateValue) {
        current = current.next;
      }
      prev.next = current;
    } else {
      prev = current;
      current = current.next;
    }
  }
  return dummy.next;
}

/** A bucket groups every key currently sharing the same `count`. */
interface CountBucket {
  count: number;
  keys: Set<string>;
}

/** Returns some key from a non-empty set (the first in insertion order). */
function anyKey(keys: Set<string>): string {
  for (const key of keys) {
    return key;
  }
  return "";
}

// Exercise: solve LeetCode 432. All O`one Data Structure, extending
// lesson 07's "node + map" idea from one node per key to one node per
// distinct *count*, each holding the set of keys sharing it. The bucket
// list stays sorted by ascending count from `head` to `tail`, so
// getMaxKey/getMinKey are just a `tail`/`head` read.
// Solution:
export class AllOne {
  private keyToBucket = new Map<string, DoublyListNode<CountBucket>>();
  private head: DoublyListNode<CountBucket> | null = null; // smallest count
  private tail: DoublyListNode<CountBucket> | null = null; // largest count

  inc(key: string): void {
    const oldBucket = this.keyToBucket.get(key);
    if (oldBucket === undefined) {
      const target =
        this.head !== null && this.head.value.count === 1
          ? this.head
          : this.insertBucketBefore(1, this.head);
      target.value.keys.add(key);
      this.keyToBucket.set(key, target);
      return;
    }

    const newCount = oldBucket.value.count + 1;
    const nextBucket = oldBucket.next;
    const target =
      nextBucket !== null && nextBucket.value.count === newCount
        ? nextBucket
        : this.insertBucketAfter(newCount, oldBucket);
    target.value.keys.add(key);
    this.keyToBucket.set(key, target);

    oldBucket.value.keys.delete(key);
    if (oldBucket.value.keys.size === 0) {
      this.removeBucket(oldBucket);
    }
  }

  dec(key: string): void {
    const oldBucket = this.keyToBucket.get(key);
    if (oldBucket === undefined) {
      return;
    }

    if (oldBucket.value.count === 1) {
      oldBucket.value.keys.delete(key);
      this.keyToBucket.delete(key);
      if (oldBucket.value.keys.size === 0) {
        this.removeBucket(oldBucket);
      }
      return;
    }

    const newCount = oldBucket.value.count - 1;
    const prevBucket = oldBucket.prev;
    const target =
      prevBucket !== null && prevBucket.value.count === newCount
        ? prevBucket
        : this.insertBucketBefore(newCount, oldBucket);
    target.value.keys.add(key);
    this.keyToBucket.set(key, target);

    oldBucket.value.keys.delete(key);
    if (oldBucket.value.keys.size === 0) {
      this.removeBucket(oldBucket);
    }
  }

  getMaxKey(): string {
    return this.tail !== null ? anyKey(this.tail.value.keys) : "";
  }

  getMinKey(): string {
    return this.head !== null ? anyKey(this.head.value.keys) : "";
  }

  // Inserts a fresh bucket for `count` immediately before `before` (or at
  // the tail, if `before` is null).
  private insertBucketBefore(
    count: number,
    before: DoublyListNode<CountBucket> | null
  ): DoublyListNode<CountBucket> {
    const node = new DoublyListNode<CountBucket>({ count, keys: new Set<string>() });
    const prev = before !== null ? before.prev : this.tail;
    node.prev = prev;
    node.next = before;
    if (prev !== null) {
      prev.next = node;
    } else {
      this.head = node;
    }
    if (before !== null) {
      before.prev = node;
    } else {
      this.tail = node;
    }
    return node;
  }

  private insertBucketAfter(
    count: number,
    after: DoublyListNode<CountBucket>
  ): DoublyListNode<CountBucket> {
    return this.insertBucketBefore(count, after.next);
  }

  private removeBucket(node: DoublyListNode<CountBucket>): void {
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
    node.prev = null;
    node.next = null;
  }
}

// --- run ---
if (require.main === module) {
  // getIntersectionNode: LeetCode 160 example 1 — shared tail [8,4,5],
  // listA = [4,1,8,4,5] (skipA=2), listB = [5,6,1,8,4,5] (skipB=3).
  const c3 = new ListNode(5);
  const c2 = new ListNode(4, c3);
  const c1 = new ListNode(8, c2);
  const a2 = new ListNode(1, c1);
  const a1 = new ListNode(4, a2);
  const b3 = new ListNode(1, c1);
  const b2 = new ListNode(6, b3);
  const b1 = new ListNode(5, b2);
  const intersection = getIntersectionNode(a1, b1);
  console.assert(intersection === c1, "getIntersectionNode should return the shared node holding 8");
  console.assert(
    getIntersectionNode(arrayToList([2, 4]), arrayToList([1, 5])) === null,
    "getIntersectionNode should return null for disjoint lists"
  );

  // removeNthFromEnd: [1,2,3,4,5], n=2 -> [1,2,3,5]
  const removedNth = removeNthFromEnd(arrayToList([1, 2, 3, 4, 5]), 2);
  console.assert(
    JSON.stringify(listToArray(removedNth)) === JSON.stringify([1, 2, 3, 5]),
    "removeNthFromEnd(2) should drop the 2nd-from-last node"
  );
  // Edge case: removing the only node.
  const removedOnly = removeNthFromEnd(arrayToList([1]), 1);
  console.assert(JSON.stringify(listToArray(removedOnly)) === JSON.stringify([]), "removing the only node empties the list");

  // partitionList: [1,4,3,2,5,2], x=3 -> [1,2,2,4,3,5]
  const partitioned = partitionList(arrayToList([1, 4, 3, 2, 5, 2]), 3);
  console.assert(
    JSON.stringify(listToArray(partitioned)) === JSON.stringify([1, 2, 2, 4, 3, 5]),
    "partitionList should keep < x before >= x, preserving relative order"
  );

  // reorderList: [1,2,3,4] -> [1,4,2,3] (even length)
  const evenReorder = arrayToList([1, 2, 3, 4]);
  reorderList(evenReorder);
  console.assert(JSON.stringify(listToArray(evenReorder)) === JSON.stringify([1, 4, 2, 3]), "reorderList([1,2,3,4])");
  // reorderList: [1,2,3,4,5] -> [1,5,2,4,3] (odd length)
  const oddReorder = arrayToList([1, 2, 3, 4, 5]);
  reorderList(oddReorder);
  console.assert(JSON.stringify(listToArray(oddReorder)) === JSON.stringify([1, 5, 2, 4, 3]), "reorderList([1,2,3,4,5])");

  // rotateRight: [1,2,3,4,5], k=2 -> [4,5,1,2,3]
  const rotated = rotateRight(arrayToList([1, 2, 3, 4, 5]), 2);
  console.assert(JSON.stringify(listToArray(rotated)) === JSON.stringify([4, 5, 1, 2, 3]), "rotateRight(k=2)");
  // rotateRight with k larger than the length: [0,1,2], k=4 -> [2,0,1]
  const rotatedWrap = rotateRight(arrayToList([0, 1, 2]), 4);
  console.assert(JSON.stringify(listToArray(rotatedWrap)) === JSON.stringify([2, 0, 1]), "rotateRight(k=4) on length 3");

  // deleteDuplicatesAll: [1,2,3,3,4,4,5] -> [1,2,5]
  const dedupAll = deleteDuplicatesAll(arrayToList([1, 2, 3, 3, 4, 4, 5]));
  console.assert(JSON.stringify(listToArray(dedupAll)) === JSON.stringify([1, 2, 5]), "deleteDuplicatesAll should drop every repeated value");
  // Edge case: duplicates run through the head.
  const dedupHead = deleteDuplicatesAll(arrayToList([1, 1, 1, 2, 3]));
  console.assert(JSON.stringify(listToArray(dedupHead)) === JSON.stringify([2, 3]), "deleteDuplicatesAll should handle duplicates at the head");

  // AllOne: worked example following LeetCode 432's problem statement,
  // extended with dec() calls back down to an empty structure.
  const allOne = new AllOne();
  allOne.inc("hello");
  allOne.inc("hello");
  console.assert(allOne.getMaxKey() === "hello", 'getMaxKey should be "hello"');
  console.assert(allOne.getMinKey() === "hello", 'getMinKey should be "hello"');
  allOne.inc("leet");
  console.assert(allOne.getMaxKey() === "hello", 'getMaxKey should still be "hello" (count 2)');
  console.assert(allOne.getMinKey() === "leet", 'getMinKey should be "leet" (count 1)');

  allOne.dec("hello"); // hello: 2 -> 1, joins leet's bucket
  console.assert(allOne.getMaxKey() === "leet", 'getMaxKey should be "leet" once both keys have count 1');
  console.assert(allOne.getMinKey() === "leet", 'getMinKey should be "leet" once both keys have count 1');

  allOne.dec("leet"); // leet: 1 -> removed
  console.assert(allOne.getMaxKey() === "hello", 'getMaxKey should be "hello" after leet is removed');
  console.assert(allOne.getMinKey() === "hello", 'getMinKey should be "hello" after leet is removed');

  allOne.dec("hello"); // hello: 1 -> removed, structure now empty
  console.assert(allOne.getMaxKey() === "", "getMaxKey on an empty structure should be an empty string");
  console.assert(allOne.getMinKey() === "", "getMinKey on an empty structure should be an empty string");

  console.log("08-leetcode-practice checks passed");
}
