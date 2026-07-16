// See ./07-lru-cache.md for the full lesson.

import { DoublyListNode } from "./03-doubly-linked-list";

/** Payload stored in each cache node: both fields are needed so an evicted
 * tail node can find and remove its own entry from the map. */
interface CacheEntry {
  key: number;
  value: number;
}

// LeetCode 146. LRU Cache (Medium)
// A Map<key, node> gives O(1) lookup; a doubly linked list of those same
// nodes gives O(1) recency reordering and O(1) eviction of the least
// recently used entry (the tail).
export class LRUCache {
  private capacity: number;
  private map = new Map<number, DoublyListNode<CacheEntry>>();
  private head: DoublyListNode<CacheEntry> | null = null; // most recently used
  private tail: DoublyListNode<CacheEntry> | null = null; // least recently used

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: number): number {
    const node = this.map.get(key);
    if (node === undefined) {
      return -1;
    }
    this.moveToFront(node);
    return node.value.value;
  }

  put(key: number, value: number): void {
    const existing = this.map.get(key);
    if (existing !== undefined) {
      existing.value.value = value;
      this.moveToFront(existing);
      return;
    }

    const node = new DoublyListNode<CacheEntry>({ key, value });
    this.attachFront(node);
    this.map.set(key, node);

    if (this.map.size > this.capacity) {
      const leastRecentlyUsed = this.tail!;
      this.detach(leastRecentlyUsed);
      this.map.delete(leastRecentlyUsed.value.key);
    }
  }

  private attachFront(node: DoublyListNode<CacheEntry>): void {
    node.prev = null;
    node.next = this.head;
    if (this.head !== null) {
      this.head.prev = node;
    }
    this.head = node;
    if (this.tail === null) {
      this.tail = node;
    }
  }

  // O(1): unlinks `node` from wherever it currently sits, the same
  // neighbor-relinking trick as `spliceOut` in lesson 03.
  private detach(node: DoublyListNode<CacheEntry>): void {
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

  private moveToFront(node: DoublyListNode<CacheEntry>): void {
    if (this.head === node) {
      return;
    }
    this.detach(node);
    this.attachFront(node);
  }

  // Exercise: return the cache's keys ordered from most- to
  // least-recently-used, without disturbing that order.
  // Solution:
  mostRecentlyUsedKeys(): number[] {
    const keys: number[] = [];
    let current = this.head;
    while (current !== null) {
      keys.push(current.value.key);
      current = current.next;
    }
    return keys;
  }
}

// --- run ---
if (require.main === module) {
  // Worked example from LeetCode 146's problem statement.
  const cache = new LRUCache(2);
  cache.put(1, 1); // cache: {1=1}
  cache.put(2, 2); // cache: {1=1, 2=2}
  console.assert(cache.get(1) === 1, "get(1) should return 1");
  cache.put(3, 3); // evicts key 2 (least recently used) -> {1=1, 3=3}
  console.assert(cache.get(2) === -1, "get(2) should return -1 after eviction");
  cache.put(4, 4); // evicts key 1 (least recently used) -> {4=4, 3=3}
  console.assert(cache.get(1) === -1, "get(1) should return -1 after eviction");
  console.assert(cache.get(3) === 3, "get(3) should return 3");
  console.assert(cache.get(4) === 4, "get(4) should return 4");

  // mostRecentlyUsedKeys: after the gets above, 4 was touched most
  // recently, then 3; both are within capacity so both remain.
  console.assert(
    JSON.stringify(cache.mostRecentlyUsedKeys()) === JSON.stringify([4, 3]),
    "mostRecentlyUsedKeys should list 4 before 3"
  );

  // A fresh cache: verify put() on an existing key updates the value and
  // still refreshes its recency without growing past capacity.
  const cache2 = new LRUCache(2);
  cache2.put(10, 100);
  cache2.put(20, 200);
  cache2.put(10, 999); // update existing key, moves 10 back to the front
  console.assert(
    JSON.stringify(cache2.mostRecentlyUsedKeys()) === JSON.stringify([10, 20]),
    "updating an existing key should move it to the front"
  );
  cache2.put(30, 300); // evicts 20 (least recently used)
  console.assert(cache2.get(20) === -1, "get(20) should return -1 after eviction");
  console.assert(cache2.get(10) === 999, "get(10) should return the updated value 999");

  console.log("07-lru-cache checks passed");
}
