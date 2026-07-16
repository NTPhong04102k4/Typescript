# Reading Bytecode with `node --print-bytecode`

**Objective:** Learn to run and read V8's real Ignition bytecode dumps so
you can verify — instead of guess — what the engine does with your code.

## Concept

Node ships V8, and V8 can print the bytecode it generates for any function
if you build/run Node with the right flag. From a terminal (not from
inside this repo's `.ts` files, since it needs its own process):

```
node --print-bytecode --print-bytecode-filter=add script.js
```

Where `script.js` contains something like:

```js
function add(a, b) { return a + b; }
add(1, 2);
```

Typical output looks like this (addresses vary per run; the shape is what
matters):

```
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
```

Reading this line by line:

```
+----------------- machine address (varies per run, ignore it) --+
|            +---- bytecode offset within the function ---------+|
|            |         +--- raw instruction bytes ---------------+|
|            |         |            +--- mnemonic + operands ----+|
v            v         v            v
0x2b4c...  @ 0       : 25 02      Ldar a1
0x2b4c...  @ 2       : 34 03 00   Add a0, [0]
0x2b4c...  @ 5       : ab         Return
```

- `Ldar a1` — **L**oa**d** **a**ccumulator **r**egister: copy parameter
  `a1` (the second parameter, `b`) into V8's implicit accumulator register.
- `Add a0, [0]` — add register `a0` (`a`) to the accumulator, using
  inline-cache feedback slot `[0]` to remember what *kind* of add this was
  last time (SMI+SMI, double+double, string+string, ...) — this feedback
  slot is exactly what makes hidden classes and inline caches (lesson 05)
  matter for performance.
- `Return` — return the accumulator's value.

Every real V8 bytecode dump has three parts: a **header** (function name,
parameter/register counts, frame size), the **instruction stream**
(offset : bytes : mnemonic operands), and **trailing tables** (constant
pool, exception handlers, source positions).

## Complexity

| Task                                        | Cost                          |
|-----------------------------------------------|-------------------------------|
| Reading one bytecode line                     | O(1)                           |
| Parsing a full dump (`parseBytecodeDump`)     | O(number of lines)             |
| Summarizing opcode frequency (`summarizeBytecode`) | O(number of instructions) |
| Naive linear-scan bit counting                | O(32) fixed iterations         |
| `n & (n - 1)` bit counting (`hammingWeight`)   | O(number of set bits)          |

## Walkthrough

`03-reading-bytecode.ts` hand-authors `SAMPLE_ADD_BYTECODE_DUMP`, a
realistic stand-in for real `node --print-bytecode` output (the header
format and instruction-line format match V8's real output shape), so the
parsing tools work without needing a special V8 build:

- `parseBytecodeDump` turns each `offset : bytes  Mnemonic operands` line
  into a `BytecodeInstruction` record.
- `summarizeBytecode` counts opcode frequency — useful for spotting, say, a
  function with an unexpectedly large number of property-load opcodes.
- `extractFunctionName` and `extractFrameInfo` pull the header fields
  (function name, parameter count, register count, frame size) out of the
  raw text.
- `functionFrameSummary` and `opcodeHistogramTopN` (see the Exercises)
  combine these primitives into human-readable reports.

The LeetCode functions were chosen because their *bytecode footprint* is
the point of the exercise, not just the algorithm: `getSum` builds addition
out of the same XOR/AND/shift primitives a hardware adder (and V8's `Add`
opcode, under the hood) uses; `hammingWeight`'s `n & (n - 1)` trick does
one cheap bitwise op per set bit instead of 32 fixed iterations; and the
two `majorityElement` variants contrast a Map-heavy bytecode footprint with
an allocation-free arithmetic one.

## LeetCode practice

- 371. Sum of Two Integers (Medium) — implement `+` from bitwise primitives
- 191. Number of 1 Bits (Easy) — bit-trick loop vs naive 32-iteration scan
- 169. Majority Element (Easy) — Map-based counting vs Boyer-Moore voting

## Key takeaways

- `node --print-bytecode --print-bytecode-filter=<name>` shows you exactly
  what Ignition generated — no guessing required.
- Every bytecode dump has a header (name, parameter/register counts, frame
  size), an instruction stream, and trailing tables.
- Numbered feedback slots (like `Add a0, [0]`) are inline cache slots —
  they are where V8 records "what shape of operands has this instruction
  seen so far," which is the mechanism lesson 05 explains in depth.
- You can script analysis over bytecode dumps (opcode histograms, frame
  summaries) the same way this lesson's parser does, to spot regressions.

Companion code: [`03-reading-bytecode.ts`](./03-reading-bytecode.ts)
