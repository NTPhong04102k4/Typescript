// Companion code for ./06-grouping-patterns.md

/** Generic bucketing: groups items by whatever key `keyFn` derives from each one. */
export function groupBy<T, K>(items: readonly T[], keyFn: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  }
  return groups;
}

// --- LeetCode 49. Group Anagrams (Medium) ---
// https://leetcode.com/problems/group-anagrams/
// The canonical key for "these strings are anagrams" is their sorted
// character sequence: two strings are anagrams iff that key matches.
export function groupAnagrams(strs: readonly string[]): string[][] {
  const groups = groupBy(strs, (s) => [...s].sort().join(''));
  return [...groups.values()];
}

/** Builds a Map from character to occurrence count within a single string. */
function charFrequency(s: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  return freq;
}

// --- LeetCode 1002. Find Common Characters (Easy) ---
// https://leetcode.com/problems/find-common-characters/
// Categorize by intersecting per-word frequency maps: a character survives
// only with the minimum count it has across every word.
export function findCommonCharacters(words: readonly string[]): string[] {
  if (words.length === 0) return [];
  const common = charFrequency(words[0]);
  for (let i = 1; i < words.length; i++) {
    const freq = charFrequency(words[i]);
    for (const [ch, count] of common) {
      common.set(ch, Math.min(count, freq.get(ch) ?? 0));
    }
  }
  const result: string[] = [];
  for (const [ch, count] of common) {
    for (let i = 0; i < count; i++) result.push(ch);
  }
  return result;
}

// --- LeetCode 1207. Unique Number of Occurrences (Easy) ---
// https://leetcode.com/problems/unique-number-of-occurrences/
// Group values by frequency, then check whether any two distinct values
// share the same occurrence count (a Set of counts shrinks if they do).
export function hasUniqueOccurrences(arr: readonly number[]): boolean {
  const freq = new Map<number, number>();
  for (const n of arr) freq.set(n, (freq.get(n) ?? 0) + 1);
  const distinctCounts = new Set(freq.values());
  return distinctCounts.size === freq.size;
}

// --- LeetCode 451. Sort Characters By Frequency (Medium) ---
// https://leetcode.com/problems/sort-characters-by-frequency/
// Group characters by count, then emit each group's characters together,
// most frequent group first.
export function sortCharactersByFrequency(s: string): string {
  const freq = charFrequency(s);
  const sortedEntries = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  let result = '';
  for (const [ch, count] of sortedEntries) result += ch.repeat(count);
  return result;
}

// Exercise: partition numbers into even and odd groups using groupBy.
export function partitionEvenOddStub(_nums: readonly number[]): { even: number[]; odd: number[] } {
  throw new Error('not implemented');
}
// Solution:
export function partitionEvenOdd(nums: readonly number[]): { even: number[]; odd: number[] } {
  const groups = groupBy(nums, (n) => (n % 2 === 0 ? 'even' : 'odd'));
  return { even: groups.get('even') ?? [], odd: groups.get('odd') ?? [] };
}

// Exercise: given the result of groupBy, find the size of the largest group.
export function largestGroupSizeStub<T, K>(_groups: ReadonlyMap<K, T[]>): number {
  throw new Error('not implemented');
}
// Solution:
export function largestGroupSize<T, K>(groups: ReadonlyMap<K, T[]>): number {
  let max = 0;
  for (const group of groups.values()) max = Math.max(max, group.length);
  return max;
}

// --- run ---
if (require.main === module) {
  console.assert(
    JSON.stringify(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])) ===
      JSON.stringify([
        ['eat', 'tea', 'ate'],
        ['tan', 'nat'],
        ['bat'],
      ]),
    'groupAnagrams should bucket strings by sorted-character key'
  );

  console.assert(
    JSON.stringify(findCommonCharacters(['bella', 'label', 'roller'])) === JSON.stringify(['e', 'l', 'l']),
    'findCommonCharacters should return the shared multiset of characters'
  );

  console.assert(hasUniqueOccurrences([1, 2, 2, 1, 1, 3]) === true, 'counts 3,2,1 are all unique');
  console.assert(hasUniqueOccurrences([1, 2]) === false, 'counts 1,1 are not unique');

  console.assert(sortCharactersByFrequency('tree') === 'eetr', "'tree' should sort as 'eetr' (e:2, then t, r in insertion order)");

  const { even, odd } = partitionEvenOdd([1, 2, 3, 4, 5, 6]);
  console.assert(JSON.stringify(even) === JSON.stringify([2, 4, 6]), 'evens should be [2, 4, 6]');
  console.assert(JSON.stringify(odd) === JSON.stringify([1, 3, 5]), 'odds should be [1, 3, 5]');

  const groups = groupBy([1, 2, 2, 3, 3, 3], (n) => n);
  console.assert(largestGroupSize(groups) === 3, 'group of 3s should be the largest with size 3');

  console.log('06-grouping-patterns: all assertions passed');
}
