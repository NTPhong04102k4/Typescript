// Companion code for ./06-task-scheduling.md

import { LinkedListQueue } from './02-implementing-queue';

// LeetCode 621: Task Scheduler (Medium)
// Simulates the CPU one time unit at a time. `counts` holds the remaining
// occurrences of each task type that are currently eligible to run (no
// cooldown active); `cooldownQueue` holds [remainingCount, timeItBecomesEligible]
// pairs for task types that just ran and must wait `n` full units before
// running again. At each tick we first move any task whose cooldown has
// just expired back into `counts`, then greedily run whichever eligible
// task has the highest remaining count (ties broken arbitrarily -- the
// total completion time doesn't depend on which same-count task is chosen).
export function leastInterval(tasks: string[], n: number): number {
  const frequency = new Map<string, number>();
  for (const task of tasks) {
    frequency.set(task, (frequency.get(task) ?? 0) + 1);
  }

  const counts: number[] = [...frequency.values()];
  const cooldownQueue = new LinkedListQueue<[count: number, readyAt: number]>();
  let time = 0;

  while (counts.length > 0 || !cooldownQueue.isEmpty()) {
    time++;

    const front = cooldownQueue.peek();
    if (front !== undefined && front[1] === time) {
      const [readyCount] = cooldownQueue.dequeue() as [number, number];
      counts.push(readyCount);
    }

    if (counts.length > 0) {
      let maxIndex = 0;
      for (let i = 1; i < counts.length; i++) {
        if (counts[i] > counts[maxIndex]) maxIndex = i;
      }
      const count = counts[maxIndex];
      counts.splice(maxIndex, 1);

      const remaining = count - 1;
      if (remaining > 0) {
        cooldownQueue.enqueue([remaining, time + n + 1]);
      }
    }
  }

  return time;
}

// LeetCode 362: Design Hit Counter (Medium)
// Every hit is enqueued with its timestamp; getHits evicts timestamps that
// have aged out of the trailing 300-second window before reporting size.
// Because timestamps only ever increase, the queue's front is always the
// oldest hit, so eviction never has to look past the front.
export class HitCounter {
  private readonly queue = new LinkedListQueue<number>();

  hit(timestamp: number): void {
    this.queue.enqueue(timestamp);
  }

  getHits(timestamp: number): number {
    while (!this.queue.isEmpty() && (this.queue.peek() as number) <= timestamp - 300) {
      this.queue.dequeue();
    }
    return this.queue.size;
  }
}

// Exercise: LeetCode 933, Number of Recent Calls (Easy). Implement a
// `RecentCounter` whose `ping(t)` records a call at time `t` (milliseconds)
// and returns how many calls occurred in the inclusive window
// [t - 3000, t]. Calls are guaranteed to arrive in non-decreasing order of
// `t`, so a queue only ever needs to evict from the front.
// Solution:
export class RecentCounter {
  private readonly queue = new LinkedListQueue<number>();

  ping(t: number): number {
    this.queue.enqueue(t);
    while (!this.queue.isEmpty() && (this.queue.peek() as number) < t - 3000) {
      this.queue.dequeue();
    }
    return this.queue.size;
  }
}

// --- run ---
if (require.main === module) {
  console.assert(
    leastInterval(['A', 'A', 'A', 'B', 'B', 'B'], 2) === 8,
    'LeetCode 621 example 1: AB_AB_AB needs 8 intervals with n=2'
  );
  console.assert(
    leastInterval(['A', 'A', 'A', 'B', 'B', 'B'], 0) === 6,
    'LeetCode 621 example: no cooldown means no idle time, 6 tasks take 6 intervals'
  );

  const hitCounter = new HitCounter();
  hitCounter.hit(1);
  hitCounter.hit(2);
  hitCounter.hit(3);
  console.assert(hitCounter.getHits(4) === 3, 'all three hits are within the last 300 seconds at t=4');
  hitCounter.hit(300);
  console.assert(hitCounter.getHits(300) === 4, 'the hit at t=1 is still within [0, 300] at t=300');
  console.assert(hitCounter.getHits(301) === 3, 'the hit at t=1 ages out once the window becomes [1, 301]');

  const recentCounter = new RecentCounter();
  console.assert(recentCounter.ping(1) === 1, 'first ping is always the only one in its own window');
  console.assert(recentCounter.ping(100) === 2, 'both pings so far are within [ -2900, 100]');
  console.assert(recentCounter.ping(3001) === 3, 'all three pings are within [1, 3001]');
  console.assert(recentCounter.ping(3002) === 3, 'the ping at t=1 ages out of the window [2, 3002]');

  console.log('All lesson 06 checks passed.');
}
