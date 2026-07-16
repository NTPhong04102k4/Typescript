# String Parsing & Stack-Based Decoding

**Objective:** Use a stack to parse nested or order-sensitive string
structures — brackets, repeated groups, adjacent duplicates — in a single
left-to-right pass.

## Concept

Whenever a string has a **nested** or **most-recent-first** structure, a
stack is the natural tool: push context when you open something, pop and
resolve it when you close something. The stack's LIFO order matches
"innermost thing finishes first."

For decoding `3[a2[c]]`, push each unfinished `(count, string-so-far)` pair
when a `[` starts a new nesting level, and pop it back off when the
matching `]` closes that level, appending the decoded inner content
`count` times to what's underneath:

```
input: 3 [ a 2 [ c ] ]

read '3'          -> currentCount = 3
read '['          -> push ("", 3), reset current
read 'a'          -> currentStr = "a"
read '2'          -> currentCount = 2
read '['          -> push ("a", 2), reset current
read 'c'          -> currentStr = "c"
read ']'          -> pop ("a", 2): currentStr = "a" + "c"*2 = "acc"
read ']'          -> pop ("", 3): currentStr = "" + "acc"*3 = "accaccacc"

stack (grows downward, top on the left):
 push "3["          [ ("",3) ]
 push "a2["         [ ("a",2), ("",3) ]
 read "c"           (top holds "c")
 pop on "]"         [ ("",3) ]           currentStr = "acc"
 pop on "]"         [ ]                   currentStr = "accaccacc"
```

Balanced-bracket validation (`20. Valid Parentheses`) uses the same idea
without the counts: push every opening bracket, and on a closing bracket,
check the top of the stack matches before popping.

## Complexity

| Operation                                | Time | Space |
|--------------------------------------------|------|-------|
| Valid Parentheses (20)                     | O(n) | O(n)  |
| Decode String (394)                        | O(n) | O(n)  |
| Remove All Adjacent Duplicates (1047)       | O(n) | O(n)  |
| Simplify Path (71)                         | O(n) | O(n)  |

## Walkthrough

`08-parsing-stack-decoding.ts` implements four stack-driven parsers:

- `isValid` solves **20. Valid Parentheses** using a stack of expected
  closing brackets.
- `decodeString` solves **394. Decode String** using a stack of
  `{ count, previousString }` frames, exactly as traced above.
- `removeDuplicates` solves **1047. Remove All Adjacent Duplicates In
  String** using a stack of characters, popping whenever the next
  character matches the top.
- The exercise implements **71. Simplify Path**, using a stack of path
  segments (pushing normal names, popping on `".."`, ignoring `"."` and
  empty segments).

## LeetCode practice

- 20. Valid Parentheses (Easy)
- 394. Decode String (Medium)
- 1047. Remove All Adjacent Duplicates In String (Easy)
- 71. Simplify Path (Medium)

## Key takeaways

- A stack naturally models "resolve the innermost/most-recent thing
  first" — nested brackets, nested repeat groups, and `..` path segments
  all fit this shape.
- For decode-style problems, push whatever context is needed to resume
  the outer level once the inner one closes (count + string-so-far).
- Adjacent-duplicate removal is a stack problem in disguise: compare each
  new character only against the current top, not the whole result.
- Path simplification reduces to stack push/pop rules once the string is
  split on `/`: real segments push, `".."` pops, `"."`/empty segments are
  no-ops.

Companion code: [`08-parsing-stack-decoding.ts`](./08-parsing-stack-decoding.ts)
