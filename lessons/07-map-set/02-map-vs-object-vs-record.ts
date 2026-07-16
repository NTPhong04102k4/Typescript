// Companion code for ./02-map-vs-object-vs-record.md
import { performance } from 'perf_hooks';

// `Record<K, V>` is a TypeScript-only type alias for "object with these
// keys". It adds zero runtime behavior — at runtime this is a plain object.
export const ROMAN_VALUES: Record<'I' | 'V' | 'X' | 'L' | 'C' | 'D' | 'M', number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

// --- LeetCode 13. Roman to Integer (Easy) ---
// https://leetcode.com/problems/roman-to-integer/
// A Record is ideal here: keys are known and fixed at compile time, so V8
// keeps a single stable hidden class for the lookup object.
export function romanToInteger(s: string): number {
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const value = ROMAN_VALUES[s[i] as keyof typeof ROMAN_VALUES];
    const next = i + 1 < s.length ? ROMAN_VALUES[s[i + 1] as keyof typeof ROMAN_VALUES] : 0;
    total += value < next ? -value : value;
  }
  return total;
}

// --- LeetCode 1. Two Sum (Easy) ---
// https://leetcode.com/problems/two-sum/
// A Map is the right fit here: keys are unknown until runtime and the key
// set grows one entry at a time, which is exactly what Map's own hash table
// (not the object hidden-class machinery) is built for.
export function twoSumViaMap(nums: readonly number[], target: number): [number, number] {
  const seenIndexByValue = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    const j = seenIndexByValue.get(complement);
    if (j !== undefined) return [j, i];
    seenIndexByValue.set(nums[i], i);
  }
  throw new Error('No two-sum solution exists');
}

// --- LeetCode 205. Isomorphic Strings (Easy) ---
// https://leetcode.com/problems/isomorphic-strings/
export function isIsomorphic(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const sToT = new Map<string, string>();
  const tToS = new Map<string, string>();
  for (let i = 0; i < s.length; i++) {
    const a = s[i];
    const b = t[i];
    const mappedA = sToT.get(a);
    const mappedB = tToS.get(b);
    if (mappedA !== undefined && mappedA !== b) return false;
    if (mappedB !== undefined && mappedB !== a) return false;
    sToT.set(a, b);
    tToS.set(b, a);
  }
  return true;
}

// --- LeetCode 3. Longest Substring Without Repeating Characters (Medium) ---
// https://leetcode.com/problems/longest-substring-without-repeating-characters/
// A Map<char, lastIndex> lets the sliding window jump the left edge directly
// instead of stepping it one character at a time.
export function lengthOfLongestSubstring(s: string): number {
  const lastIndexOf = new Map<string, number>();
  let start = 0;
  let best = 0;
  for (let end = 0; end < s.length; end++) {
    const ch = s[end];
    const prevIndex = lastIndexOf.get(ch);
    if (prevIndex !== undefined && prevIndex >= start) {
      start = prevIndex + 1;
    }
    lastIndexOf.set(ch, end);
    best = Math.max(best, end - start + 1);
  }
  return best;
}

/**
 * Benchmarks inserting and deleting `operations` dynamic string keys into a
 * Map versus a plain object. Object dictionaries with a churning key set
 * force V8 into "dictionary mode" (no stable hidden class), so Map is
 * typically faster for this access pattern.
 */
export function benchmarkMapVsObjectChurn(operations: number): { mapMs: number; objectMs: number } {
  const mapStart = performance.now();
  const map = new Map<string, number>();
  for (let i = 0; i < operations; i++) map.set(`key-${i}`, i);
  for (let i = 0; i < operations; i += 2) map.delete(`key-${i}`);
  const mapMs = performance.now() - mapStart;

  const objectStart = performance.now();
  const obj: Record<string, number> = {};
  for (let i = 0; i < operations; i++) obj[`key-${i}`] = i;
  for (let i = 0; i < operations; i += 2) delete obj[`key-${i}`];
  const objectMs = performance.now() - objectStart;

  return { mapMs, objectMs };
}

// Exercise: convert a Map<string, number> into a plain Record<string, number>
// for serialization (e.g. JSON.stringify doesn't support Map directly).
export function mapToRecordStub(_map: ReadonlyMap<string, number>): Record<string, number> {
  throw new Error('not implemented');
}
// Solution:
export function mapToRecord(map: ReadonlyMap<string, number>): Record<string, number> {
  const record: Record<string, number> = {};
  for (const [key, value] of map) record[key] = value;
  return record;
}

// Exercise: convert a Record<string, number> back into a Map<string, number>.
export function recordToMapStub(_record: Readonly<Record<string, number>>): Map<string, number> {
  throw new Error('not implemented');
}
// Solution:
export function recordToMap(record: Readonly<Record<string, number>>): Map<string, number> {
  return new Map(Object.entries(record));
}

// --- run ---
if (require.main === module) {
  console.assert(romanToInteger('III') === 3, 'III should be 3');
  console.assert(romanToInteger('LVIII') === 58, 'LVIII should be 58');
  console.assert(romanToInteger('MCMXCIV') === 1994, 'MCMXCIV should be 1994');

  console.assert(
    JSON.stringify(twoSumViaMap([2, 7, 11, 15], 9)) === JSON.stringify([0, 1]),
    'twoSumViaMap should find indices [0, 1]'
  );

  console.assert(isIsomorphic('egg', 'add') === true, 'egg/add should be isomorphic');
  console.assert(isIsomorphic('foo', 'bar') === false, 'foo/bar should not be isomorphic');
  console.assert(isIsomorphic('badc', 'baba') === false, 'badc/baba should not be isomorphic (not injective)');

  console.assert(lengthOfLongestSubstring('abcabcbb') === 3, 'abcabcbb longest unique run is "abc" (3)');
  console.assert(lengthOfLongestSubstring('bbbbb') === 1, 'bbbbb longest unique run is "b" (1)');
  console.assert(lengthOfLongestSubstring('pwwkew') === 3, 'pwwkew longest unique run is "wke" (3)');

  const original = new Map<string, number>([
    ['a', 1],
    ['b', 2],
  ]);
  const asRecord = mapToRecord(original);
  console.assert(asRecord.a === 1 && asRecord.b === 2, 'mapToRecord should preserve entries');
  const backToMap = recordToMap(asRecord);
  console.assert(backToMap.get('a') === 1 && backToMap.get('b') === 2, 'recordToMap should round-trip');

  const { mapMs, objectMs } = benchmarkMapVsObjectChurn(5_000);
  console.log(`Map churn: ${mapMs.toFixed(3)}ms, Object churn: ${objectMs.toFixed(3)}ms`);

  console.log('02-map-vs-object-vs-record: all assertions passed');
}
