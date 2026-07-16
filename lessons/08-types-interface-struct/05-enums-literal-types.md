# Enums & literal types for state machines

**Objective:** Represent a small, closed set of states (a traffic light, a parser) with either a TypeScript `enum` or a string-literal union, and drive transitions with an exhaustive, table-based state machine.

## Concept

Both `enum` and a string-literal union restrict a value to a closed set of
options, but they differ in what exists at runtime:

```
enum TrafficLight { Red = 'RED', Yellow = 'YELLOW', Green = 'GREEN' }
  -> compiles to a real JS object: { Red: 'RED', Yellow: 'YELLOW', ... }
  -> TrafficLight.Red is a real runtime value you can iterate/inspect

type Signal = 'red' | 'yellow' | 'green'
  -> erased entirely at compile time
  -> at runtime it is just the string 'red', 'yellow', or 'green'
```

A state machine is a set of states plus a transition function. Modeling
transitions as an explicit table keeps the machine's *whole* behavior
visible in one place instead of scattered across `if` chains:

```
state:      start --digit--> inNumber --operator--> inOperator --digit--> inNumber
                                 |                                            
                              --space--> start                               
any state --(unhandled event)--> error
```

## When to use

| Approach | Runtime footprint | Iterable at runtime | Best for |
| --- | --- | --- | --- |
| `enum` (string-valued) | Real object, present in bundle | Yes (`Object.values(TrafficLight)`) | Interop with existing runtime-enum APIs; when you need to enumerate/log values |
| String-literal union (`'red' \| 'yellow' \| 'green'`) | None — fully erased | No (nothing to iterate; use a `const` array alongside it if needed) | Most new TS code — smaller bundles, matches plain JSON/API string values directly |
| `const` object + `keyof typeof` | Small object, values erased from types | Yes, and tree-shakeable | A middle ground when you want both a runtime lookup and literal types |

For new code, prefer literal unions unless you specifically need the enum's
runtime object (e.g. reverse lookup by value, iteration, or matching an
existing API that already returns enum-shaped values).

## Walkthrough

`05-enums-literal-types.ts` defines `TrafficLight` as a string `enum` with
`nextEnumState` switching over its members, then `Signal` as the literal
union equivalent with `nextSignal` — both use the same `never`-check
exhaustiveness pattern from lesson 04.

`ParserState`/`ParserEvent` are literal unions describing a tiny tokenizer;
`parserTransitions` is a `Record<ParserState, Partial<Record<ParserEvent,
ParserState>>>` transition table, and `stepParser` looks up one transition
(falling back to `'error'` for any transition the table doesn't define).

The exercises add `isFinal` (is this state stuck, i.e. `'error'`) and
`runParser` (fold `stepParser` over a whole event stream to find the ending
state) — the same "table-driven state machine" pattern used for the
stack-based expression evaluators in topic 04.

## LeetCode practice

- 8. String to Integer (atoi) (Medium) — the canonical state-machine parsing problem (sign state, digit state, overflow, invalid state).
- 227. Basic Calculator II (Medium) — tokenizing digits/operators/spaces is exactly the `ParserState`/`ParserEvent` shape here.
- 394. Decode String (Medium) — a stack-driven parser with distinct "reading digit" vs "reading letter" states.

## Key takeaways

- `enum` produces a real runtime object; a string-literal union is erased entirely — prefer the union unless you need runtime iteration/reverse lookup.
- Both support the same exhaustive-switch `never`-check pattern as discriminated unions.
- A transition table (`Record<State, Partial<Record<Event, State>>>`) makes a state machine's full behavior readable at a glance, instead of scattered `if`/`switch` logic.
- `Partial<Record<...>>` correctly models "not every state handles every event" without needing `undefined` checks scattered through the transition function.
- This table-driven approach scales directly to the stack-based parsers/evaluators in topic 04 (Stack).

Companion code: [`05-enums-literal-types.ts`](./05-enums-literal-types.ts)
