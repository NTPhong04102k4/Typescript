# Task Scheduling & Rate Limiting With Queues

**Objective:** Use queues to simulate CPU task scheduling with cooldowns and to answer "how many events happened in the last N seconds" queries over a live stream.

## Concept

A queue is the natural structure for anything that must respect **arrival
order plus an expiry window** — a task that can't repeat too soon, or an
event that should stop counting once it's old enough. Both problems in
this lesson share the same shape: push new items onto the queue, then
evict from the front once an item no longer satisfies some time-based
condition.

```
Rate-limiting window ("has this aged out yet?"):

queue (oldest -> newest):  [ t=1 | t=2 | t=3 | t=300 ]
                              ^front

query at t=301, window = 300s, keep only t > 301 - 300 = 1:

evict front while front <= 1:  [ t=1 ]  -> evicted (1 <= 1)
remaining queue:               [ t=2 | t=3 | t=300 ]
                                  ^front (2 > 1, stop evicting)

size of remaining queue = answer to "how many events in the window"
```

Task Scheduler flips this around: instead of evicting expired *events*, it
holds tasks that just ran in a **cooldown queue** tagged with the time they
become eligible again, and merges them back into the pool of runnable
tasks once that time arrives.

## Complexity

| Operation                          | Time                          | Space |
|-------------------------------------|--------------------------------|-------|
| `leastInterval`                     | O(time · alphabet size) — bounded scan for the max count each tick | O(alphabet size) |
| `HitCounter.hit` / `getHits`        | O(1) amortized (each hit enqueued/dequeued once) | O(hits in window) |
| `RecentCounter.ping`                | O(1) amortized (each ping enqueued/dequeued once) | O(pings in window) |

Both the hit counter and recent-call counter do O(1) amortized work per
call because every timestamp is enqueued exactly once and dequeued at most
once, no matter how many queries are made against it.

## Walkthrough

`06-task-scheduling.ts` imports `LinkedListQueue` from lesson 02.

`leastInterval` (LeetCode 621) counts how often each task type appears,
then simulates time unit by unit. `counts` holds the remaining occurrence
counts of task types that are currently eligible to run; `cooldownQueue`
holds `[remainingCount, readyAt]` pairs for task types that just ran and
must wait until `readyAt` before rejoining `counts`. Each tick first checks
whether the front of `cooldownQueue` has become eligible (`readyAt ===
time`) and merges it back into `counts` if so, then greedily runs whichever
eligible task has the highest remaining count, re-queuing its leftover
count with `readyAt = time + n + 1`. The loop ends once nothing is running
and nothing is cooling down; `time` at that point is the answer.

`HitCounter` (LeetCode 362) enqueues every `hit(timestamp)` and, on
`getHits(timestamp)`, evicts from the front while the oldest timestamp
falls outside the trailing 300-second window (`<= timestamp - 300`).
Because timestamps only increase, the remaining queue size after eviction
is exactly the hit count still in range.

`RecentCounter` is an exercise solving LeetCode 933: `ping(t)` enqueues
`t`, evicts from the front while the oldest recorded time is `< t - 3000`,
and returns the resulting queue size — the number of pings in the last
3000 milliseconds.

## LeetCode practice

- 621. Task Scheduler (Medium)
- 362. Design Hit Counter (Medium)
- 933. Number of Recent Calls (Easy)

## Key takeaways

- "How many recent events satisfy a time window" is solved by enqueuing
  every event once and evicting expired ones from the front — never
  rescanning the whole history.
- Cooldown/eligibility scheduling (Task Scheduler) is the mirror image:
  instead of evicting expired items, a secondary queue holds items until
  they become eligible again, then merges them back into the active pool.
- Both patterns give O(1) amortized work per operation because each item
  is enqueued and dequeued at most once over the item's lifetime.
- Simulation-based solutions like these trade a small constant-factor
  overhead (per-tick scanning, per-call eviction) for code that mirrors the
  problem statement directly, which makes correctness easier to verify.

Companion code: [`06-task-scheduling.ts`](./06-task-scheduling.ts)
