// See ./04-fast-slow-pointers.md for the full lesson.

import { ListNode, arrayToList } from "./01-node-fundamentals";

// LeetCode 141. Linked List Cycle (Easy)
export function hasCycle<T>(head: ListNode<T> | null): boolean {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    // Safe: slow never moves ahead of fast, so if fast and fast.next are
    // both non-null here, slow has not fallen off the end either.
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      return true;
    }
  }
  return false;
}

// LeetCode 142. Linked List Cycle II (Medium)
// Phase 1: find the slow/fast meeting point inside the cycle (or bail if
// there is none). Phase 2: reset one pointer to head and advance both one
// step at a time; they meet again exactly at the cycle's start node.
export function detectCycleStart<T>(head: ListNode<T> | null): ListNode<T> | null {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      let pointer = head;
      let meeting = slow;
      while (pointer !== meeting) {
        pointer = pointer!.next;
        meeting = meeting!.next;
      }
      return pointer;
    }
  }
  return null;
}

// LeetCode 876. Middle of the Linked List (Easy) — single-pass version.
// slow covers half the distance fast does, so when fast runs out, slow sits
// on the middle node (the second middle for even-length lists).
export function findMiddleFastSlow<T>(head: ListNode<T> | null): ListNode<T> | null {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}

// LeetCode 202. Happy Number (Easy)
// Same tortoise-and-hare idea, applied to a numeric sequence instead of a
// pointer chain: "next" means "sum of squared digits."
function sumOfSquaredDigits(n: number): number {
  let sum = 0;
  let value = n;
  while (value > 0) {
    const digit = value % 10;
    sum += digit * digit;
    value = Math.floor(value / 10);
  }
  return sum;
}

export function isHappy(n: number): boolean {
  let slow = n;
  let fast = sumOfSquaredDigits(n);
  while (fast !== 1 && slow !== fast) {
    slow = sumOfSquaredDigits(slow);
    fast = sumOfSquaredDigits(sumOfSquaredDigits(fast));
  }
  return fast === 1;
}

// Exercise: given a cyclic list, return the cycle's length (0 if acyclic).
// Solution:
export function cycleLength<T>(head: ListNode<T> | null): number {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      let length = 1;
      let pointer = slow!.next;
      while (pointer !== slow) {
        pointer = pointer!.next;
        length++;
      }
      return length;
    }
  }
  return 0;
}

// Exercise: return the node that is `n` positions from the end of the list
// (1-indexed), using a fast pointer given an `n`-step head start. This is
// the same gap-based two-pointer idea behind LeetCode 19, Remove Nth Node
// From End of List.
// Solution:
export function getNthFromEnd<T>(head: ListNode<T> | null, n: number): ListNode<T> | null {
  let fast = head;
  for (let i = 0; i < n; i++) {
    if (fast === null) {
      return null;
    }
    fast = fast.next;
  }
  let slow = head;
  while (fast !== null) {
    fast = fast.next;
    slow = slow!.next;
  }
  return slow;
}

// Test-only helper: builds a node chain and, if `cyclePos >= 0`, wires the
// tail's `next` back to the node at that index to construct a cycle.
function buildCyclicList<T>(values: T[], cyclePos: number): ListNode<T> | null {
  const nodes = values.map((value) => new ListNode(value));
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1];
  }
  if (cyclePos >= 0 && cyclePos < nodes.length && nodes.length > 0) {
    nodes[nodes.length - 1].next = nodes[cyclePos];
  }
  return nodes.length > 0 ? nodes[0] : null;
}

// --- run ---
if (require.main === module) {
  const acyclic = arrayToList([1, 2, 3, 4, 5]);
  console.assert(hasCycle(acyclic) === false, "acyclic list should report no cycle");
  const mid = findMiddleFastSlow(acyclic);
  console.assert(mid !== null && mid.value === 3, "findMiddleFastSlow should agree with lesson 01's middleNode");
  console.assert(detectCycleStart(acyclic) === null, "acyclic list has no cycle start");

  // LeetCode 141 example 1: [3,2,0,-4], pos = 1 -> tail connects to value 2.
  const cyclic1 = buildCyclicList([3, 2, 0, -4], 1);
  console.assert(hasCycle(cyclic1) === true, "cyclic1 should report a cycle");
  const start1 = detectCycleStart(cyclic1);
  console.assert(start1 !== null && start1.value === 2, "cycle start should be the node holding 2");
  console.assert(cycleLength(cyclic1) === 3, "cycle among [2,0,-4] has length 3");

  // LeetCode 141 example 2: [1,2], pos = 0 -> tail connects to value 1.
  const cyclic2 = buildCyclicList([1, 2], 0);
  console.assert(hasCycle(cyclic2) === true, "cyclic2 should report a cycle");

  // LeetCode 141 example 3: [1], pos = -1 -> no cycle.
  const noCycle = buildCyclicList([1], -1);
  console.assert(hasCycle(noCycle) === false, "single node with no cycle should report false");

  console.assert(isHappy(19) === true, "19 is a happy number");
  console.assert(isHappy(2) === false, "2 is not a happy number");

  const nth = getNthFromEnd(arrayToList([1, 2, 3, 4, 5]), 2);
  console.assert(nth !== null && nth.value === 4, "2nd node from the end of [1,2,3,4,5] should be 4");

  console.log("04-fast-slow-pointers checks passed");
}
