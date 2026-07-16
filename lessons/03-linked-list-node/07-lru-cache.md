# LRU Cache via Node + Map

**Objective:** Combine a doubly linked list with a hash map to get O(1) `get`/`put` for a least-recently-used cache.

## Concept

An LRU cache needs three things in constant time: look up a key, move it to
"most recently used," and evict the "least recently used" entry when full.
No single structure gives all three on its own — an array/map alone has no
ordering to evict by, and a linked list alone has no O(1) lookup by key.
Combining them does: a doubly linked list holds the recency order (head =
most recently used, tail = least recently used), and a `Map<key, node>`
gives O(1) access straight to the node for a given key, skipping the O(n)
walk a plain list would need:

```
Map (key -> node)                Doubly linked list (recency order)
                                  head (MRU)              tail (LRU)
"1" ----------------------------> +-------+   +-------+   +-------+
                                   | 1 : 1 |<->| 3 : 3 |<->| 4 : 4 |
"3" ----------------------------> +-------+   +-------+   +-------+
                                       ^                       ^
"4" -----------------------------------|-----------------------+

get(1): map.get("1") jumps straight to that node in O(1); the node is then
unlinked and re-attached at head, becoming the new most-recently-used entry
in O(1) as well — no walk required either way.
```

Each list node stores both the key *and* the value, not just the value —
when the tail (the least-recently-used node) is evicted to make room, its
key is needed to delete the matching entry from the map. Without storing
the key on the node, eviction would have no way to find which map entry to
remove.

`get` and `put` both funnel through the same two primitives: `attachFront`
splices a node in as the new head, and `detach` unlinks a node from
wherever it currently sits (reusing the same O(1) node-removal trick as
`spliceOut` from lesson 03). Moving a node to the front on access is just
`detach` followed by `attachFront`.

## Complexity

| Operation                | Time | Space         |
| ------------------------- | ---- | ------------- |
| `get`                      | O(1) | O(1)           |
| `put`                      | O(1) | O(1)           |
| Overall cache              | —    | O(capacity)   |

## Walkthrough

`07-lru-cache.ts` implements `LRUCache`, solving **146. LRU Cache**. It
reuses `DoublyListNode<T>` from lesson 03 directly, storing a `{ key,
value }` pair as each node's payload, plus a `Map<number, DoublyListNode>`
for O(1) lookup. `get` returns `-1` on a miss; on a hit it moves the node
to the front (most recently used) and returns its value. `put` updates an
existing node's value and moves it to the front, or inserts a brand-new
node at the front; if that insert pushes the cache over capacity, the tail
node (least recently used) is detached and its key removed from the map.
`attachFront` and `detach` are the two private primitives both operations
build on.

One exercise closes the file: `mostRecentlyUsedKeys` returns the cache's
keys from most- to least-recently-used, walking the list from `head` to
`tail` without disturbing the recency order — a read-only way to inspect
what `get`/`put` have done so far.

## LeetCode practice

- 146. LRU Cache (Medium)

## Key takeaways

- No single structure gives O(1) lookup *and* O(1) recency-ordered eviction; the map gives lookup, the doubly linked list gives ordering, and together they cover both.
- Storing the key alongside the value inside each node is what makes O(1) eviction possible — otherwise evicting the tail node wouldn't know which map entry to delete.
- "Move to front" is just `detach` then `attachFront`, the same O(1) node-removal building block introduced as `spliceOut` in lesson 03.
- A doubly linked list is essential here, not just convenient: removing an arbitrary node in O(1) needs its `prev` pointer, which a singly linked list doesn't have.

Companion code: [`07-lru-cache.ts`](./07-lru-cache.ts)
