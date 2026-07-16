# Expression Evaluation & Parsing with Stacks

**Objective:** Use a stack to evaluate postfix notation directly and to parse infix arithmetic (with precedence and parentheses) into a result.

## Concept

Postfix (Reverse Polish) notation needs no stack of *operators* at all —
operands are pushed, and an operator always applies to the two most
recent operands, which is exactly a stack's `pop, pop, push(result)`.

```
tokens: 2 1 + 3 *

push 2        push 1        '+'  pop 1, pop 2     push 3          '*'  pop 3, pop 3
┌───┐          ┌───┐          push (2+1)=3          ┌───┐            push (3*3)=9
│ 2 │          │ 1 │          ┌───┐                 │ 3 │            ┌───┐
└───┘          ├───┤          │ 3 │                 ├───┤            │ 9 │
               │ 2 │          └───┘                 │ 3 │            └───┘
               └───┘                                └───┘
                                                       result: 9
```

Infix expressions with parentheses (`(1+(4+5+2)-3)+(6+8)`) need the stack
for a different job: every `(` freezes the current running total and
sign so a nested sub-expression can be evaluated independently, and every
`)` folds that sub-result back into the total it interrupted — the stack
holds exactly the "state to resume" for each enclosing level, the same
role it plays for real function call frames (see lesson 05).

## Complexity

| Problem | Time | Space |
|---------|------|-------|
| `evalRPN` (150) | O(n) | O(n) |
| `calculateII` (227) | O(n) | O(n) |
| `calculateBasic` (224) | O(n) | O(n) — stack depth bounded by nesting depth |

## Walkthrough

`04-expression-evaluation.ts` reuses `Stack<number>` from lesson 01
throughout.

`evalRPN` solves **LeetCode 150**: operands are pushed as numbers; an
operator pops the two most recent operands (`b` then `a`, since `b` was
pushed last), applies it as `a <op> b`, and pushes the result back.
Division uses `Math.trunc` to match the problem's "truncate toward zero"
rule.

`calculateII` solves **LeetCode 227** (no parentheses, but `+ - * /`
precedence). It accumulates digits into `num` and remembers the operator
that *precedes* the current number in `sign`. Once the number is
complete (next character is an operator, or we hit the end of the
string), it commits: `+`/`-` push a signed value, while `*`/`/` pop the
stack's top and combine it immediately — because multiplication and
division bind tighter than addition, they're resolved right away instead
of waiting until the end. The final answer is the sum of everything left
on the stack.

`calculateBasic` solves **LeetCode 224** (parentheses, `+`/`-`, no
`*`/`/`). It keeps a running `result` and `sign` for the current
nesting level. On `(`, both are pushed and reset to start a fresh level;
on `)`, the just-finished sub-expression's value is folded back via
`result = result * signBeforeParen + resultBeforeParen`, mirroring how a
function call's result is combined into its caller's computation after
the callee returns.

## LeetCode practice

- 150. Evaluate Reverse Polish Notation (Medium)
- 227. Basic Calculator II (Medium)
- 224. Basic Calculator (Hard)

## Key takeaways

- Postfix notation removes the need for precedence rules entirely — a
  stack alone evaluates it in one linear pass.
- For infix expressions, `*`/`/` can be resolved immediately against the
  stack's top, while `+`/`-` must wait, because they bind more loosely.
- Parentheses map directly onto stack push/pop: `(` saves "state to
  resume", `)` restores and folds it — the same shape as a call stack
  frame.
- All three solutions are O(n) single passes; the stack only ever holds
  as much as the expression's nesting/operand count requires.

Companion code: [`04-expression-evaluation.ts`](./04-expression-evaluation.ts)
