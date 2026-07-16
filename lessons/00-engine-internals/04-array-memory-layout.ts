// Companion code for ./04-array-memory-layout.md
import { performance } from 'perf_hooks';

// --- V8 "elements kind" model ---
//
// V8 tags every array with an internal "elements kind" describing both how
// values are stored (SMI / double / tagged pointer) and whether the backing
// store is contiguous ("packed") or has gaps ("holey"). Both dimensions
// only ever escalate toward "more general" -- an array can go from
// SMI -> double -> tagged, and from packed -> holey, but never backward.
// This file models that lattice explicitly.

export type ValueKind = 'smi' | 'double' | 'tagged';
export type Packedness = 'packed' | 'holey';

export type ElementsKind =
  | 'PACKED_SMI_ELEMENTS'
  | 'HOLEY_SMI_ELEMENTS'
  | 'PACKED_DOUBLE_ELEMENTS'
  | 'HOLEY_DOUBLE_ELEMENTS'
  | 'PACKED_ELEMENTS'
  | 'HOLEY_ELEMENTS';

const VALUE_KIND_RANK: Record<ValueKind, number> = { smi: 0, double: 1, tagged: 2 };
const PACKEDNESS_RANK: Record<Packedness, number> = { packed: 0, holey: 1 };

// V8's small-integer (SMI) range is pointer-tagged and machine-word-sized;
// 2**30 is a close, pedagogically useful approximation of the 31-bit range
// used on 32-bit builds (64-bit builds have more headroom, but the
// packed-vs-boxed distinction is the same).
const SMI_MAX = 2 ** 30 - 1;
const SMI_MIN = -(2 ** 30);

function combineElementsKind(valueKind: ValueKind, packedness: Packedness): ElementsKind {
  const valuePart = valueKind === 'smi' ? 'SMI_ELEMENTS' : valueKind === 'double' ? 'DOUBLE_ELEMENTS' : 'ELEMENTS';
  const prefix = packedness === 'packed' ? 'PACKED' : 'HOLEY';
  return `${prefix}_${valuePart}` as ElementsKind;
}

/** Simulates V8's elements-kind transitions for a JS array. */
export class TrackedArray<T> {
  private readonly data: (T | undefined)[] = [];
  private valueKind: ValueKind = 'smi';
  private packedness: Packedness = 'packed';

  static classify(value: unknown): ValueKind {
    if (typeof value === 'number') {
      return Number.isInteger(value) && value >= SMI_MIN && value <= SMI_MAX ? 'smi' : 'double';
    }
    return 'tagged';
  }

  push(value: T): void {
    this.absorbValueKind(value);
    this.data.push(value);
  }

  setAt(index: number, value: T): void {
    this.absorbValueKind(value);
    if (index > this.data.length) {
      this.packedness = 'holey'; // a gap was introduced before this index
    }
    this.data[index] = value;
  }

  deleteAt(index: number): void {
    delete this.data[index]; // mirrors `delete arr[i]`: leaves a hole in place
    this.packedness = 'holey';
  }

  private absorbValueKind(value: T): void {
    const kind = TrackedArray.classify(value);
    if (VALUE_KIND_RANK[kind] > VALUE_KIND_RANK[this.valueKind]) {
      this.valueKind = kind; // one-way transition: never back to a more specific kind
    }
  }

  get elementsKind(): ElementsKind {
    return combineElementsKind(this.valueKind, this.packedness);
  }

  get length(): number {
    return this.data.length;
  }

  toArray(): (T | undefined)[] {
    return [...this.data];
  }
}

/** Human-readable one-liner for each elements kind, ordered fastest to slowest. */
export function describeElementsKind(kind: ElementsKind): string {
  switch (kind) {
    case 'PACKED_SMI_ELEMENTS':
      return 'fastest: contiguous small integers, no holes, no boxing';
    case 'PACKED_DOUBLE_ELEMENTS':
      return 'fast: contiguous doubles in an unboxed array, no holes';
    case 'PACKED_ELEMENTS':
      return 'slower: contiguous tagged pointers (mixed/object values), no holes';
    case 'HOLEY_SMI_ELEMENTS':
      return 'slower: small integers but every read needs a hole check';
    case 'HOLEY_DOUBLE_ELEMENTS':
      return 'slower: doubles with hole checks on every read';
    case 'HOLEY_ELEMENTS':
      return 'slowest: tagged pointers with hole checks, the most general kind';
  }
}

// --- Concrete packed vs holey arrays for benchmarking ---

export function createPackedArray(size: number): number[] {
  return Array.from({ length: size }, (_, i) => i);
}

/** Leaves every odd index as a genuine hole (not `undefined` assigned, but absent). */
export function createHoleyArray(size: number): number[] {
  const arr: number[] = new Array(size);
  for (let i = 0; i < size; i += 2) arr[i] = i;
  return arr;
}

/** Sums an array, skipping holes (reads `undefined` at a hole). */
export function sumArray(arr: readonly number[]): number {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    if (value !== undefined) total += value;
  }
  return total;
}

export function timeIt(fn: () => void): number {
  const start = performance.now();
  fn();
  return performance.now() - start;
}

// --- LeetCode 283. Move Zeroes (Easy) ---
// https://leetcode.com/problems/move-zeroes/
// In-place, index-by-index overwrite: never deletes an index and never
// widens the value kind, so the array stays PACKED_SMI_ELEMENTS throughout.
export function moveZeroes(nums: number[]): void {
  let insertPos = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[insertPos] = nums[i];
      insertPos++;
    }
  }
  for (let i = insertPos; i < nums.length; i++) {
    nums[i] = 0;
  }
}

// --- LeetCode 448. Find All Numbers Disappeared in an Array (Easy) ---
// https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/
// Uses the array itself as a presence bitmap via sign-flipping -- no
// auxiliary Set/Map, no holes introduced, values stay numeric.
export function findDisappearedNumbers(nums: number[]): number[] {
  for (let i = 0; i < nums.length; i++) {
    const index = Math.abs(nums[i]) - 1;
    if (nums[index] > 0) nums[index] = -nums[index];
  }
  const missing: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) missing.push(i + 1);
  }
  return missing;
}

// --- LeetCode 41. First Missing Positive (Hard) ---
// https://leetcode.com/problems/first-missing-positive/
// Cyclic sort places each value `v` at index `v - 1` via swaps, staying
// entirely in place with numeric values -- the packed-array analogue of
// a perfect hash.
export function firstMissingPositive(nums: number[]): number {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const target = nums[i] - 1;
      [nums[i], nums[target]] = [nums[target], nums[i]];
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}

// Exercise: Implement `wouldStayPacked`, which reports whether calling
// `setAt(index, value)` on `existing` would introduce a hole (it would iff
// `index` is more than one past the current length).
export function wouldStayPackedStub<T>(_existing: TrackedArray<T>, _index: number): boolean {
  throw new Error('not implemented');
}
// Solution:
export function wouldStayPacked<T>(existing: TrackedArray<T>, index: number): boolean {
  return index <= existing.length;
}

// Exercise: Implement `boxingOverheadRank`, returning how many escalation
// steps a value kind is above 'smi' (smi=0, double=1, tagged=2), useful for
// scoring "how much did this array's storage get more expensive."
export function boxingOverheadRankStub(_kind: ValueKind): number {
  throw new Error('not implemented');
}
// Solution:
export function boxingOverheadRank(kind: ValueKind): number {
  return VALUE_KIND_RANK[kind];
}

// --- run ---
if (require.main === module) {
  const smiArray = new TrackedArray<number>();
  smiArray.push(1);
  smiArray.push(2);
  console.assert(smiArray.elementsKind === 'PACKED_SMI_ELEMENTS', 'two small ints should stay PACKED_SMI_ELEMENTS');

  smiArray.push(3.5);
  console.assert(
    smiArray.elementsKind === 'PACKED_DOUBLE_ELEMENTS',
    'adding a double should escalate to PACKED_DOUBLE_ELEMENTS'
  );

  smiArray.deleteAt(0);
  console.assert(
    smiArray.elementsKind === 'HOLEY_DOUBLE_ELEMENTS',
    'deleting an index should escalate to holey, keeping the double value kind'
  );

  const mixedArray = new TrackedArray<number | string>();
  mixedArray.push(1);
  mixedArray.push(2);
  console.assert(mixedArray.elementsKind === 'PACKED_SMI_ELEMENTS', 'two ints should stay PACKED_SMI_ELEMENTS');
  mixedArray.push('three');
  console.assert(
    mixedArray.elementsKind === 'PACKED_ELEMENTS',
    'adding a string should escalate straight to PACKED_ELEMENTS (still no holes)'
  );

  console.assert(wouldStayPacked(mixedArray, 3) === true, 'appending at the current length should stay packed');
  console.assert(wouldStayPacked(mixedArray, 10) === false, 'skipping ahead should introduce a hole');

  console.assert(boxingOverheadRank('smi') === 0, 'smi is the baseline, rank 0');
  console.assert(boxingOverheadRank('tagged') === 2, 'tagged is the most general, rank 2');

  const packed = createPackedArray(10);
  const holey = createHoleyArray(10);
  console.assert(sumArray(packed) === 45, 'sum of 0..9 should be 45');
  console.assert(sumArray(holey) === 20, 'sum of even indices 0,2,4,6,8 should be 20');

  const packedTime = timeIt(() => sumArray(createPackedArray(200_000)));
  const holeyTime = timeIt(() => sumArray(createHoleyArray(200_000)));
  console.log(`packed sum: ${packedTime.toFixed(3)}ms, holey sum: ${holeyTime.toFixed(3)}ms`);

  const zeroesInput = [0, 1, 0, 3, 12];
  moveZeroes(zeroesInput);
  console.assert(zeroesInput.join(',') === '1,3,12,0,0', 'moveZeroes should compact non-zeroes to the front');

  console.assert(
    findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1]).join(',') === '5,6',
    'missing numbers should be [5, 6]'
  );

  console.assert(firstMissingPositive([3, 4, -1, 1]) === 2, 'first missing positive should be 2');
  console.assert(firstMissingPositive([1, 2, 0]) === 3, 'first missing positive should be 3');

  console.log('04-array-memory-layout: all assertions passed');
}
