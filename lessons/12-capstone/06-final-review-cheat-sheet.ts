// Companion code for ./06-final-review-cheat-sheet.md
// No new algorithms here — a typed, queryable version of the review table.

export interface DataStructureProfile {
  readonly name: string;
  readonly access: string;
  readonly search: string;
  readonly insert: string;
  readonly delete: string;
  readonly useWhen: string;
}

export const dataStructureCheatSheet: readonly DataStructureProfile[] = [
  {
    name: 'Array',
    access: 'O(1) by index',
    search: 'O(n)',
    insert: 'O(n) worst, O(1) amortized push at end',
    delete: 'O(n)',
    useWhen: 'Index-based access, cache-friendly iteration',
  },
  {
    name: 'String (immutable)',
    access: 'O(1) read char',
    search: 'O(n)',
    insert: 'O(n) (rebuilds on concat)',
    delete: 'O(n)',
    useWhen: 'Text; batch-build instead of repeated += ',
  },
  {
    name: 'Linked List (singly/doubly)',
    access: 'O(n)',
    search: 'O(n)',
    insert: 'O(1) at a known node',
    delete: 'O(1) at a known node',
    useWhen: 'Frequent insert/delete without shifting',
  },
  {
    name: 'Stack (LIFO)',
    access: 'O(n)',
    search: 'O(n)',
    insert: 'O(1) push',
    delete: 'O(1) pop',
    useWhen: 'Undo, DFS, expression parsing, monotonic stack',
  },
  {
    name: 'Queue (FIFO)',
    access: 'O(n)',
    search: 'O(n)',
    insert: 'O(1) enqueue',
    delete: 'O(1) dequeue',
    useWhen: 'BFS, task scheduling, rate limiting',
  },
  {
    name: 'Heap (Priority Queue)',
    access: 'O(1) peek min/max',
    search: 'O(n)',
    insert: 'O(log n)',
    delete: 'O(log n) extract',
    useWhen: 'Top-K, k-way merge, running median, scheduling',
  },
  {
    name: 'Map / Set (hash table)',
    access: 'O(1) avg',
    search: 'O(1) avg',
    insert: 'O(1) avg',
    delete: 'O(1) avg',
    useWhen: 'Fast lookup, dedupe, frequency counting',
  },
  {
    name: 'Tree (balanced BST)',
    access: 'O(log n)',
    search: 'O(log n)',
    insert: 'O(log n)',
    delete: 'O(log n)',
    useWhen: 'Ordered data with fast search + range queries',
  },
  {
    name: 'Graph (adjacency list)',
    access: 'O(1) per neighbor list',
    search: 'O(V + E) traversal',
    insert: 'O(1) add edge',
    delete: 'O(degree)',
    useWhen: 'Relationships/networks; pick the algorithm per question',
  },
];

/** Looks up a single profile by exact structure name, e.g. "Heap (Priority Queue)". */
export function describeStructure(name: string): DataStructureProfile | undefined {
  return dataStructureCheatSheet.find((profile) => profile.name === name);
}

export type Need =
  | 'index-access'
  | 'order-preserving-lookup'
  | 'lifo'
  | 'fifo'
  | 'top-k'
  | 'ordered-range-search'
  | 'many-to-many-relationships';

// Exercise: implement recommendStructure(need) so it returns the structure
// name(s) that satisfy that access pattern, using an exhaustive switch (no
// default case) so TypeScript flags any missing Need at compile time.

// Solution:
export function recommendStructure(need: Need): string[] {
  switch (need) {
    case 'index-access':
      return ['Array'];
    case 'order-preserving-lookup':
      return ['Map / Set (hash table)'];
    case 'lifo':
      return ['Stack (LIFO)'];
    case 'fifo':
      return ['Queue (FIFO)'];
    case 'top-k':
      return ['Heap (Priority Queue)'];
    case 'ordered-range-search':
      return ['Tree (balanced BST)'];
    case 'many-to-many-relationships':
      return ['Graph (adjacency list)'];
  }
}

// --- run ---
if (require.main === module) {
  console.assert(
    dataStructureCheatSheet.length === 9,
    'cheat sheet should have exactly 9 entries, one per structure in the curriculum'
  );

  const heapProfile = describeStructure('Heap (Priority Queue)');
  console.assert(
    heapProfile !== undefined && heapProfile.insert === 'O(log n)',
    'Heap (Priority Queue) profile should report O(log n) insert'
  );

  console.assert(
    describeStructure('Not A Real Structure') === undefined,
    'describeStructure should return undefined for an unknown name'
  );

  console.assert(
    JSON.stringify(recommendStructure('fifo')) === JSON.stringify(['Queue (FIFO)']),
    'fifo need should recommend Queue (FIFO)'
  );
  console.assert(
    JSON.stringify(recommendStructure('top-k')) === JSON.stringify(['Heap (Priority Queue)']),
    'top-k need should recommend Heap (Priority Queue)'
  );
  console.assert(
    JSON.stringify(recommendStructure('many-to-many-relationships')) ===
      JSON.stringify(['Graph (adjacency list)']),
    'many-to-many-relationships need should recommend Graph (adjacency list)'
  );

  console.log('06-final-review-cheat-sheet: all assertions passed');
}
