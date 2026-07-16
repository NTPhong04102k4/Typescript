// See ./04-hashing-anagrams.md for the full lesson.

/**
 * LeetCode 242. Valid Anagram (Easy)
 * Uses a single 26-length count array: increment for characters in s,
 * decrement for characters in t. The strings are anagrams iff every
 * count returns to zero (assumes lowercase English letters).
 */
export function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const counts = new Array<number>(26).fill(0);
  const code = (ch: string): number => ch.charCodeAt(0) - 97;

  for (let i = 0; i < s.length; i++) {
    counts[code(s[i])]++;
    counts[code(t[i])]--;
  }
  return counts.every((count) => count === 0);
}

/**
 * LeetCode 49. Group Anagrams (Medium)
 * Buckets words by a canonical key: their letters sorted alphabetically.
 * Anagrams always produce the same sorted key.
 */
export function groupAnagrams(strs: string[]): string[][] {
  const buckets = new Map<string, string[]>();

  for (const word of strs) {
    const key = word.split("").sort().join("");
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.push(word);
    } else {
      buckets.set(key, [word]);
    }
  }

  return Array.from(buckets.values());
}

function frequencyArraysEqual(a: number[], b: number[]): boolean {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * LeetCode 438. Find All Anagrams in a String (Medium)
 * Slides a fixed-size window (length p.length) across s, comparing
 * running frequency arrays instead of re-sorting each window.
 */
export function findAnagrams(s: string, p: string): number[] {
  const result: number[] = [];
  if (p.length > s.length) return result;

  const code = (ch: string): number => ch.charCodeAt(0) - 97;
  const need = new Array<number>(26).fill(0);
  const window = new Array<number>(26).fill(0);

  for (const ch of p) {
    need[code(ch)]++;
  }

  for (let i = 0; i < s.length; i++) {
    window[code(s[i])]++;
    if (i >= p.length) {
      window[code(s[i - p.length])]--;
    }
    if (i >= p.length - 1 && frequencyArraysEqual(need, window)) {
      result.push(i - p.length + 1);
    }
  }

  return result;
}

// Exercise: implement LeetCode 205. Isomorphic Strings (Easy) — two
// strings are isomorphic if characters in s can be consistently replaced
// (one-to-one, both directions) to get t.
// Solution:
export function isIsomorphic(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const sToT = new Map<string, string>();
  const tToS = new Map<string, string>();

  for (let i = 0; i < s.length; i++) {
    const a = s[i];
    const b = t[i];

    const mappedA = sToT.get(a);
    const mappedB = tToS.get(b);

    if (mappedA === undefined && mappedB === undefined) {
      sToT.set(a, b);
      tToS.set(b, a);
    } else if (mappedA !== b || mappedB !== a) {
      return false;
    }
  }
  return true;
}

// --- run ---
if (require.main === module) {
  console.assert(isAnagram("anagram", "nagaram") === true, "242: same letters, same counts");
  console.assert(isAnagram("rat", "car") === false, "242: different letters");

  const grouped = groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]);
  console.log("groupAnagrams:", grouped);
  console.assert(grouped.length === 3, "49: expected 3 anagram groups");
  const totalWords = grouped.reduce((sum, group) => sum + group.length, 0);
  console.assert(totalWords === 6, "49: all 6 words should be placed in a group");

  console.assert(
    JSON.stringify(findAnagrams("cbaebabacd", "abc")) === JSON.stringify([0, 6]),
    "438: expected start indices [0, 6]"
  );
  console.assert(
    JSON.stringify(findAnagrams("abab", "ab")) === JSON.stringify([0, 1, 2]),
    "438: expected start indices [0, 1, 2]"
  );

  console.assert(isIsomorphic("egg", "add") === true, "205: e->a, g->d is consistent");
  console.assert(isIsomorphic("foo", "bar") === false, "205: 'o' would have to map to both 'a' and 'r'");
  console.assert(isIsomorphic("badc", "baba") === false, "205: two source chars cannot map to the same target");

  console.log("04-hashing-anagrams checks passed");
}
