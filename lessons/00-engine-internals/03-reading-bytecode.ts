// Companion code for ./03-reading-bytecode.md
//
// To see real Ignition bytecode for yourself, run (see the .md for details):
//   node --print-bytecode --print-bytecode-filter=add script.js
//
// This file does NOT shell out to node --print-bytecode (that requires a
// separate process and a V8 build that supports the flag). Instead it
// works on a realistic, hand-authored sample of what that command prints,
// so you can practice reading and programmatically analyzing bytecode
// dumps the same way you would read real V8 output.

/** A representative sample of `node --print-bytecode` output for:
 *    function add(a, b) { return a + b; }
 *    add(1, 2);
 * Real output includes hex machine addresses that vary per run; the shape
 * (header fields, `offset : bytes  Mnemonic operands` lines, trailing
 * tables) matches real V8 output.
 */
export const SAMPLE_ADD_BYTECODE_DUMP = `
[generating bytecode for function: add]
Parameter count 3
Register count 1
Frame size 8
   0x2b4c0004a92e @    0 : 25 02             Ldar a1
   0x2b4c0004a930 @    2 : 34 03 00          Add a0, [0]
   0x2b4c0004a933 @    5 : ab                Return
Constant pool (size = 0)
Handler Table (size = 0)
Source Position Table (size = 0)
`;

export interface BytecodeInstruction {
  readonly offset: number;
  readonly opcode: string;
  readonly operands: string;
}

const INSTRUCTION_LINE = /^\s*0x[0-9a-f]+\s+@\s+(\d+)\s+:\s+[0-9a-f]{2}(?:\s[0-9a-f]{2})*\s+(\S+)\s*(.*)$/i;

/** Parses `offset : bytes  Mnemonic operands` lines out of a raw bytecode dump. */
export function parseBytecodeDump(dump: string): BytecodeInstruction[] {
  const instructions: BytecodeInstruction[] = [];
  for (const line of dump.split('\n')) {
    const match = INSTRUCTION_LINE.exec(line);
    if (!match) continue;
    instructions.push({
      offset: Number(match[1]),
      opcode: match[2],
      operands: match[3].trim(),
    });
  }
  return instructions;
}

/** Counts how many times each opcode mnemonic appears. */
export function summarizeBytecode(instructions: readonly BytecodeInstruction[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const instr of instructions) {
    counts[instr.opcode] = (counts[instr.opcode] ?? 0) + 1;
  }
  return counts;
}

/** Extracts the function name from a "[generating bytecode for function: NAME]" header. */
export function extractFunctionName(dump: string): string | null {
  const match = dump.match(/generating bytecode for function:\s*([^\s\]()]+)/);
  return match ? match[1] : null;
}

export interface FrameInfo {
  readonly parameterCount: number;
  readonly registerCount: number;
  readonly frameSize: number;
}

/** Extracts the "Parameter count / Register count / Frame size" header fields. */
export function extractFrameInfo(dump: string): FrameInfo {
  const paramMatch = dump.match(/Parameter count (\d+)/);
  const registerMatch = dump.match(/Register count (\d+)/);
  const frameMatch = dump.match(/Frame size (\d+)/);
  return {
    parameterCount: paramMatch ? Number(paramMatch[1]) : 0,
    registerCount: registerMatch ? Number(registerMatch[1]) : 0,
    frameSize: frameMatch ? Number(frameMatch[1]) : 0,
  };
}

// --- LeetCode 371. Sum of Two Integers (Medium) ---
// https://leetcode.com/problems/sum-of-two-integers/
// Forbidden from using + or -, so you implement addition the way a CPU (and
// the bytecode behind V8's `Add` opcode) actually does it: XOR for the
// sum-without-carry, AND+shift for the carry, repeated until no carry remains.
export function getSum(a: number, b: number): number {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}

// --- LeetCode 191. Number of 1 Bits (Easy) ---
// https://leetcode.com/problems/number-of-1-bits/
// `n & (n - 1)` clears the lowest set bit each iteration -- a single cheap
// bitwise bytecode op per set bit, versus 32 iterations of a naive shift loop.
export function hammingWeight(n: number): number {
  let x = n >>> 0; // treat as an unsigned 32-bit integer
  let count = 0;
  while (x !== 0) {
    x &= x - 1;
    count++;
  }
  return count;
}

// --- LeetCode 169. Majority Element (Easy) ---
// https://leetcode.com/problems/majority-element/
// Two solutions with very different bytecode footprints: a Map-based
// counter (property/element loads through IC-guarded Map ops, see lesson 05)
// vs. Boyer-Moore voting (a handful of arithmetic/comparison ops, no
// allocation at all).

/** O(n) time, O(n) space: count via a hash map. */
export function majorityElementMap(nums: readonly number[]): number {
  const counts = new Map<number, number>();
  for (const n of nums) {
    const c = (counts.get(n) ?? 0) + 1;
    counts.set(n, c);
    if (c > nums.length / 2) return n;
  }
  throw new Error('No majority element');
}

/** O(n) time, O(1) space: Boyer-Moore majority vote. */
export function majorityElementBoyerMoore(nums: readonly number[]): number {
  let candidate = nums[0];
  let count = 0;
  for (const n of nums) {
    if (count === 0) candidate = n;
    count += n === candidate ? 1 : -1;
  }
  return candidate;
}

// Exercise: Implement `opcodeHistogramTopN`, returning the N most frequent
// opcodes in a bytecode dump as [opcode, count] pairs sorted descending.
export function opcodeHistogramTopNStub(_dump: string, _n: number): [string, number][] {
  throw new Error('not implemented');
}
// Solution:
export function opcodeHistogramTopN(dump: string, n: number): [string, number][] {
  const counts = summarizeBytecode(parseBytecodeDump(dump));
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

// Exercise: Implement `functionFrameSummary`, combining `extractFunctionName`
// and `extractFrameInfo` into one readable line, e.g.
// "add: 3 params, 1 registers, frame size 8".
export function functionFrameSummaryStub(_dump: string): string {
  throw new Error('not implemented');
}
// Solution:
export function functionFrameSummary(dump: string): string {
  const name = extractFunctionName(dump) ?? 'unknown';
  const { parameterCount, registerCount, frameSize } = extractFrameInfo(dump);
  return `${name}: ${parameterCount} params, ${registerCount} registers, frame size ${frameSize}`;
}

// --- run ---
if (require.main === module) {
  const instructions = parseBytecodeDump(SAMPLE_ADD_BYTECODE_DUMP);
  console.assert(instructions.length === 3, 'expected 3 parsed instructions (Ldar, Add, Return)');
  console.assert(
    instructions.map((i) => i.opcode).join(',') === 'Ldar,Add,Return',
    'opcodes should appear in program order'
  );
  console.assert(instructions[1].operands === 'a0, [0]', 'Add operands should be parsed verbatim');

  const counts = summarizeBytecode(instructions);
  console.assert(counts.Ldar === 1 && counts.Add === 1 && counts.Return === 1, 'each opcode appears exactly once');

  console.assert(extractFunctionName(SAMPLE_ADD_BYTECODE_DUMP) === 'add', 'function name should be "add"');

  const frame = extractFrameInfo(SAMPLE_ADD_BYTECODE_DUMP);
  console.assert(
    frame.parameterCount === 3 && frame.registerCount === 1 && frame.frameSize === 8,
    'frame info should match the sample header'
  );

  console.assert(
    functionFrameSummary(SAMPLE_ADD_BYTECODE_DUMP) === 'add: 3 params, 1 registers, frame size 8',
    'frame summary should combine name and frame info'
  );

  const top2 = opcodeHistogramTopN(SAMPLE_ADD_BYTECODE_DUMP, 2);
  console.assert(top2.length === 2, 'top2 should return exactly 2 entries');

  console.assert(getSum(2, 3) === 5, '2 + 3 via bitwise adder should be 5');
  console.assert(getSum(10, 15) === 25, '10 + 15 via bitwise adder should be 25');

  console.assert(hammingWeight(11) === 3, '11 is 0b1011, three set bits');
  console.assert(hammingWeight(128) === 1, '128 is 0b10000000, one set bit');

  console.assert(majorityElementMap([3, 2, 3]) === 3, 'map-based majority element should be 3');
  console.assert(
    majorityElementBoyerMoore([2, 2, 1, 1, 1, 2, 2]) === 2,
    'Boyer-Moore majority element should be 2'
  );

  console.log('03-reading-bytecode: all assertions passed');
}
