// Companion code for ./06-leetcode-practice.md

// LeetCode 852: Peak Index in a Mountain Array -- binary search comparing
// arr[mid] to arr[mid+1] instead of to a target value.
export function peakIndexInMountainArray(arr: readonly number[]): number {
  let low = 0;
  let high = arr.length - 1;
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] < arr[mid + 1]) low = mid + 1; // still climbing -- peak is to the right
    else high = mid; // descending (or at the peak) -- peak is at mid or to its left
  }
  return low;
}

// Minimal singly-linked-list node, matching LeetCode's `ListNode` shape.
export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

/** Builds a linked list from an array, e.g. [1,2,3] -> 1 -> 2 -> 3 -> null. */
export function listFromArray(values: readonly number[]): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy;
  for (const v of values) {
    const node = new ListNode(v);
    tail.next = node;
    tail = node;
  }
  return dummy.next;
}

/** Reads a linked list back into an array, for asserting against expected output. */
export function arrayFromList(node: ListNode | null): number[] {
  const result: number[] = [];
  let current = node;
  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

// LeetCode 21: Merge Two Sorted Lists -- the exact two-pointer merge from
// lesson 02's `merge`, walking `.next` pointers instead of array indices.
export function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy;
  let a = l1;
  let b = l2;
  while (a !== null && b !== null) {
    if (a.val <= b.val) {
      tail.next = a;
      tail = a;
      a = a.next;
    } else {
      tail.next = b;
      tail = b;
      b = b.next;
    }
  }
  tail.next = a !== null ? a : b;
  return dummy.next;
}

export type Interval = readonly [number, number];

// LeetCode 56: Merge Intervals -- sort by start time, then greedily extend
// the last merged interval or start a new one.
export function mergeIntervals(intervals: readonly Interval[]): Interval[] {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [[sorted[0][0], sorted[0][1]]];
  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i];
    const last = merged[merged.length - 1];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
}

// LeetCode 240: Search a 2D Matrix II -- staircase search starting at the
// top-right corner; each step eliminates a full row or column.
export function searchMatrixII(matrix: readonly (readonly number[])[], target: number): boolean {
  if (matrix.length === 0 || matrix[0].length === 0) return false;
  const rows = matrix.length;
  const cols = matrix[0].length;
  let row = 0;
  let col = cols - 1;
  while (row < rows && col >= 0) {
    const value = matrix[row][col];
    if (value === target) return true;
    if (value > target) col--; // too big -- eliminate this column
    else row++; // too small -- eliminate this row
  }
  return false;
}

export type Point = readonly [number, number];

function squaredDistance(p: Point): number {
  return p[0] * p[0] + p[1] * p[1];
}

// LeetCode 973: K Closest Points to Origin (sort) -- sort by a computed key
// (squared distance, avoiding an unnecessary sqrt) instead of the raw value.
export function kClosest(points: readonly Point[], k: number): Point[] {
  return [...points].sort((a, b) => squaredDistance(a) - squaredDistance(b)).slice(0, k);
}

// Exercise: `kClosest` is O(n log n) because it fully sorts. Write
// `kClosestQuickSelect(points, k)` that reuses lesson 02's Lomuto partition
// (keyed on squared distance) to find the k closest points in O(n) average
// time, without fully sorting.
// Solution:
function partitionPoints(arr: Point[], low: number, high: number): number {
  const pivotDist = squaredDistance(arr[high]);
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (squaredDistance(arr[j]) <= pivotDist) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
function quickSelectPoints(arr: Point[], low: number, high: number, targetIndex: number): void {
  if (low >= high) return;
  const pivotIndex = partitionPoints(arr, low, high);
  if (pivotIndex === targetIndex) return;
  if (pivotIndex < targetIndex) quickSelectPoints(arr, pivotIndex + 1, high, targetIndex);
  else quickSelectPoints(arr, low, pivotIndex - 1, targetIndex);
}
export function kClosestQuickSelect(points: readonly Point[], k: number): Point[] {
  const arr = [...points];
  if (k >= arr.length) return arr;
  quickSelectPoints(arr, 0, arr.length - 1, k - 1); // partition so indices [0, k-1] hold the k smallest
  return arr.slice(0, k);
}

// LeetCode 4: Median of Two Sorted Arrays -- binary search a partition index
// `i` in the shorter array (with `j` determined by `i`) so every element
// left of the combined partition is <= every element right of it.
export function findMedianSortedArrays(nums1: readonly number[], nums2: readonly number[]): number {
  let A = nums1;
  let B = nums2;
  if (A.length > B.length) [A, B] = [B, A]; // A is always the shorter (or equal) array

  const m = A.length;
  const n = B.length;
  const half = Math.floor((m + n + 1) / 2);
  let low = 0;
  let high = m;

  while (low <= high) {
    const i = low + Math.floor((high - low) / 2); // elements of A on the left
    const j = half - i; // elements of B on the left

    const aLeft = i === 0 ? -Infinity : A[i - 1];
    const aRight = i === m ? Infinity : A[i];
    const bLeft = j === 0 ? -Infinity : B[j - 1];
    const bRight = j === n ? Infinity : B[j];

    if (aLeft <= bRight && bLeft <= aRight) {
      if ((m + n) % 2 === 1) return Math.max(aLeft, bLeft);
      return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;
    } else if (aLeft > bRight) {
      high = i - 1; // i is too far right -- shrink it
    } else {
      low = i + 1; // i is too far left -- grow it
    }
  }
  throw new Error('findMedianSortedArrays requires both inputs to be sorted');
}

// Exercise: `mergeIntervals` computes the merged ranges. Write
// `canAttendMeetings(intervals)`, the yes/no version (LeetCode 252): can a
// single person attend every meeting with no overlap?
// Solution:
export function canAttendMeetings(intervals: readonly Interval[]): boolean {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i][0] < sorted[i - 1][1]) return false; // next meeting starts before the previous one ends
  }
  return true;
}

// --- run ---
if (require.main === module) {
  console.assert(peakIndexInMountainArray([0, 1, 0]) === 1, 'peakIndexInMountainArray should find index 1');
  console.assert(peakIndexInMountainArray([0, 2, 1, 0]) === 1, 'peakIndexInMountainArray should find index 1');
  console.assert(peakIndexInMountainArray([0, 10, 5, 2]) === 1, 'peakIndexInMountainArray should find index 1');

  const l1 = listFromArray([1, 2, 4]);
  const l2 = listFromArray([1, 3, 4]);
  console.assert(
    JSON.stringify(arrayFromList(mergeTwoLists(l1, l2))) === JSON.stringify([1, 1, 2, 3, 4, 4]),
    'mergeTwoLists should match the LeetCode 21 example'
  );
  console.assert(
    JSON.stringify(arrayFromList(mergeTwoLists(null, listFromArray([0])))) === JSON.stringify([0]),
    'mergeTwoLists should handle an empty first list'
  );

  console.assert(
    JSON.stringify(
      mergeIntervals([
        [1, 3],
        [2, 6],
        [8, 10],
        [15, 18],
      ])
    ) ===
      JSON.stringify([
        [1, 6],
        [8, 10],
        [15, 18],
      ]),
    'mergeIntervals should match the LeetCode 56 example and the lesson trace'
  );

  const matrix = [
    [1, 4, 7, 11, 15],
    [2, 5, 8, 12, 19],
    [3, 6, 9, 16, 22],
    [10, 13, 14, 17, 24],
    [18, 21, 23, 26, 30],
  ];
  console.assert(searchMatrixII(matrix, 5) === true, 'searchMatrixII should find 5');
  console.assert(searchMatrixII(matrix, 20) === false, 'searchMatrixII should not find 20');

  console.assert(
    JSON.stringify(kClosest([[1, 3], [-2, 2]], 1)) === JSON.stringify([[-2, 2]]),
    'kClosest should match the LeetCode 973 example 1'
  );
  const closestTwo = kClosestQuickSelect(
    [
      [3, 3],
      [5, -1],
      [-2, 4],
    ],
    2
  );
  const closestTwoAsSet = new Set(closestTwo.map((p) => JSON.stringify(p)));
  console.assert(
    closestTwoAsSet.has(JSON.stringify([3, 3])) && closestTwoAsSet.has(JSON.stringify([-2, 4])),
    'kClosestQuickSelect should match the LeetCode 973 example 2 (as a set)'
  );

  console.assert(findMedianSortedArrays([1, 3], [2]) === 2, 'findMedianSortedArrays should match LeetCode 4 example 1');
  console.assert(
    findMedianSortedArrays([1, 2], [3, 4]) === 2.5,
    'findMedianSortedArrays should match LeetCode 4 example 2'
  );

  console.assert(
    canAttendMeetings([
      [0, 30],
      [5, 10],
      [15, 20],
    ]) === false,
    'canAttendMeetings should detect the overlap in the LeetCode 252 example 1'
  );
  console.assert(
    canAttendMeetings([
      [7, 10],
      [2, 4],
    ]) === true,
    'canAttendMeetings should allow non-overlapping meetings regardless of input order'
  );

  console.log('All lesson 06 checks passed.');
}
