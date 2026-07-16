# Engine Pipeline: Parser → AST → Ignition Bytecode → TurboFan JIT

**Objective:** Trace how V8 turns JavaScript source text into running code
through four stages — parse, AST, Ignition bytecode, TurboFan machine code —
and understand why "hot" code gets progressively faster.

## Concept

V8 does not interpret source text directly, and it does not compile
everything to machine code up front either. It uses a tiered pipeline:

```
 source text
     |
     v
 +---------+     +-----+     +--------------------+     +--------------------+
 |  Lexer  | --> | AST | --> |  Ignition bytecode | --> |  interpreter loop  |
 +---------+     +-----+     +--------------------+     +--------------------+
                                                                  |
                                                     function called often?
                                                                  |
                                                                  v
                                                     +-------------------------+
                                                     | TurboFan: compile AST/  |
                                                     | bytecode info to highly |
                                                     | optimized machine code  |
                                                     +-------------------------+
```

1. **Parser**: tokenizes source, builds an Abstract Syntax Tree (AST).
2. **Ignition**: V8's bytecode compiler + interpreter. It compiles the AST
   to a compact bytecode and starts executing immediately — low startup
   latency, no long compile pause.
3. **TurboFan**: V8's optimizing JIT. Functions called often enough (the
   engine tracks call counts and type feedback) get recompiled to
   speculative, type-specialized machine code. If assumptions are violated
   later (e.g. a shape changes), TurboFan **deoptimizes** back to Ignition.

This tiering is why the *first* few calls to a function are relatively slow
(interpreted bytecode) and later calls are fast (optimized machine code) —
and why microbenchmarks that only run a loop once are misleading.

## Complexity

| Stage                              | Cost model                                   |
|-------------------------------------|-----------------------------------------------|
| Lexing (`tokenize`)                 | O(source length)                              |
| Parsing (`Parser.parseExpression`)  | O(token count) for this grammar               |
| Bytecode compile (`compileToBytecode`) | O(AST node count)                          |
| Bytecode interpretation (`runBytecode`) | O(instruction count) per call, every call |
| TurboFan-optimized call (simulated) | O(1) amortized after warm-up, until deopt     |

## Walkthrough

`02-engine-pipeline.ts` implements a toy arithmetic language end to end:

- `tokenize` is the lexer: source string → `Token[]`.
- `Parser` (recursive descent, `parseExpression`/`parseAdditive`/
  `parseMultiplicative`/`parsePrimary`) builds an `Expr` AST
  (`NumberLiteral` | `BinaryExpr`), correctly respecting `*`/`/` precedence
  over `+`/`-`.
- `compileToBytecode` walks the AST post-order into a flat
  `Instruction[]` stack-machine bytecode (`PUSH`/`ADD`/`SUB`/`MUL`/`DIV`) —
  this is the Ignition-bytecode-generation analogue.
- `runBytecode` executes that bytecode with a stack, the same way
  Ignition's interpreter dispatch loop runs real bytecode.
- `TieredExpressionEvaluator` simulates tiering: it counts calls per source
  string in Ignition mode; once a source crosses `optimizationThreshold`
  calls, it caches the result behind what stands in for a compiled
  TurboFan fast path, so later calls skip parsing and interpreting
  entirely. `tierOf` reports which tier a given source is currently in.

This is a simplified pedagogical model — real TurboFan does far more
(speculative type specialization, escape analysis, deoptimization guards) —
but the shape (interpret first, promote after repeated hot calls, skip
re-work once promoted) matches V8's real design.

## LeetCode practice

- 150. Evaluate Reverse Polish Notation (Medium) — RPN tokens *are* stack
  bytecode; `evalRPN` evaluates them exactly like `runBytecode`.
- 227. Basic Calculator II (Medium) — parsing infix `+ - * /` without
  parens, one stage up from our tokenizer.
- 224. Basic Calculator (Hard) — adds parens and unary sign, extending the
  recursive-descent idea from `Parser`.

## Key takeaways

- V8 never fully compiles to machine code before running — Ignition gets
  code running fast from bytecode, TurboFan speeds up only what's hot.
- Bytecode is a real, inspectable artifact (see lesson 03), not a marketing
  term — it is what `runBytecode` in this file models directly.
- Tiering means "the same code gets faster the more it runs" — an
  important caveat when microbenchmarking (see lesson 06).
- Optimized code can be thrown away (deoptimized) if runtime assumptions
  break; our simulation omits this but real V8 must handle it constantly.

Companion code: [`02-engine-pipeline.ts`](./02-engine-pipeline.ts)
