// Companion code for ./05-prefix-sums.md

/** prefix[i] = sum(arr[0..i-1]); prefix has length arr.length + 1. */
export function buildPrefixSum(arr: readonly number[]): number[] {
  const prefix: number[] = [0];
  for (let i = 0; i < arr.length; i++) {
    prefix.push(prefix[i] + arr[i]);
  }
  return prefix;
}

/** Inclusive range sum arr[left..right] in O(1), given a prebuilt prefix array. */
export function rangeSum(prefix: readonly number[], left: number, right: number): number {
  return prefix[right + 1] - prefix[left];
}

// LeetCode 724: Find Pivot Index.
// Keeps a running left-side total and derives the right-side total from
// the overall sum, avoiding a separate prefix array.
export function pivotIndex(nums: readonly number[]): number {
  const total = nums.reduce((sum, n) => sum + n, 0);
  let leftSum = 0;
  for (let i = 0; i < nums.length; i++) {
    const rightSum = total - leftSum - nums[i];
    if (leftSum === rightSum) return i;
    leftSum += nums[i];
  }
  return -1;
}

/** Create a zero-filled difference array sized for `length` elements. */
export function buildEmptyDifferenceArray(length: number): number[] {
  return new Array(length + 1).fill(0);
}

/** O(1) range update: add `value` to every element in [left, right]. */
export function applyRangeUpdate(diff: number[], left: number, right: number, value: number): void {
  diff[left] += value;
  if (right + 1 < diff.length) diff[right + 1] -= value;
}

/** Materialize the final array from a difference array via a running sum. */
export function reconstructFromDifference(diff: readonly number[], length: number): number[] {
  const result: number[] = [];
  let running = 0;
  for (let i = 0; i < length; i++) {
    running += diff[i];
    result.push(running);
  }
  return result;
}

// Exercise: implement LeetCode 1109, Corporate Flight Bookings -- each
// booking [first, last, seats] (1-indexed, inclusive) adds `seats` to
// every flight in that range; return the seats booked per flight.
// Solution:
export function corpFlightBookings(bookings: ReadonlyArray<readonly [number, number, number]>, n: number): number[] {
  const diff = buildEmptyDifferenceArray(n);
  for (const [first, last, seats] of bookings) {
    applyRangeUpdate(diff, first - 1, last - 1, seats);
  }
  return reconstructFromDifference(diff, n);
}

// Exercise: implement LeetCode 560, Subarray Sum Equals K -- count how
// many contiguous subarrays sum to exactly k, using a running prefix sum
// plus a hash map of prefix-sum frequencies.
// Solution:
export function subarraySum(nums: readonly number[], k: number): number {
  const prefixCount = new Map<number, number>();
  prefixCount.set(0, 1);
  let prefix = 0;
  let count = 0;
  for (const num of nums) {
    prefix += num;
    const needed = prefix - k;
    count += prefixCount.get(needed) ?? 0;
    prefixCount.set(prefix, (prefixCount.get(prefix) ?? 0) + 1);
  }
  return count;
}

// --- run ---
if (require.main === module) {
  const prefix = buildPrefixSum([2, 4, 1, 5, 3]);
  console.assert(JSON.stringify(prefix) === JSON.stringify([0, 2, 6, 7, 12, 15]), 'prefix sums should accumulate correctly');
  console.assert(rangeSum(prefix, 1, 3) === 10, 'sum of arr[1..3] (4+1+5) should be 10');

  console.assert(pivotIndex([1, 7, 3, 6, 5, 6]) === 3, 'index 3 balances left sum 11 and right sum 11');
  console.assert(pivotIndex([1, 2, 3]) === -1, 'no pivot index exists for [1,2,3]');

  const bookings: Array<[number, number, number]> = [
    [1, 2, 10],
    [2, 3, 20],
    [2, 5, 25],
  ];
  console.assert(
    JSON.stringify(corpFlightBookings(bookings, 5)) === JSON.stringify([10, 55, 45, 25, 25]),
    'corpFlightBookings should match the classic LeetCode 1109 example'
  );

  console.assert(subarraySum([1, 1, 1], 2) === 2, 'two subarrays of [1,1,1] sum to 2');
  console.assert(subarraySum([1, 2, 3], 3) === 2, '[1,2] and [3] both sum to 3');

  console.log('All lesson 05 checks passed.');
}
