// Companion code for ./02-struct-like-patterns.md

// `readonly` struct: fields cannot be reassigned after construction. This is
// a compile-time-only guard (erased at runtime) that documents intent and
// prevents accidental mutation.
export interface ImmutablePoint {
  readonly x: number;
  readonly y: number;
}

export function translate(p: ImmutablePoint, dx: number, dy: number): ImmutablePoint {
  return { x: p.x + dx, y: p.y + dy };
}

// Tuple: a fixed-length, positional struct. `readonly [A, B]` also blocks
// `.push`/index-assignment, unlike a plain mutable array.
export type Pair<A, B> = readonly [A, B];

export function swap<A, B>(pair: Pair<A, B>): Pair<B, A> {
  return [pair[1], pair[0]];
}

// Labeled tuple elements document each slot's meaning without changing
// runtime representation — still a plain 3-element array.
export type WeightedEdge = readonly [from: number, to: number, weight: number];

export function edgeWeight(edge: WeightedEdge): number {
  return edge[2];
}

// Record<K, V>: a struct-like map from a *fixed, known* key set to a value
// type. Unlike Map<K, V>, the compiler knows every key up front.
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';
export type GradeThresholds = Record<Grade, number>;

export const defaultThresholds: GradeThresholds = {
  A: 90,
  B: 80,
  C: 70,
  D: 60,
  F: 0,
};

export function gradeFor(score: number, thresholds: GradeThresholds = defaultThresholds): Grade {
  const grades: Grade[] = ['A', 'B', 'C', 'D', 'F'];
  for (const g of grades) {
    if (score >= thresholds[g]) return g;
  }
  return 'F';
}

// readonly array vs mutable array: identical runtime representation and
// identical O(1) index / O(n) traversal cost — `readonly` only removes
// mutating methods (push, sort, etc.) from the compile-time type.
export function sumReadonly(nums: readonly number[]): number {
  let total = 0;
  for (const n of nums) total += n;
  return total;
}

// Exercise: build a Record<string, number> letter-frequency map from a
// string, in one pass.
export function stubLetterFrequency(_s: string): Record<string, number> {
  throw new Error('not implemented');
}
// Solution:
export function letterFrequency(s: string): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const ch of s) {
    freq[ch] = (freq[ch] ?? 0) + 1;
  }
  return freq;
}

// Exercise: return a [min, max] tuple from a non-empty readonly number
// array in a single pass.
export function stubMinAndMax(_nums: readonly number[]): readonly [number, number] {
  throw new Error('not implemented');
}
// Solution:
export function minAndMax(nums: readonly number[]): readonly [number, number] {
  let min = nums[0];
  let max = nums[0];
  for (const n of nums) {
    if (n < min) min = n;
    if (n > max) max = n;
  }
  return [min, max];
}

// --- run ---
if (require.main === module) {
  const p: ImmutablePoint = { x: 1, y: 2 };
  const moved = translate(p, 3, 4);
  console.assert(moved.x === 4 && moved.y === 6, 'translate should produce a new, independent immutable point');

  const pair: Pair<string, number> = ['id', 7];
  const swapped = swap(pair);
  console.assert(swapped[0] === 7 && swapped[1] === 'id', 'swap should reverse tuple order and type');

  const edge: WeightedEdge = [0, 1, 5];
  console.assert(edgeWeight(edge) === 5, 'edgeWeight should read the labeled "weight" slot');

  console.assert(gradeFor(95) === 'A', '95 should be graded A');
  console.assert(gradeFor(65) === 'D', '65 should be graded D');
  console.assert(gradeFor(0) === 'F', '0 should be graded F');

  console.assert(sumReadonly([1, 2, 3]) === 6, 'sumReadonly should sum a readonly array like any array');

  const freq = letterFrequency('aabbbc');
  console.assert(freq['a'] === 2 && freq['b'] === 3 && freq['c'] === 1, 'letterFrequency should count occurrences per letter');

  const [mn, mx] = minAndMax([5, 1, 9, -2, 3]);
  console.assert(mn === -2 && mx === 9, 'minAndMax should find -2 and 9 in one pass');

  console.log('02-struct-like-patterns: all assertions passed');
}
