# LeetCode Practice Set: Queue

**Objective:** Apply queue-based reasoning across a spread of Easy-to-Hard problems: line simulation, reconstruction, circular elimination, and graph BFS.

## Concept

This lesson doesn't introduce a new structure — it's a survey of how far
"model the process as a queue and simulate it" carries you. Two recurring
sub-patterns show up:

```
Simulation queue (line / circle of participants):

  [ P1 | P2 | P3 | P4 ]  <-- process front, then either drop it or
    ^front         ^rear     send it to the back for another round

  This single rotation idiom (dequeue, decide, maybe re-enqueue)
  solves ticket queues, elimination games, and turn-based voting alike.

Graph BFS queue (implicit graph, e.g. one-letter-different words):

  ring 0:  hit                     queue: [hit]
            |
  ring 1:  hot                     queue: [hot]
            |
  ring 2:  dot, lot                queue: [dot, lot]
            |
  ring 3:  dog, log                queue: [dog, log]
            |
  ring 4:  cog                     <- first ring cog appears in = answer
```

## Complexity

| Problem                                      | Time                              | Space |
|-----------------------------------------------|------------------------------------|-------|
| `timeRequiredToBuy` (2073)                    | O(n · max(tickets))  | O(n) |
| `deckRevealedIncreasing` (950)                 | O(n log n) for the sort, O(n) to replay | O(n) |
| `predictPartyVictory` (649)                    | O(n)                               | O(n) |
| `findTheWinner` (1823)                         | O(n · k)                           | O(n) |
| `ladderLength` (127)                           | O(n · L · 26) where L = word length | O(n) |

## Walkthrough

`07-leetcode-practice.ts` imports `LinkedListQueue` from lesson 02.

`timeRequiredToBuy` (LeetCode 2073) enqueues every person's index, then
simulates one ticket purchase per dequeue: decrement that person's
remaining count, and only re-enqueue them if they still want more. The
moment the person at index `k` hits zero remaining tickets, the current
`time` is the answer.

`deckRevealedIncreasing` (LeetCode 950) works backwards from the reveal
rule: sort the deck ascending, then replay "reveal front, move next card to
the bottom" against a queue of **positions** rather than cards. Each sorted
card is assigned to whatever position is dequeued next, which reconstructs
the exact original ordering that would reveal cards in increasing order.

`predictPartyVictory` (LeetCode 649) keeps two queues of senator indices,
one per party. Each round, the earlier index from each party's queue bans
the other; the winner re-enters their own queue at `index + n`, which both
records that they've had a turn this round and keeps future comparisons
correct. Whichever queue empties first has no senators left to vote.

`ladderLength` (LeetCode 127) is graph BFS where edges are implicit:
two words are neighbors if they differ by exactly one letter. From each
dequeued `[word, length]` pair, every single-letter variant is generated
and checked against a `Set` of allowed words; unvisited matches are
enqueued with `length + 1`. Because BFS visits in strictly increasing
`length` order, the first time `endWord` is dequeued its `length` is the
shortest possible transformation sequence.

`findTheWinner` is an exercise solving LeetCode 1823 (the Josephus
problem): friends 1..n are enqueued in order, and each round rotates the
queue `k - 1` times (dequeue then immediately re-enqueue) before
discarding the front outright — that discarded friend is the one eliminated
this round. The loop stops once one friend remains.

## LeetCode practice

- 2073. Time Needed to Buy Tickets (Easy)
- 950. Reveal Cards In Increasing Order (Medium)
- 649. Dota2 Senate (Medium)
- 1823. Find the Winner of the Circular Game (Medium)
- 127. Word Ladder (Hard)

## Key takeaways

- Many "simulate a process" problems reduce to one queue idiom: dequeue,
  make a decision, and conditionally re-enqueue — the variation is entirely
  in what the decision looks at.
- Tracking **positions** or **indices** in a queue instead of values (as in
  `deckRevealedIncreasing` and `predictPartyVictory`) is a common trick
  when the final answer needs to map back to an original ordering.
- The Josephus-style elimination pattern (`findTheWinner`) is just
  rotate-then-discard repeated until one element remains — no modular
  arithmetic shortcut is needed to get a correct, readable solution.
- BFS over an *implicit* graph (`ladderLength`) works exactly like BFS over
  an explicit adjacency list; the only difference is neighbors are
  generated on the fly instead of looked up.

Companion code: [`07-leetcode-practice.ts`](./07-leetcode-practice.ts)
