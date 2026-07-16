# DSA & LeetCode — TypeScript

A hands-on data-structures & algorithms curriculum in TypeScript, with notes on
how each choice interacts with the JavaScript engine. Every lesson is a `.md`
theory file plus a runnable `.ts` companion under `lessons/<topic>/`.

See [`CURRICULUM.md`](./CURRICULUM.md) for the full lesson index.

## Setup

```bash
npm install
```

## Routes — navigating & running lessons

`lessons/routes.ts` is a single entry point that scans the `lessons/` folder at
runtime, so it always reflects whatever topics and lessons exist.

```bash
npm run roadmap                 # print the whole roadmap (topics + lessons)
npm run route                   # same as roadmap when given no target

npm run route 13                # run every lesson in topic 13 (Bit Manipulation)
npm run route graph             # fuzzy topic match -> 10-graphs, run all
npm run route 13/02             # run one lesson: topic 13, lesson 02
npm run route 13-bit/bit-tricks # fuzzy lesson match by slug
npm run route --list 09         # list a topic's lessons without running them
```

Running a lesson spawns `ts-node` on its file, so its `if (require.main === module)`
demo block (the `console.assert` checks) executes exactly as if run directly.

## Running a single file directly

```bash
npm run run lessons/13-bit-manipulation/02-bit-tricks.ts
```

## Type-checking everything

```bash
npm run typecheck
```
