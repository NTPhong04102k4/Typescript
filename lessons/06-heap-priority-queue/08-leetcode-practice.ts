// Companion code for ./08-leetcode-practice.md
import { MinHeap, MaxHeap, ascending } from './02-min-max-heap';

// --- LeetCode 703. Kth Largest Element in a Stream (Easy) ---
// https://leetcode.com/problems/kth-largest-element-in-a-stream/
// Same size-capped MinHeap<number> as lesson 05's findKthLargest, except
// the heap now persists across calls instead of being rebuilt from an
// array each time -- the streaming version of the same trick.
export class KthLargest {
  private readonly heap = new MinHeap<number>(ascending);

  constructor(private readonly k: number, nums: readonly number[]) {
    for (const n of nums) this.add(n);
  }

  add(val: number): number {
    this.heap.push(val);
    if (this.heap.size > this.k) this.heap.pop();
    return this.heap.peek() as number;
  }
}

// --- LeetCode 1046. Last Stone Weight (Easy) ---
// https://leetcode.com/problems/last-stone-weight/
// Repeatedly smash the two heaviest stones together: pop the top two off
// a max-heap, and if they weren't equal, push the (positive) difference
// back in. The last stone standing (or 0 if everything cancels out) wins.
export function lastStoneWeight(stones: readonly number[]): number {
  const maxHeap = new MaxHeap<number>(ascending, stones);
  while (maxHeap.size > 1) {
    const a = maxHeap.pop() as number;
    const b = maxHeap.pop() as number;
    if (a !== b) maxHeap.push(a - b);
  }
  return maxHeap.isEmpty() ? 0 : (maxHeap.peek() as number);
}

// --- LeetCode 973. K Closest Points to Origin (Medium) ---
// https://leetcode.com/problems/k-closest-points-to-origin/
// The size-capped-heap pattern from lesson 05, keyed on squared distance
// to the origin instead of raw value (squaring avoids a sqrt for no
// change in ordering).
export function kClosest(points: ReadonlyArray<readonly [number, number]>, k: number): Array<[number, number]> {
  const sqDist = (p: readonly [number, number]): number => p[0] * p[0] + p[1] * p[1];
  const maxHeap = new MaxHeap<[number, number]>((a, b) => sqDist(a) - sqDist(b));
  for (const [x, y] of points) {
    maxHeap.push([x, y]);
    if (maxHeap.size > k) maxHeap.pop();
  }
  return maxHeap.toArray().map((point): [number, number] => [point[0], point[1]]);
}

// --- LeetCode 692. Top K Frequent Words (Medium) ---
// https://leetcode.com/problems/top-k-frequent-words/
// Size-capped MinHeap keyed on count, but count ties break by *reverse*
// alphabetical order -- the alphabetically later word compares smaller,
// so it sits at the root and gets evicted first, leaving the
// alphabetically earlier word behind. Popping the survivors gives
// worst-to-best order, so the final result is reversed.
export function topKFrequentWords(words: readonly string[], k: number): string[] {
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);

  const heap = new MinHeap<[string, number]>((a, b) =>
    a[1] !== b[1] ? a[1] - b[1] : a[0] > b[0] ? -1 : a[0] < b[0] ? 1 : 0
  );
  for (const entry of freq) {
    heap.push(entry);
    if (heap.size > k) heap.pop();
  }

  const result: string[] = [];
  while (!heap.isEmpty()) result.push((heap.pop() as [string, number])[0]);
  return result.reverse();
}

// --- LeetCode 767. Reorganize String (Medium) ---
// https://leetcode.com/problems/reorganize-string/
// Greedily place the currently most frequent character from a max-heap,
// then hold it back for exactly one round (so it can't be placed twice
// in a row) before letting it re-enter the heap. If the heap empties out
// before every character is placed, no valid arrangement exists.
export function reorganizeString(s: string): string {
  const freq = new Map<string, number>();
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);

  const maxHeap = new MaxHeap<[string, number]>((a, b) => a[1] - b[1]);
  for (const entry of freq) maxHeap.push(entry);

  const result: string[] = [];
  let held: [string, number] | null = null;

  while (!maxHeap.isEmpty()) {
    const [ch, count] = maxHeap.pop() as [string, number];
    result.push(ch);
    if (held !== null && held[1] > 0) maxHeap.push(held);
    held = [ch, count - 1];
  }

  return result.length === s.length ? result.join('') : '';
}

// --- LeetCode 621. Task Scheduler (Medium) ---
// https://leetcode.com/problems/task-scheduler/
// Greedily run the currently most frequent task each tick from a
// max-heap of remaining counts, holding a used task in a cooldown queue
// tagged with the tick it becomes eligible again (tick + n), and folding
// it back into the heap once that tick arrives.
export function leastInterval(tasks: readonly string[], n: number): number {
  const freq = new Map<string, number>();
  for (const t of tasks) freq.set(t, (freq.get(t) ?? 0) + 1);

  const maxHeap = new MaxHeap<number>(ascending, [...freq.values()]);
  const cooling: Array<[number, number]> = []; // [remainingCount, eligibleAtTick]
  let time = 0;

  while (!maxHeap.isEmpty() || cooling.length > 0) {
    time++;
    if (!maxHeap.isEmpty()) {
      const remaining = (maxHeap.pop() as number) - 1;
      if (remaining > 0) cooling.push([remaining, time + n]);
    }
    if (cooling.length > 0 && cooling[0][1] === time) {
      const [remaining] = cooling.shift() as [number, number];
      maxHeap.push(remaining);
    }
  }
  return time;
}

// Exercise: mirror KthLargest, but track the k SMALLEST values seen in a
// stream with a size-capped MaxHeap instead of a size-capped MinHeap.
export function kSmallestStreamStub(_k: number, _stream: readonly number[]): number[] {
  throw new Error('not implemented');
}
// Solution:
export function kSmallestStream(k: number, stream: readonly number[]): number[] {
  const maxHeap = new MaxHeap<number>(ascending);
  for (const n of stream) {
    maxHeap.push(n);
    if (maxHeap.size > k) maxHeap.pop();
  }
  return maxHeap.toArray().slice().sort((a, b) => a - b);
}

// --- run ---
if (require.main === module) {
  // KthLargest: hand-traced against LeetCode's own worked example.
  const kthLargest = new KthLargest(3, [4, 5, 8, 2]);
  console.assert(kthLargest.add(3) === 4, 'add(3) should return 4');
  console.assert(kthLargest.add(5) === 5, 'add(5) should return 5');
  console.assert(kthLargest.add(10) === 5, 'add(10) should return 5');
  console.assert(kthLargest.add(9) === 8, 'add(9) should return 8');
  console.assert(kthLargest.add(4) === 8, 'add(4) should return 8');

  // lastStoneWeight: 8&7->1, 4&2->2, 2&1->1, 1&1->0 leaves a single 1.
  console.assert(lastStoneWeight([2, 7, 4, 1, 8, 1]) === 1, 'last stone weight should be 1');
  console.assert(lastStoneWeight([1]) === 1, 'a single stone is its own last weight');

  // kClosest: distances are 10 and 8, so k=1 keeps only the closer point.
  console.assert(
    JSON.stringify(kClosest([[1, 3], [-2, 2]], 1)) === JSON.stringify([[-2, 2]]),
    'the single closest point to the origin should be [-2, 2]'
  );

  // topKFrequentWords: "i" and "love" both appear twice, "coding"/"leetcode" once.
  console.assert(
    JSON.stringify(topKFrequentWords(['i', 'love', 'leetcode', 'i', 'love', 'coding'], 2)) ===
      JSON.stringify(['i', 'love']),
    'top 2 frequent words should be ["i", "love"] in that order'
  );

  // reorganizeString: deterministic traces (no count ties) for a feasible
  // and an infeasible input.
  console.assert(reorganizeString('aab') === 'aba', '"aab" should reorganize to "aba"');
  console.assert(reorganizeString('aaab') === '', '"aaab" has no valid reorganization');

  // A tie-heavy feasible case is checked for validity rather than an exact
  // string, since count ties make the precise character order an
  // implementation detail.
  const arranged = reorganizeString('vvvlo');
  const noAdjacentDuplicates = (str: string): boolean => {
    for (let i = 1; i < str.length; i++) if (str[i] === str[i - 1]) return false;
    return true;
  };
  const sameLetters = (a: string, b: string): boolean => [...a].sort().join('') === [...b].sort().join('');
  console.assert(
    arranged.length === 'vvvlo'.length && noAdjacentDuplicates(arranged) && sameLetters(arranged, 'vvvlo'),
    'reorganizing "vvvlo" should produce a same-length arrangement with no adjacent duplicates'
  );

  // leastInterval: hand-traced against both of LeetCode's worked examples.
  console.assert(leastInterval(['A', 'A', 'A', 'B', 'B', 'B'], 2) === 8, 'cooldown 2 should need 8 total ticks');
  console.assert(leastInterval(['A', 'A', 'A', 'B', 'B', 'B'], 0) === 6, 'cooldown 0 needs no idle ticks at all');

  // kSmallestStream: mirror of KthLargest's trace, but for the smallest 3.
  console.assert(
    JSON.stringify(kSmallestStream(3, [9, 4, 7, 1, 8, 2])) === JSON.stringify([1, 2, 4]),
    'the 3 smallest values of [9,4,7,1,8,2] should be [1,2,4]'
  );

  console.log('08-leetcode-practice: all assertions passed');
}
