// Companion code for ./04-priority-queue-applications.md
import { MinHeap, ascending } from './02-min-max-heap';

/** An item queued with an explicit priority; lower priority number = served first. */
export interface PriorityQueueItem<T> {
  readonly value: T;
  readonly priority: number;
}

/** A priority queue: dequeue always returns the lowest-priority-number item. */
export class PriorityQueue<T> {
  private readonly heap: MinHeap<PriorityQueueItem<T>>;

  constructor() {
    this.heap = new MinHeap<PriorityQueueItem<T>>((a, b) => a.priority - b.priority);
  }

  enqueue(value: T, priority: number): void {
    this.heap.push({ value, priority });
  }

  dequeue(): T | undefined {
    return this.heap.pop()?.value;
  }

  peek(): T | undefined {
    return this.heap.peek()?.value;
  }

  get size(): number {
    return this.heap.size;
  }

  isEmpty(): boolean {
    return this.heap.isEmpty();
  }
}

// --- LeetCode 253. Meeting Rooms II (Medium) ---
// https://leetcode.com/problems/meeting-rooms-ii/
// Sort meetings by start time; track end times of currently-busy rooms in a
// min-heap. If the earliest-ending room frees up before the next meeting
// starts, reuse it; otherwise a new room is needed.
export function minMeetingRooms(intervals: ReadonlyArray<readonly [number, number]>): number {
  if (intervals.length === 0) return 0;
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const endTimes = new MinHeap<number>(ascending);
  for (const [start, end] of sorted) {
    if (!endTimes.isEmpty() && (endTimes.peek() as number) <= start) {
      endTimes.pop();
    }
    endTimes.push(end);
  }
  return endTimes.size;
}

// --- LeetCode 1642. Furthest Building You Can Reach (Medium) ---
// https://leetcode.com/problems/furthest-building-you-can-reach/
// Greedy: pay every uphill climb with a ladder (tracked in a min-heap of
// climb sizes). Once ladders run out, pay the *smallest* previously-ladder'd
// climb with bricks instead, keeping the biggest climbs on ladders.
export function furthestBuilding(heights: number[], bricks: number, ladders: number): number {
  const usedByLadder = new MinHeap<number>(ascending);
  let remainingBricks = bricks;
  for (let i = 0; i < heights.length - 1; i++) {
    const diff = heights[i + 1] - heights[i];
    if (diff <= 0) continue;
    usedByLadder.push(diff);
    if (usedByLadder.size > ladders) {
      remainingBricks -= usedByLadder.pop() as number;
    }
    if (remainingBricks < 0) return i;
  }
  return heights.length - 1;
}

// Exercise: given a list of (value, priority) items, return the values in
// service order (lowest priority number first) using PriorityQueue.
export function sortByPriorityStub<T>(_items: ReadonlyArray<PriorityQueueItem<T>>): T[] {
  throw new Error('not implemented');
}
// Solution:
export function sortByPriority<T>(items: ReadonlyArray<PriorityQueueItem<T>>): T[] {
  const pq = new PriorityQueue<T>();
  for (const item of items) pq.enqueue(item.value, item.priority);
  const result: T[] = [];
  while (!pq.isEmpty()) {
    const value = pq.dequeue();
    if (value !== undefined) result.push(value);
  }
  return result;
}

// --- run ---
if (require.main === module) {
  const pq = new PriorityQueue<string>();
  pq.enqueue('low', 3);
  pq.enqueue('high', 1);
  pq.enqueue('mid', 2);
  console.assert(pq.dequeue() === 'high', 'lowest priority number (1) should be served first');
  console.assert(pq.dequeue() === 'mid', 'next should be mid priority (2)');
  console.assert(pq.dequeue() === 'low', 'last should be highest priority number (3)');
  console.assert(pq.isEmpty(), 'queue should be empty after draining all items');

  console.assert(minMeetingRooms([[0, 30], [5, 10], [15, 20]]) === 2, 'classic overlapping example needs 2 rooms');
  console.assert(minMeetingRooms([[7, 10], [2, 4]]) === 1, 'non-overlapping meetings need only 1 room');

  console.assert(
    furthestBuilding([4, 2, 7, 6, 9, 14, 12], 5, 1) === 4,
    'greedy ladder/brick allocation should reach index 4 before running out'
  );

  console.assert(
    JSON.stringify(sortByPriority([{ value: 'a', priority: 5 }, { value: 'b', priority: 1 }])) ===
      JSON.stringify(['b', 'a']),
    'sortByPriority should serve the lowest priority number first'
  );

  console.log('04-priority-queue-applications: all assertions passed');
}
