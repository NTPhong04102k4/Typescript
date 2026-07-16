// See ./02-singly-linked-list.md for the full lesson.

import { ListNode, arrayToList, listToArray } from "./01-node-fundamentals";

/** Generic singly linked list with a cached tail for O(1) appends. */
export class SinglyLinkedList<T> implements Iterable<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private length = 0;

  get size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  pushFront(value: T): void {
    const node = new ListNode(value, this.head);
    this.head = node;
    if (this.tail === null) {
      this.tail = node;
    }
    this.length++;
  }

  pushBack(value: T): void {
    const node = new ListNode(value);
    if (this.tail === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
  }

  popFront(): T | undefined {
    if (this.head === null) {
      return undefined;
    }
    const node = this.head;
    this.head = node.next;
    if (this.head === null) {
      this.tail = null;
    }
    this.length--;
    return node.value;
  }

  // O(n): a singly linked list has no `prev` pointer, so finding the node
  // just before the tail requires a full walk from `head`.
  popBack(): T | undefined {
    if (this.head === null || this.tail === null) {
      return undefined;
    }
    const head = this.head;
    const tail = this.tail;
    if (head === tail) {
      this.head = null;
      this.tail = null;
      this.length--;
      return head.value;
    }
    let current = head;
    while (current.next !== tail) {
      current = current.next!;
    }
    current.next = null;
    this.tail = current;
    this.length--;
    return tail.value;
  }

  get(index: number): T | undefined {
    if (index < 0 || index >= this.length) {
      return undefined;
    }
    let current = this.head;
    for (let i = 0; i < index && current !== null; i++) {
      current = current.next;
    }
    return current?.value;
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
    let prev = this.head!;
    for (let i = 0; i < index - 1; i++) {
      prev = prev.next!;
    }
    prev.next = new ListNode(value, prev.next);
    this.length++;
  }

  removeAt(index: number): T | undefined {
    if (index < 0 || index >= this.length) {
      return undefined;
    }
    if (index === 0) {
      return this.popFront();
    }
    let prev = this.head!;
    for (let i = 0; i < index - 1; i++) {
      prev = prev.next!;
    }
    const target = prev.next!;
    prev.next = target.next;
    if (target === this.tail) {
      this.tail = prev;
    }
    this.length--;
    return target.value;
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

// LeetCode 707. Design Linked List (Medium)
// Mirrors LeetCode's exact required API on top of ListNode<number>.
export class MyLinkedList {
  private head: ListNode<number> | null = null;
  private length = 0;

  get(index: number): number {
    if (index < 0 || index >= this.length) {
      return -1;
    }
    let current = this.head!;
    for (let i = 0; i < index; i++) {
      current = current.next!;
    }
    return current.value;
  }

  addAtHead(val: number): void {
    this.head = new ListNode(val, this.head);
    this.length++;
  }

  addAtTail(val: number): void {
    const node = new ListNode(val);
    if (this.head === null) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next !== null) {
        current = current.next;
      }
      current.next = node;
    }
    this.length++;
  }

  addAtIndex(index: number, val: number): void {
    if (index > this.length) {
      return;
    }
    if (index <= 0) {
      this.addAtHead(val);
      return;
    }
    if (index === this.length) {
      this.addAtTail(val);
      return;
    }
    let prev = this.head!;
    for (let i = 0; i < index - 1; i++) {
      prev = prev.next!;
    }
    prev.next = new ListNode(val, prev.next);
    this.length++;
  }

  deleteAtIndex(index: number): void {
    if (index < 0 || index >= this.length) {
      return;
    }
    if (index === 0) {
      this.head = this.head!.next;
      this.length--;
      return;
    }
    let prev = this.head!;
    for (let i = 0; i < index - 1; i++) {
      prev = prev.next!;
    }
    prev.next = prev.next!.next;
    this.length--;
  }
}

// LeetCode 83. Remove Duplicates from Sorted List (Easy)
export function removeDuplicatesFromSortedList(head: ListNode<number> | null): ListNode<number> | null {
  let current = head;
  while (current !== null && current.next !== null) {
    if (current.value === current.next.value) {
      current.next = current.next.next;
    } else {
      current = current.next;
    }
  }
  return head;
}

// LeetCode 203. Remove Linked List Elements (Easy)
// A dummy head avoids a special case for deleting at the real head.
export function removeElements(head: ListNode<number> | null, val: number): ListNode<number> | null {
  const dummy = new ListNode<number>(0, head);
  let current = dummy;
  while (current.next !== null) {
    if (current.next.value === val) {
      current.next = current.next.next;
    } else {
      current = current.next;
    }
  }
  return dummy.next;
}

// LeetCode 2. Add Two Numbers (Medium)
// Digits are stored least-significant-first; walk both lists with a carry.
export function addTwoNumbers(
  l1: ListNode<number> | null,
  l2: ListNode<number> | null
): ListNode<number> | null {
  const dummy = new ListNode<number>(0);
  let current = dummy;
  let carry = 0;
  let a = l1;
  let b = l2;
  while (a !== null || b !== null || carry > 0) {
    const sum = (a?.value ?? 0) + (b?.value ?? 0) + carry;
    carry = Math.floor(sum / 10);
    current.next = new ListNode(sum % 10);
    current = current.next;
    a = a?.next ?? null;
    b = b?.next ?? null;
  }
  return dummy.next;
}

// Exercise: write a function that checks whether a raw node chain contains
// a given value (without using the SinglyLinkedList class).
// Solution:
export function listContains<T>(head: ListNode<T> | null, value: T): boolean {
  let current = head;
  while (current !== null) {
    if (current.value === value) {
      return true;
    }
    current = current.next;
  }
  return false;
}

// Exercise: write a function that removes the first node holding a given
// value from a raw node chain, returning the (possibly new) head.
// Solution:
export function removeValue<T>(head: ListNode<T> | null, value: T): ListNode<T> | null {
  if (head === null) {
    return null;
  }
  if (head.value === value) {
    return head.next;
  }
  let prev = head;
  let current = head.next;
  while (current !== null) {
    if (current.value === value) {
      prev.next = current.next;
      break;
    }
    prev = current;
    current = current.next;
  }
  return head;
}

// --- run ---
if (require.main === module) {
  const list = new SinglyLinkedList<number>();
  list.pushBack(1);
  list.pushBack(2);
  list.pushBack(3);
  list.pushFront(0);
  console.log("list:", list.toArray());
  console.assert(JSON.stringify(list.toArray()) === JSON.stringify([0, 1, 2, 3]), "pushFront/pushBack order");
  console.assert(list.size === 4, "size should be 4");

  console.assert(list.get(2) === 2, "get(2) should be 2");
  list.insertAt(2, 99);
  console.assert(JSON.stringify(list.toArray()) === JSON.stringify([0, 1, 99, 2, 3]), "insertAt(2, 99)");

  const removed = list.removeAt(2);
  console.assert(removed === 99, "removeAt(2) should return 99");
  console.assert(JSON.stringify(list.toArray()) === JSON.stringify([0, 1, 2, 3]), "removeAt restores order");

  console.assert(list.popBack() === 3, "popBack should return 3");
  console.assert(list.popFront() === 0, "popFront should return 0");
  console.assert(JSON.stringify(list.toArray()) === JSON.stringify([1, 2]), "list after pops");

  console.assert([...list].join(",") === "1,2", "Symbol.iterator should support for...of / spread");

  // MyLinkedList: worked example from LeetCode 707's problem statement.
  const myList = new MyLinkedList();
  myList.addAtHead(1);
  myList.addAtTail(3);
  myList.addAtIndex(1, 2); // list is now 1 -> 2 -> 3
  console.assert(myList.get(1) === 2, "MyLinkedList.get(1) should be 2");
  myList.deleteAtIndex(1); // list is now 1 -> 3
  console.assert(myList.get(1) === 3, "MyLinkedList.get(1) after delete should be 3");

  // removeDuplicatesFromSortedList: 1->1->2->3->3 -> 1->2->3
  const dedup = removeDuplicatesFromSortedList(arrayToList([1, 1, 2, 3, 3]));
  console.assert(JSON.stringify(listToArray(dedup)) === JSON.stringify([1, 2, 3]), "removeDuplicatesFromSortedList should dedupe");

  // removeElements: 1->2->6->3->4->5->6 remove 6 -> 1->2->3->4->5
  const filtered = removeElements(arrayToList([1, 2, 6, 3, 4, 5, 6]), 6);
  console.assert(JSON.stringify(listToArray(filtered)) === JSON.stringify([1, 2, 3, 4, 5]), "removeElements should drop all 6s");

  // addTwoNumbers: 342 + 465 = 807, stored least-significant-digit-first.
  const sum = addTwoNumbers(arrayToList([2, 4, 3]), arrayToList([5, 6, 4]));
  console.assert(JSON.stringify(listToArray(sum)) === JSON.stringify([7, 0, 8]), "addTwoNumbers(342, 465) should be 807");

  console.assert(listContains(arrayToList([1, 2, 3]), 2) === true, "listContains should find 2");
  const removedVal = removeValue(arrayToList([1, 2, 3]), 2);
  console.assert(JSON.stringify(listToArray(removedVal)) === JSON.stringify([1, 3]), "removeValue should drop the first matching node");

  console.log("02-singly-linked-list checks passed");
}
