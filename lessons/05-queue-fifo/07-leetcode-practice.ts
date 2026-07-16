// Companion code for ./07-leetcode-practice.md

import { LinkedListQueue } from './02-implementing-queue';

// LeetCode 2073: Time Needed to Buy Tickets (Easy)
// Simulates the ticket line: each person at the front buys exactly one
// ticket and either re-joins the back of the queue (if they still want
// more) or leaves. The person originally at index `k` is tracked by index,
// not identity, so once their ticket count hits zero we know exactly how
// many units of time have elapsed.
export function timeRequiredToBuy(tickets: number[], k: number): number {
  const queue = new LinkedListQueue<number>();
  for (let i = 0; i < tickets.length; i++) queue.enqueue(i);

  let time = 0;
  while (!queue.isEmpty()) {
    const idx = queue.dequeue() as number;
    time++;
    tickets[idx]--;

    if (idx === k && tickets[idx] === 0) return time;
    if (tickets[idx] > 0) queue.enqueue(idx);
  }

  return time;
}

// LeetCode 950: Reveal Cards In Increasing Order (Medium)
// Works backwards from the reveal process: sort the deck, then replay the
// "reveal front, move next card to the bottom" rule against a queue of
// *positions* (0..n-1) instead of cards. Whichever position is dequeued
// first receives the smallest remaining card, since that's the order the
// real reveal process would expose them in.
export function deckRevealedIncreasing(deck: number[]): number[] {
  const n = deck.length;
  const sorted = [...deck].sort((a, b) => a - b);
  const positions = new LinkedListQueue<number>();
  for (let i = 0; i < n; i++) positions.enqueue(i);

  const result = new Array<number>(n);
  for (const card of sorted) {
    const position = positions.dequeue() as number;
    result[position] = card;

    if (!positions.isEmpty()) {
      const next = positions.dequeue() as number;
      positions.enqueue(next);
    }
  }

  return result;
}

// LeetCode 649: Dota2 Senate (Medium)
// Two queues hold the original indices of Radiant and Dire senators. Each
// round, the earliest-indexed senator from each party bans the other; the
// survivor re-enters the back of their own queue with index + n, which
// both preserves turn order and pushes them behind everyone else already
// waiting for this round. The party whose queue empties first loses.
export function predictPartyVictory(senate: string): string {
  const n = senate.length;
  const radiant = new LinkedListQueue<number>();
  const dire = new LinkedListQueue<number>();

  for (let i = 0; i < n; i++) {
    if (senate[i] === 'R') radiant.enqueue(i);
    else dire.enqueue(i);
  }

  while (!radiant.isEmpty() && !dire.isEmpty()) {
    const r = radiant.dequeue() as number;
    const d = dire.dequeue() as number;
    if (r < d) radiant.enqueue(r + n);
    else dire.enqueue(d + n);
  }

  return radiant.isEmpty() ? 'Dire' : 'Radiant';
}

// LeetCode 127: Word Ladder (Hard)
// BFS over an implicit graph where each word is connected to every word
// reachable by changing a single letter. Because BFS explores the graph in
// strictly increasing distance order, the first time `endWord` is dequeued
// its associated length is guaranteed to be the shortest transformation
// sequence's length.
export function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const queue = new LinkedListQueue<[word: string, length: number]>();
  queue.enqueue([beginWord, 1]);
  const visited = new Set<string>([beginWord]);

  while (!queue.isEmpty()) {
    const [word, length] = queue.dequeue() as [string, number];
    if (word === endWord) return length;

    for (let i = 0; i < word.length; i++) {
      for (const ch of alphabet) {
        if (ch === word[i]) continue;
        const candidate = word.slice(0, i) + ch + word.slice(i + 1);
        if (wordSet.has(candidate) && !visited.has(candidate)) {
          visited.add(candidate);
          queue.enqueue([candidate, length + 1]);
        }
      }
    }
  }

  return 0;
}

// Exercise: LeetCode 1823, Find the Winner of the Circular Game (Medium).
// `n` friends numbered 1..n stand in a circle; starting from friend 1 and
// counting clockwise, every k-th friend leaves the circle, and counting
// resumes from the next friend. Return the number of the friend who wins
// (the last one remaining).
// Solution:
export function findTheWinner(n: number, k: number): number {
  const queue = new LinkedListQueue<number>();
  for (let i = 1; i <= n; i++) queue.enqueue(i);

  while (queue.size > 1) {
    for (let i = 0; i < k - 1; i++) {
      queue.enqueue(queue.dequeue() as number);
    }
    queue.dequeue();
  }

  return queue.dequeue() as number;
}

// --- run ---
if (require.main === module) {
  console.assert(timeRequiredToBuy([2, 3, 2], 2) === 6, 'LeetCode 2073 example 1');
  console.assert(timeRequiredToBuy([5, 1, 1, 1], 0) === 8, 'LeetCode 2073 example 2');

  console.assert(
    JSON.stringify(deckRevealedIncreasing([17, 13, 11, 2, 3, 5, 7])) ===
      JSON.stringify([2, 13, 3, 11, 5, 17, 7]),
    'LeetCode 950 example'
  );

  console.assert(predictPartyVictory('RD') === 'Radiant', 'LeetCode 649 example 1');
  console.assert(predictPartyVictory('RDD') === 'Dire', 'LeetCode 649 example 2');

  console.assert(
    ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']) === 5,
    'LeetCode 127 example 1: hit -> hot -> dot -> dog -> cog'
  );
  console.assert(
    ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']) === 0,
    'LeetCode 127 example 2: endWord is absent from the word list'
  );

  console.assert(findTheWinner(5, 2) === 3, 'LeetCode 1823 example 1');
  console.assert(findTheWinner(6, 5) === 1, 'LeetCode 1823 example 2');

  console.log('All lesson 07 checks passed.');
}
