// Companion code for ./02-bit-tricks.md

/** Reads bit `i` (0 = least significant) as 0 or 1. */
export function getBit(value: number, i: number): number {
  return (value >> i) & 1;
}

/** Returns `value` with bit `i` forced to 1. */
export function setBit(value: number, i: number): number {
  return value | (1 << i);
}

/** Returns `value` with bit `i` forced to 0. */
export function clearBit(value: number, i: number): number {
  return value & ~(1 << i);
}

/** Returns `value` with bit `i` flipped. */
export function toggleBit(value: number, i: number): number {
  return value ^ (1 << i);
}

/** True when `n` is a positive power of two (exactly one bit set). */
export function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

/** Isolates the lowest set bit, e.g. 0b10110 -> 0b00010. Zero for 0. */
export function lowestSetBit(x: number): number {
  return x & -x;
}

/** Clears the lowest set bit, e.g. 0b10110 -> 0b10100. */
export function clearLowestSetBit(x: number): number {
  return x & (x - 1);
}

/** Swaps two numbers in place using XOR (no temporary variable). */
export function xorSwap(a: number, b: number): [number, number] {
  a ^= b;
  b ^= a;
  a ^= b;
  return [a, b];
}

// Exercise: every value in `nums` appears twice except one; return that single
// value. XOR is its own inverse (x ^ x === 0), so every pair cancels out.
export function singleNumberStub(_nums: readonly number[]): number {
  throw new Error('not implemented');
}
// Solution:
export function singleNumber(nums: readonly number[]): number {
  let acc = 0;
  for (const n of nums) acc ^= n;
  return acc;
}

// Exercise: count how many bits differ between a and b (the Hamming distance)
// using clearLowestSetBit on their XOR.
export function bitDifferenceStub(_a: number, _b: number): number {
  throw new Error('not implemented');
}
// Solution:
export function bitDifference(a: number, b: number): number {
  let diff = a ^ b;
  let count = 0;
  while (diff !== 0) {
    diff = clearLowestSetBit(diff);
    count++;
  }
  return count;
}

// --- run ---
if (require.main === module) {
  console.assert(getBit(0b1010, 1) === 1, 'bit 1 of 1010 is 1');
  console.assert(getBit(0b1010, 0) === 0, 'bit 0 of 1010 is 0');

  console.assert(setBit(0b1000, 0) === 0b1001, 'setting bit 0 of 1000 gives 1001');
  console.assert(setBit(0b1001, 0) === 0b1001, 'setting an already-set bit is a no-op');

  console.assert(clearBit(0b1011, 0) === 0b1010, 'clearing bit 0 of 1011 gives 1010');
  console.assert(clearBit(0b1010, 0) === 0b1010, 'clearing an already-clear bit is a no-op');

  console.assert(toggleBit(0b1010, 0) === 0b1011, 'toggling bit 0 of 1010 gives 1011');
  console.assert(toggleBit(0b1011, 0) === 0b1010, 'toggling it again returns to 1010');

  console.assert(isPowerOfTwo(1) === true, '1 = 2^0 is a power of two');
  console.assert(isPowerOfTwo(16) === true, '16 = 2^4 is a power of two');
  console.assert(isPowerOfTwo(6) === false, '6 has two bits set');
  console.assert(isPowerOfTwo(0) === false, '0 is not a power of two');

  console.assert(lowestSetBit(0b10110) === 0b00010, 'lowest set bit of 10110 is 00010');
  console.assert(clearLowestSetBit(0b10110) === 0b10100, 'clearing lowest set bit of 10110 gives 10100');

  console.assert(JSON.stringify(xorSwap(3, 7)) === JSON.stringify([7, 3]), 'xorSwap exchanges the two values');

  console.assert(singleNumber([2, 2, 1]) === 1, '1 is the unpaired value');
  console.assert(singleNumber([4, 1, 2, 1, 2]) === 4, '4 is the unpaired value');

  console.assert(bitDifference(1, 4) === 2, '0001 and 0100 differ in 2 bits');
  console.assert(bitDifference(3, 1) === 1, '0011 and 0001 differ in 1 bit');

  console.log('02-bit-tricks: all assertions passed');
}
