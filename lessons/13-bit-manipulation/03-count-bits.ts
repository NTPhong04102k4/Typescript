// Companion code for ./03-count-bits.md

/**
 * Population count (Hamming weight) via Brian Kernighan's trick: each
 * `n & (n - 1)` clears the lowest set bit, so the loop runs once per set bit
 * rather than once per bit position. Treats `n` as unsigned 32-bit.
 */
export function popcount(n: number): number {
  let bits = n >>> 0;
  let count = 0;
  while (bits !== 0) {
    bits &= bits - 1; // clear the lowest set bit
    count++;
  }
  return count;
}

/**
 * Counts set bits for every integer 0..n using dynamic programming:
 * `dp[i] = dp[i >> 1] + (i & 1)`. Dropping the last bit of `i` gives a smaller,
 * already-solved subproblem, so each answer is O(1).
 */
export function countBits(n: number): number[] {
  const dp = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}

/** Number of bit positions at which `a` and `b` differ (Hamming distance). */
export function hammingDistance(a: number, b: number): number {
  return popcount(a ^ b);
}

// Exercise: implement popcount by summing bits one position at a time (the
// simple O(bit-width) approach), for contrast with Kernighan's O(set-bits) loop.
export function popcountNaiveStub(_n: number): number {
  throw new Error('not implemented');
}
// Solution:
export function popcountNaive(n: number): number {
  let bits = n >>> 0;
  let count = 0;
  for (let i = 0; i < 32; i++) {
    count += (bits >> i) & 1;
  }
  return count;
}

// --- run ---
if (require.main === module) {
  console.assert(popcount(0) === 0, '0 has no set bits');
  console.assert(popcount(0b1011) === 3, '1011 has 3 set bits');
  console.assert(popcount(255) === 8, '255 has 8 set bits');
  console.assert(popcount(-1) === 32, '-1 as unsigned 32-bit is all ones');

  console.assert(popcountNaive(0b1011) === 3, 'naive popcount agrees on 1011');
  console.assert(popcountNaive(255) === 8, 'naive popcount agrees on 255');

  console.assert(
    JSON.stringify(countBits(5)) === JSON.stringify([0, 1, 1, 2, 1, 2]),
    'countBits(5) = [0,1,1,2,1,2]'
  );
  console.assert(countBits(0).length === 1 && countBits(0)[0] === 0, 'countBits(0) = [0]');

  console.assert(hammingDistance(1, 4) === 2, '0001 vs 0100 differ in 2 positions');
  console.assert(hammingDistance(3, 1) === 1, '0011 vs 0001 differ in 1 position');

  console.log('03-count-bits: all assertions passed');
}
