// See ./01-node-fundamentals.md for the full lesson.

/** Struct-like linked list node: a value plus a pointer to the next node. */
export class ListNode<T> {
  value: T;
  next: ListNode<T> | null;

  constructor(value: T, next: ListNode<T> | null = null) {
    this.value = value;
    this.next = next;
  }
}

/** Builds a node chain from an array; returns null for an empty array. */
export function arrayToList<T>(values: T[]): ListNode<T> | null {
  let head: ListNode<T> | null = null;
  let tail: ListNode<T> | null = null;
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
export function listToArray<T>(head: ListNode<T> | null): T[] {
  const values: T[] = [];
  let current = head;
  while (current !== null) {
    values.push(current.value);
    current = current.next;
  }
  return values;
}

// LeetCode 237. Delete Node in a Linked List (Easy)
// Given a node that is guaranteed NOT to be the tail, delete it in place
// without access to the list's head: copy the next node's value over, then
// splice the next node out.
export function deleteNode(node: ListNode<number>): void {
  if (node.next === null) {
    throw new Error("deleteNode requires a non-tail node");
  }
  node.value = node.next.value;
  node.next = node.next.next;
}

// LeetCode 1290. Convert Binary Number in a Linked List to Integer (Easy)
// Each node holds a single bit (0 or 1), most significant bit first.
export function getDecimalValueOfBinaryNumber(head: ListNode<number> | null): number {
  let value = 0;
  let current = head;
  while (current !== null) {
    value = value * 2 + current.value;
    current = current.next;
  }
  return value;
}

// LeetCode 876. Middle of the Linked List (Easy)
// Fundamentals-only approach: count the length, then walk half of it.
// (The single-pass fast/slow pointer version is covered in lesson 04.)
export function middleNode<T>(head: ListNode<T> | null): ListNode<T> | null {
  let length = 0;
  let counter: ListNode<T> | null = head;
  while (counter !== null) {
    length++;
    counter = counter.next;
  }

  let steps = Math.floor(length / 2);
  let current: ListNode<T> | null = head;
  while (steps > 0 && current !== null) {
    current = current.next;
    steps--;
  }
  return current;
}

// Exercise: write a function that counts the nodes in a chain.
// Solution:
export function countNodes<T>(head: ListNode<T> | null): number {
  let count = 0;
  let current = head;
  while (current !== null) {
    count++;
    current = current.next;
  }
  return count;
}

// Exercise: write a function that returns the last node of a chain (or null
// for an empty list).
// Solution:
export function getLastNode<T>(head: ListNode<T> | null): ListNode<T> | null {
  if (head === null) {
    return null;
  }
  let current = head;
  while (current.next !== null) {
    current = current.next;
  }
  return current;
}

// --- run ---
if (require.main === module) {
  const list = arrayToList([1, 2, 3, 4, 5]);

  console.log("list as array:", listToArray(list));
  console.assert(
    JSON.stringify(listToArray(list)) === JSON.stringify([1, 2, 3, 4, 5]),
    "arrayToList/listToArray should round-trip"
  );

  console.assert(countNodes(list) === 5, "countNodes should return 5");

  const last = getLastNode(list);
  console.assert(last !== null && last.value === 5, "getLastNode should return the node holding 5");

  // [1,2,3,4,5]: length 5, floor(5/2) = 2 steps from head -> value 3.
  const mid1 = middleNode(arrayToList([1, 2, 3, 4, 5]));
  console.assert(mid1 !== null && mid1.value === 3, "middleNode of odd-length list should be 3");

  // [1,2,3,4]: length 4, floor(4/2) = 2 steps from head -> value 3 (the
  // second of the two middle nodes, matching LeetCode 876's convention).
  const mid2 = middleNode(arrayToList([1, 2, 3, 4]));
  console.assert(mid2 !== null && mid2.value === 3, "middleNode of even-length list should be the second middle");

  // deleteNode: [4,5,1,9], delete the node holding 5 -> [4,1,9].
  const deletable = arrayToList([4, 5, 1, 9]) as ListNode<number>;
  const nodeToDelete = deletable.next as ListNode<number>; // holds 5
  deleteNode(nodeToDelete);
  console.assert(
    JSON.stringify(listToArray(deletable)) === JSON.stringify([4, 1, 9]),
    "deleteNode should splice out the target node"
  );

  // getDecimalValueOfBinaryNumber: 1 -> 0 -> 1 represents binary 101 = 5.
  const binary = arrayToList([1, 0, 1]);
  console.assert(getDecimalValueOfBinaryNumber(binary) === 5, "binary 101 should equal 5");

  console.log("01-node-fundamentals checks passed");
}
