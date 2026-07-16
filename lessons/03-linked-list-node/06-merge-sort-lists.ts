// See ./06-merge-sort-lists.md for the full lesson.

import { ListNode, arrayToList, listToArray } from "./01-node-fundamentals";

// LeetCode 21. Merge Two Sorted Lists (Easy)
// Dummy-head splicing walk: attach whichever head is smaller, advance that
// list, then attach whatever remains once one side runs out.
export function mergeTwoSortedLists(
  l1: ListNode<number> | null,
  l2: ListNode<number> | null
): ListNode<number> | null {
  const dummy = new ListNode<number>(0);
  let tail = dummy;
  let a = l1;
  let b = l2;
  while (a !== null && b !== null) {
    if (a.value <= b.value) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b;
  return dummy.next;
}

// Splits a (>= 2 node) chain into two halves in place: the first half is
// `null`-terminated at the node before the middle, and the second half's
// head is returned. Needs the node *before* the middle (not just the
// middle itself) so the first half can be properly cut.
function splitAtMiddle(head: ListNode<number>): ListNode<number> {
  let prev: ListNode<number> | null = null;
  let slow: ListNode<number> = head;
  let fast: ListNode<number> | null = head;
  while (fast !== null && fast.next !== null) {
    prev = slow;
    slow = slow.next!;
    fast = fast.next.next;
  }
  // Safe: this helper is only called on chains with >= 2 nodes (the caller
  // checks `head.next !== null` first), so the loop runs at least once and
  // `prev` is always assigned before this point.
  prev!.next = null;
  return slow;
}

// LeetCode 148. Sort List (Medium)
// Bottom-up via recursion: split in half, sort each half, merge the two
// already-sorted halves back together. No auxiliary array is needed for
// the merge step, unlike array merge sort.
export function sortList(head: ListNode<number> | null): ListNode<number> | null {
  if (head === null || head.next === null) {
    return head;
  }
  const secondHalf = splitAtMiddle(head);
  const sortedFirst = sortList(head);
  const sortedSecond = sortList(secondHalf);
  return mergeTwoSortedLists(sortedFirst, sortedSecond);
}

// LeetCode 23. Merge k Sorted Lists (Hard)
// Pairwise divide & conquer: merge lists two at a time, halving the list
// count every round, instead of folding one list into an accumulator at a
// time. O(N log k) instead of O(N*k).
export function mergeKLists(lists: Array<ListNode<number> | null>): ListNode<number> | null {
  if (lists.length === 0) {
    return null;
  }
  let round = lists.slice();
  while (round.length > 1) {
    const merged: Array<ListNode<number> | null> = [];
    for (let i = 0; i < round.length; i += 2) {
      if (i + 1 < round.length) {
        merged.push(mergeTwoSortedLists(round[i], round[i + 1]));
      } else {
        merged.push(round[i]);
      }
    }
    round = merged;
  }
  return round[0];
}

// LeetCode 1669. Merge In Between Linked Lists (Medium)
// Walk to the node just before index `a` and the node just after index
// `b`, then splice `list2` between them.
export function mergeInBetween(
  list1: ListNode<number>,
  a: number,
  b: number,
  list2: ListNode<number>
): ListNode<number> {
  let nodeBeforeA = list1;
  for (let i = 0; i < a - 1; i++) {
    nodeBeforeA = nodeBeforeA.next!;
  }
  let nodeAfterB = nodeBeforeA;
  for (let i = 0; i <= b - a + 1; i++) {
    nodeAfterB = nodeAfterB.next!;
  }

  nodeBeforeA.next = list2;
  let list2Tail = list2;
  while (list2Tail.next !== null) {
    list2Tail = list2Tail.next;
  }
  list2Tail.next = nodeAfterB;
  return list1;
}

// Exercise: solve LeetCode 147. Insertion Sort List by repeatedly removing
// the next node from the input and inserting it into its sorted position
// in the (initially empty) result list.
// Solution:
export function insertionSortList(head: ListNode<number> | null): ListNode<number> | null {
  const dummy = new ListNode<number>(0);
  let current = head;
  while (current !== null) {
    const next = current.next;
    let prev = dummy;
    while (prev.next !== null && prev.next.value <= current.value) {
      prev = prev.next;
    }
    current.next = prev.next;
    prev.next = current;
    current = next;
  }
  return dummy.next;
}

// Exercise: merge two lists node-by-node regardless of sort order (unlike
// `mergeTwoSortedLists`, which relies on both inputs already being sorted),
// appending whatever remains once the shorter list runs out.
// Solution:
export function interleaveLists(
  l1: ListNode<number> | null,
  l2: ListNode<number> | null
): ListNode<number> | null {
  const dummy = new ListNode<number>(0);
  let tail = dummy;
  let a = l1;
  let b = l2;
  while (a !== null && b !== null) {
    tail.next = a;
    a = a.next;
    tail = tail.next;
    tail.next = b;
    b = b.next;
    tail = tail.next;
  }
  tail.next = a !== null ? a : b;
  return dummy.next;
}

// --- run ---
if (require.main === module) {
  // mergeTwoSortedLists: [1,4,5] + [1,3,4] -> [1,1,3,4,4,5]
  const merged = mergeTwoSortedLists(arrayToList([1, 4, 5]), arrayToList([1, 3, 4]));
  console.assert(
    JSON.stringify(listToArray(merged)) === JSON.stringify([1, 1, 3, 4, 4, 5]),
    "mergeTwoSortedLists should interleave in sorted order"
  );
  console.assert(mergeTwoSortedLists(null, null) === null, "merging two empty lists stays null");
  console.assert(
    JSON.stringify(listToArray(mergeTwoSortedLists(arrayToList([1]), null))) === JSON.stringify([1]),
    "merging with an empty list returns the non-empty one"
  );

  // sortList: [4,2,1,3] -> [1,2,3,4]
  const sorted = sortList(arrayToList([4, 2, 1, 3]));
  console.assert(JSON.stringify(listToArray(sorted)) === JSON.stringify([1, 2, 3, 4]), "sortList should sort [4,2,1,3]");
  console.assert(sortList(null) === null, "sortList of an empty list stays null");
  console.assert(
    JSON.stringify(listToArray(sortList(arrayToList([1])))) === JSON.stringify([1]),
    "sortList of a single node returns it unchanged"
  );

  // mergeKLists: [[1,4,5],[1,3,4],[2,6]] -> [1,1,2,3,4,4,5,6]
  const kMerged = mergeKLists([arrayToList([1, 4, 5]), arrayToList([1, 3, 4]), arrayToList([2, 6])]);
  console.assert(
    JSON.stringify(listToArray(kMerged)) === JSON.stringify([1, 1, 2, 3, 4, 4, 5, 6]),
    "mergeKLists should merge all three lists in sorted order"
  );
  console.assert(mergeKLists([]) === null, "mergeKLists of an empty array of lists returns null");

  // mergeInBetween: list1=[0..5], a=3, b=4, list2=[1000000,1000001,1000002]
  // -> [0,1,2,1000000,1000001,1000002,5]
  const spliced = mergeInBetween(
    arrayToList([0, 1, 2, 3, 4, 5])!,
    3,
    4,
    arrayToList([1000000, 1000001, 1000002])!
  );
  console.assert(
    JSON.stringify(listToArray(spliced)) === JSON.stringify([0, 1, 2, 1000000, 1000001, 1000002, 5]),
    "mergeInBetween should splice list2 in place of indices [3,4]"
  );

  // insertionSortList: [4,2,1,3] -> [1,2,3,4]
  const insertionSorted = insertionSortList(arrayToList([4, 2, 1, 3]));
  console.assert(
    JSON.stringify(listToArray(insertionSorted)) === JSON.stringify([1, 2, 3, 4]),
    "insertionSortList should sort [4,2,1,3]"
  );

  // interleaveLists: even lengths, [1,3,5] + [2,4,6] -> [1,2,3,4,5,6]
  const interleavedEven = interleaveLists(arrayToList([1, 3, 5]), arrayToList([2, 4, 6]));
  console.assert(
    JSON.stringify(listToArray(interleavedEven)) === JSON.stringify([1, 2, 3, 4, 5, 6]),
    "interleaveLists should alternate nodes from both lists"
  );
  // interleaveLists: uneven lengths, [1,3] + [2,4,6,8] -> [1,2,3,4,6,8]
  const interleavedUneven = interleaveLists(arrayToList([1, 3]), arrayToList([2, 4, 6, 8]));
  console.assert(
    JSON.stringify(listToArray(interleavedUneven)) === JSON.stringify([1, 2, 3, 4, 6, 8]),
    "interleaveLists should append the longer list's remainder"
  );

  console.log("06-merge-sort-lists checks passed");
}
