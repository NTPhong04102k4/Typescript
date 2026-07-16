// Companion code for ./01-array-fundamentals.md

/** A single simulated memory cell: which index lives at which address. */
export interface MemoryCell {
  readonly index: number;
  readonly address: number;
}

/** address(i) = base + i * elementSize -- the arithmetic behind O(1) indexing. */
export function getElementAddress(
  baseAddress: number,
  elementSize: number,
  index: number
): number {
  return baseAddress + index * elementSize;
}

/** Build the full memory layout for an array of the given length. */
export function simulateMemoryLayout(
  baseAddress: number,
  elementSize: number,
  length: number
): MemoryCell[] {
  const cells: MemoryCell[] = [];
  for (let i = 0; i < length; i++) {
    cells.push({ index: i, address: getElementAddress(baseAddress, elementSize, i) });
  }
  return cells;
}

/** O(1) indexed access with an explicit bounds check. */
export function randomAccess<T>(arr: readonly T[], index: number): T {
  if (!Number.isInteger(index) || index < 0 || index >= arr.length) {
    throw new RangeError(`Index ${index} out of bounds for array of length ${arr.length}`);
  }
  return arr[index];
}

/** O(n) baseline search: walk every element until a match is found. */
export function linearSearch<T>(arr: readonly T[], target: T): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// Exercise: write isValidIndex(arr, index) that returns whether an index
// access would be safe, without throwing.
// Solution:
export function isValidIndex<T>(arr: readonly T[], index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < arr.length;
}

// Exercise: write addressesForSlice(baseAddress, elementSize, start, end)
// that returns the memory cells for indices in [start, end).
// Solution:
export function addressesForSlice(
  baseAddress: number,
  elementSize: number,
  start: number,
  end: number
): MemoryCell[] {
  const cells: MemoryCell[] = [];
  for (let i = start; i < end; i++) {
    cells.push({ index: i, address: getElementAddress(baseAddress, elementSize, i) });
  }
  return cells;
}

// LeetCode 1: Two Sum -- single-pass hash map, O(n) time, O(n) space.
export function twoSum(nums: readonly number[], target: number): number[] {
  const seenAt = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    const complementIndex = seenAt.get(complement);
    if (complementIndex !== undefined) {
      return [complementIndex, i];
    }
    seenAt.set(nums[i], i);
  }
  return [];
}

// --- run ---
if (require.main === module) {
  const layout = simulateMemoryLayout(1000, 8, 5);
  console.log('Memory layout:', layout);
  console.assert(layout[0].address === 1000, 'index 0 should sit at the base address');
  console.assert(layout[4].address === 1032, 'index 4 should be base + 4 * elementSize');

  const nums = [10, 20, 30, 40];
  console.assert(randomAccess(nums, 2) === 30, 'randomAccess(2) should be 30');
  console.assert(linearSearch(nums, 40) === 3, 'linearSearch should find 40 at index 3');
  console.assert(linearSearch(nums, 99) === -1, 'linearSearch should return -1 for a missing value');

  console.assert(isValidIndex(nums, 3) === true, 'index 3 is valid');
  console.assert(isValidIndex(nums, 4) === false, 'index 4 is out of bounds');

  const slice = addressesForSlice(1000, 8, 1, 3);
  console.assert(
    slice.length === 2 && slice[0].address === 1008 && slice[1].address === 1016,
    'slice addresses should match indices 1 and 2'
  );

  console.assert(
    JSON.stringify(twoSum([2, 7, 11, 15], 9)) === JSON.stringify([0, 1]),
    'twoSum should find indices [0, 1] for target 9'
  );

  console.log('All lesson 01 checks passed.');
}
