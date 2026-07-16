// See ./05-reversal.md for the full lesson.

import { ListNode, arrayToList, listToArray } from "./01-node-fundamentals";
import { findMiddleFastSlow } from "./04-fast-slow-pointers";

// LeetCode 206. Reverse Linked List (Easy) — iterative.
export function reverseIterative<T>(head: ListNode<T> | null): ListNode<T> | null {
  let prev: ListNode<T> | null = null;
  let current = head;
  while (current !== null) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}

// LeetCode 206. Reverse Linked List (Easy) — recursive.
export function reverseRecursive<T>(head: ListNode<T> | null): ListNode<T> | null {
  if (head === null || head.next === null) {
    return head;
  }
  const newHead = reverseRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}

// LeetCode 92. Reverse Linked List II (Medium)
// Reverses only the sub-range [left, right] (1-indexed), leaving the rest
// of the list untouched, by repeatedly moving the node after `current` to
// the front of the sub-range.
export function reverseBetween(
  head: ListNode<number> | null,
  left: number,
  right: number
): ListNode<number> | null {
  const dummy = new ListNode<number>(0, head);
  let prev = dummy;
  for (let i = 0; i < left - 1; i++) {
    prev = prev.next!;
  }
  const current = prev.next!;
  for (let i = 0; i < right - left; i++) {
    const moved = current.next!;
    current.next = moved.next;
    moved.next = prev.next;
    prev.next = moved;
  }
  return dummy.next;
}

// LeetCode 25. Reverse Nodes in k-Group (Hard)
// Recursively reverses everything after the current k-node group first,
// then reverses the group and attaches it to the already-reversed rest.
export function reverseKGroup(head: ListNode<number> | null, k: number): ListNode<number> | null {
  let node = head;
  let count = 0;
  while (node !== null && count < k) {
    node = node.next;
    count++;
  }
  if (count < k) {
    return head; // fewer than k nodes remain: leave this tail as-is.
  }

  let prev = reverseKGroup(node, k);
  let current = head;
  for (let i = 0; i < k; i++) {
    const next = current!.next;
    current!.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}

// LeetCode 24. Swap Nodes in Pairs (Medium)
// Same divide-and-conquer shape as reverseKGroup, specialized to pairs.
export function swapPairs(head: ListNode<number> | null): ListNode<number> | null {
  if (head === null || head.next === null) {
    return head;
  }
  const second = head.next;
  head.next = swapPairs(second.next);
  second.next = head;
  return second;
}

// Exercise: reverse only the first k nodes and reconnect the remainder.
// Solution:
export function reverseFirstK<T>(head: ListNode<T> | null, k: number): ListNode<T> | null {
  let prev: ListNode<T> | null = null;
  let current = head;
  let count = 0;
  while (current !== null && count < k) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
    count++;
  }
  if (head !== null) {
    head.next = current; // original head is now the tail of the reversed prefix
  }
  return prev ?? head;
}

// Exercise: solve LeetCode 234. Palindrome Linked List by combining lesson
// 04's fast/slow middle-finder with this lesson's iterative reversal,
// instead of copying the list into an array.
// Solution:
export function isPalindromeViaReversal<T>(head: ListNode<T> | null): boolean {
  if (head === null || head.next === null) {
    return true;
  }
  const middle = findMiddleFastSlow(head)!;
  const secondHalfReversed = reverseIterative(middle);

  let left: ListNode<T> | null = head;
  let right: ListNode<T> | null = secondHalfReversed;
  let isPalindrome = true;
  while (right !== null) {
    if (left!.value !== right.value) {
      isPalindrome = false;
      break;
    }
    left = left!.next;
    right = right.next;
  }
  return isPalindrome;
}

// --- run ---
if (require.main === module) {
  console.assert(
    JSON.stringify(listToArray(reverseIterative(arrayToList([1, 2, 3, 4, 5])))) === JSON.stringify([5, 4, 3, 2, 1]),
    "reverseIterative should reverse [1..5]"
  );
  console.assert(
    JSON.stringify(listToArray(reverseRecursive(arrayToList([1, 2, 3, 4, 5])))) === JSON.stringify([5, 4, 3, 2, 1]),
    "reverseRecursive should reverse [1..5]"
  );
  console.assert(reverseIterative<number>(null) === null, "reversing an empty list stays null");

  // LeetCode 92 example: [1,2,3,4,5], left=2, right=4 -> [1,4,3,2,5]
  const between = reverseBetween(arrayToList([1, 2, 3, 4, 5]), 2, 4);
  console.assert(JSON.stringify(listToArray(between)) === JSON.stringify([1, 4, 3, 2, 5]), "reverseBetween(2,4)");

  // LeetCode 25 example: [1,2,3,4,5], k=2 -> [2,1,4,3,5]
  const grouped = reverseKGroup(arrayToList([1, 2, 3, 4, 5]), 2);
  console.assert(JSON.stringify(listToArray(grouped)) === JSON.stringify([2, 1, 4, 3, 5]), "reverseKGroup(k=2)");

  // LeetCode 24 example: [1,2,3,4] -> [2,1,4,3]
  const swapped = swapPairs(arrayToList([1, 2, 3, 4]));
  console.assert(JSON.stringify(listToArray(swapped)) === JSON.stringify([2, 1, 4, 3]), "swapPairs([1,2,3,4])");

  // reverseFirstK: [1,2,3,4,5], k=3 -> [3,2,1,4,5]
  const firstK = reverseFirstK(arrayToList([1, 2, 3, 4, 5]), 3);
  console.assert(JSON.stringify(listToArray(firstK)) === JSON.stringify([3, 2, 1, 4, 5]), "reverseFirstK(k=3)");

  console.assert(isPalindromeViaReversal(arrayToList([1, 2, 3, 2, 1])) === true, "odd-length palindrome");
  console.assert(isPalindromeViaReversal(arrayToList([1, 2, 2, 1])) === true, "even-length palindrome");
  console.assert(isPalindromeViaReversal(arrayToList([1, 2, 3])) === false, "non-palindrome");

  console.log("05-reversal checks passed");
}
