// Companion code for ./01-queue-fundamentals.md

/** Minimal shape every queue implementation in this topic will satisfy. */
export interface QueueLike<T> {
  enqueue(value: T): void;
  dequeue(): T | undefined;
  peek(): T | undefined;
  readonly size: number;
  isEmpty(): boolean;
}

/**
 * Naive array-backed FIFO queue.
 * enqueue is O(1) amortized (Array#push), but dequeue is O(n) because
 * Array#shift must re-index every remaining element. Lesson 02 fixes this
 * with a circular buffer and a linked-list implementation.
 */
export class Queue<T> implements QueueLike<T> {
  private items: T[] = [];

  enqueue(value: T): void {
    this.items.push(value);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  toArray(): T[] {
    return [...this.items];
  }
}

// Exercise: reverse only the first k elements of a queue, keeping the
// remaining elements in their original relative order.
// Solution:
export function reverseFirstK<T>(queue: Queue<T>, k: number): void {
  if (k <= 0 || k > queue.size) return;

  const stack: T[] = [];
  for (let i = 0; i < k; i++) {
    stack.push(queue.dequeue() as T);
  }
  while (stack.length > 0) {
    queue.enqueue(stack.pop() as T);
  }

  const remaining = queue.size - k;
  for (let i = 0; i < remaining; i++) {
    queue.enqueue(queue.dequeue() as T);
  }
}

// LeetCode 1700: Number of Students Unable to Eat Lunch (Easy)
// Students queue up (FIFO); the sandwich stack's top is compared against
// the queue's front. A match means the student eats and leaves; otherwise
// the student rotates to the back of the queue. If a full rotation passes
// with no match, the rest can never eat.
export function countStudents(students: number[], sandwiches: number[]): number {
  const queue = new Queue<number>();
  for (const student of students) queue.enqueue(student);

  let sandwichIndex = 0;
  let rotationsWithoutMatch = 0;

  while (!queue.isEmpty() && rotationsWithoutMatch < queue.size) {
    const front = queue.dequeue() as number;
    if (front === sandwiches[sandwichIndex]) {
      sandwichIndex++;
      rotationsWithoutMatch = 0;
    } else {
      queue.enqueue(front);
      rotationsWithoutMatch++;
    }
  }

  return queue.size;
}

// --- run ---
if (require.main === module) {
  const queue = new Queue<number>();
  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);
  console.log('front:', queue.peek());
  console.assert(queue.peek() === 1, 'peek returns the front element without removing it');
  console.assert(queue.dequeue() === 1, 'FIFO: the first enqueued value is the first dequeued');
  console.assert(queue.size === 2, 'size reflects one dequeue');

  const q2 = new Queue<number>();
  [1, 2, 3, 4, 5].forEach((v) => q2.enqueue(v));
  reverseFirstK(q2, 3);
  console.assert(
    JSON.stringify(q2.toArray()) === JSON.stringify([3, 2, 1, 4, 5]),
    'reverseFirstK only reverses the first k elements'
  );

  console.assert(countStudents([1, 1, 0, 0], [0, 1, 0, 1]) === 0, 'LeetCode 1700 example 1');
  console.assert(
    countStudents([1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1]) === 3,
    'LeetCode 1700 example 2'
  );

  console.log('All lesson 01 checks passed.');
}
