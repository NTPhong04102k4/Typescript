// Companion code for ./04-frequency-counting.md

/** Builds a Map from each item to how many times it appears. */
export function buildFrequencyMap<T>(items: Iterable<T>): Map<T, number> {
  const freq = new Map<T, number>();
  for (const item of items) {
    freq.set(item, (freq.get(item) ?? 0) + 1);
  }
  return freq;
}

// --- LeetCode 242. Valid Anagram (Easy) ---
// https://leetcode.com/problems/valid-anagram/
export function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const freq = buildFrequencyMap(s);
  for (const ch of t) {
    const remaining = freq.get(ch);
    if (!remaining) return false;
    freq.set(ch, remaining - 1);
  }
  return true;
}

// --- LeetCode 387. First Unique Character in a String (Easy) ---
// https://leetcode.com/problems/first-unique-character-in-a-string/
export function firstUniqueCharIndex(s: string): number {
  const freq = buildFrequencyMap(s);
  for (let i = 0; i < s.length; i++) {
    if (freq.get(s[i]) === 1) return i;
  }
  return -1;
}

// --- LeetCode 438. Find All Anagrams in a String (Medium) ---
// https://leetcode.com/problems/find-all-anagrams-in-a-string/
// Sliding window of length p.length: keep a running frequency Map of the
// window and compare it against p's frequency Map. The alphabet is small
// and bounded, so the comparison is effectively O(1) per slide.
export function findAnagramsIndices(s: string, p: string): number[] {
  const result: number[] = [];
  if (p.length > s.length) return result;

  const need = buildFrequencyMap(p);
  const window = new Map<string, number>();

  const frequenciesMatch = (): boolean => {
    if (window.size !== need.size) return false;
    for (const [ch, count] of need) {
      if (window.get(ch) !== count) return false;
    }
    return true;
  };

  for (let i = 0; i < s.length; i++) {
    const inChar = s[i];
    window.set(inChar, (window.get(inChar) ?? 0) + 1);

    if (i >= p.length) {
      const outChar = s[i - p.length];
      const newCount = (window.get(outChar) ?? 0) - 1;
      if (newCount === 0) window.delete(outChar);
      else window.set(outChar, newCount);
    }

    if (i >= p.length - 1 && frequenciesMatch()) {
      result.push(i - p.length + 1);
    }
  }
  return result;
}

// --- LeetCode 347. Top K Frequent Elements (Medium) ---
// https://leetcode.com/problems/top-k-frequent-elements/
// Bucket sort by frequency: frequency is bounded by nums.length, so we can
// place each value into buckets[frequency] and read off the top buckets in
// O(n) instead of sorting the frequency map in O(n log n).
export function topKFrequent(nums: readonly number[], k: number): number[] {
  const freq = buildFrequencyMap(nums);
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [value, count] of freq) buckets[count].push(value);

  const result: number[] = [];
  for (let count = buckets.length - 1; count >= 0 && result.length < k; count--) {
    for (const value of buckets[count]) {
      result.push(value);
      if (result.length === k) break;
    }
  }
  return result;
}

// Exercise: return the single most frequent element (ties broken by first
// occurrence order in the frequency map).
export function mostFrequentElementStub<T>(_items: Iterable<T>): T | undefined {
  throw new Error('not implemented');
}
// Solution:
export function mostFrequentElement<T>(items: Iterable<T>): T | undefined {
  const freq = buildFrequencyMap(items);
  let best: T | undefined;
  let bestCount = -1;
  for (const [value, count] of freq) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }
  return best;
}

// Exercise: turn a frequency Map into an array of [value, count] pairs
// sorted by count descending, useful for reporting/debugging.
export function frequencyEntriesDescendingStub<T>(_freq: ReadonlyMap<T, number>): Array<[T, number]> {
  throw new Error('not implemented');
}
// Solution:
export function frequencyEntriesDescending<T>(freq: ReadonlyMap<T, number>): Array<[T, number]> {
  return [...freq.entries()].sort((a, b) => b[1] - a[1]);
}

// --- run ---
if (require.main === module) {
  const freq = buildFrequencyMap('aabbbc');
  console.assert(freq.get('a') === 2 && freq.get('b') === 3 && freq.get('c') === 1, 'buildFrequencyMap should count characters');

  console.assert(isAnagram('anagram', 'nagaram') === true, 'anagram/nagaram should be anagrams');
  console.assert(isAnagram('rat', 'car') === false, 'rat/car should not be anagrams');

  console.assert(firstUniqueCharIndex('leetcode') === 0, "first unique char of 'leetcode' is 'l' at index 0");
  console.assert(firstUniqueCharIndex('loveleetcode') === 2, "first unique char of 'loveleetcode' is 'v' at index 2");
  console.assert(firstUniqueCharIndex('aabb') === -1, "'aabb' has no unique character");

  console.assert(
    JSON.stringify(findAnagramsIndices('cbaebabacd', 'abc')) === JSON.stringify([0, 6]),
    'findAnagramsIndices should find anagram windows at indices 0 and 6'
  );
  console.assert(
    JSON.stringify(findAnagramsIndices('abab', 'ab')) === JSON.stringify([0, 1, 2]),
    'findAnagramsIndices should find overlapping anagram windows'
  );

  const top2 = topKFrequent([1, 1, 1, 2, 2, 3], 2).sort();
  console.assert(JSON.stringify(top2) === JSON.stringify([1, 2]), 'topKFrequent should return the 2 most frequent values');

  console.assert(mostFrequentElement([1, 2, 2, 3, 3, 3]) === 3, 'most frequent element should be 3');
  console.assert(mostFrequentElement([]) === undefined, 'empty input has no most frequent element');

  const entries = frequencyEntriesDescending(buildFrequencyMap('aabbbc'));
  console.assert(entries[0][0] === 'b' && entries[0][1] === 3, "'b' should be the most frequent character");

  console.log('04-frequency-counting: all assertions passed');
}
