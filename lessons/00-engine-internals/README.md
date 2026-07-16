# 00 · Engine Internals

This topic covers how V8 (Node's JavaScript engine) actually executes the
code you write: asymptotic complexity as a predictive model, the
parser-to-bytecode-to-JIT pipeline, how arrays and objects are laid out in
memory, and why object/Map "shape" drives real-world speed. It matters for
interviews because Big-O answers are graded against real engine behavior,
and it matters for production perf because two O(n) solutions can differ by
10x depending on hidden classes, array packing, and inline caches.

Lessons:
- 01 — Big-O primer & why it predicts real engine behavior
- 02 — Engine pipeline: parser → AST → Ignition bytecode → TurboFan JIT
- 03 — Reading bytecode with `node --print-bytecode`
- 04 — Memory layout of arrays: packed vs holey, SMI vs double, ASCII diagram
- 05 — Hidden classes & inline caches: why object/Map shape affects perf
- 06 — Capstone: benchmarking Array vs Map vs Set with bytecode notes
