// Companion code for ./01-bit-fundamentals.md

/**
 * Renders the low `width` bits of `value` as a binary string (most significant
 * bit first). Uses `>>> 0` first so negative numbers show their 32-bit two's
 * complement form instead of a leading minus sign.
 */
export function toBinary(value: number, width = 8): string {
  return (value >>> 0).toString(2).padStart(width, '0').slice(-width);
}

/** Parses a binary string like "1011" back into a number. */
export function fromBinary(bits: string): number {
  return parseInt(bits, 2);
}

/** Bitwise AND: a bit is 1 only where both inputs have a 1. */
export function bitAnd(a: number, b: number): number {
  return a & b;
}

/** Bitwise OR: a bit is 1 where either input has a 1. */
export function bitOr(a: number, b: number): number {
  return a | b;
}

/** Bitwise XOR: a bit is 1 where the inputs differ. */
export function bitXor(a: number, b: number): number {
  return a ^ b;
}

/** Bitwise NOT: flips every bit. In JS this equals -(x + 1) because of two's complement. */
export function bitNot(a: number): number {
  return ~a;
}

/** Left shift: multiply by 2^amount (low bits filled with 0). */
export function shiftLeft(value: number, amount: number): number {
  return value << amount;
}

/** Arithmetic right shift: divides by 2^amount, keeping (sign-extending) the sign bit. */
export function shiftRight(value: number, amount: number): number {
  return value >> amount;
}

/** Logical right shift: fills vacated high bits with 0, treating `value` as unsigned 32-bit. */
export function shiftRightUnsigned(value: number, amount: number): number {
  return value >>> amount;
}

// Exercise: return true when the number is negative by inspecting its sign bit
// (bit 31) rather than comparing with `< 0`. Treat the value as a 32-bit int.
export function isNegativeBySignBitStub(_value: number): boolean {
  throw new Error('not implemented');
}
// Solution:
export function isNegativeBySignBit(value: number): boolean {
  return ((value >>> 31) & 1) === 1;
}

// Exercise: given a signed 32-bit `value`, return the same bit pattern read as
// an unsigned integer in the range 0 .. 4294967295.
export function toUnsigned32Stub(_value: number): number {
  throw new Error('not implemented');
}
// Solution:
export function toUnsigned32(value: number): number {
  return value >>> 0;
}

// --- run ---
if (require.main === module) {
  console.assert(toBinary(5) === '00000101', '5 is 00000101 in 8 bits');
  console.assert(toBinary(0) === '00000000', '0 is all zeros');
  console.assert(fromBinary('1011') === 11, '1011 parses to 11');
  console.assert(toBinary(fromBinary('1011')) === '00001011', 'round trip through binary');

  console.assert(bitAnd(0b1100, 0b1010) === 0b1000, '1100 AND 1010 = 1000');
  console.assert(bitOr(0b1100, 0b1010) === 0b1110, '1100 OR 1010 = 1110');
  console.assert(bitXor(0b1100, 0b1010) === 0b0110, '1100 XOR 1010 = 0110');

  // NOT and two's complement: ~x === -(x + 1).
  console.assert(bitNot(0) === -1, '~0 is -1');
  console.assert(bitNot(5) === -6, '~5 is -6, i.e. -(5 + 1)');

  console.assert(shiftLeft(1, 4) === 16, '1 << 4 = 16 (2^4)');
  console.assert(shiftRight(-8, 1) === -4, '-8 >> 1 = -4 (sign preserved)');

  // The key difference between >> and >>>: sign extension vs. zero fill.
  console.assert(shiftRight(-1, 28) === -1, '-1 >> 28 stays -1 (sign bit copied down)');
  console.assert(shiftRightUnsigned(-1, 28) === 15, '-1 >>> 28 = 15 (high bits zero-filled)');
  console.assert(toUnsigned32(-1) === 4294967295, '-1 as unsigned 32-bit is 2^32 - 1');

  console.assert(isNegativeBySignBit(-1) === true, 'sign bit of -1 is set');
  console.assert(isNegativeBySignBit(7) === false, 'sign bit of 7 is clear');

  console.log('01-bit-fundamentals: all assertions passed');
}
