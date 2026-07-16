// Companion code for ./08-leetcode-practice.md

// --- LeetCode 383. Ransom Note (Easy) ---
// https://leetcode.com/problems/ransom-note/
// Build a frequency map of `magazine`, then decrement it while scanning
// `ransomNote`; any missing/exhausted character means it can't be built.
export function canConstructRansomNote(ransomNote: string, magazine: string): boolean {
  const available = new Map<string, number>();
  for (const ch of magazine) {
    available.set(ch, (available.get(ch) ?? 0) + 1);
  }
  for (const ch of ransomNote) {
    const remaining = available.get(ch);
    if (!remaining) return false;
    available.set(ch, remaining - 1);
  }
  return true;
}

// --- LeetCode 290. Word Pattern (Easy) ---
// https://leetcode.com/problems/word-pattern/
// A bidirectional mapping (like isIsomorphic from lesson 02) between
// pattern characters and words: two Maps make sure the relationship holds
// in both directions (one char per word, one word per char).
export function wordPattern(pattern: string, s: string): boolean {
  const words = s.split(' ');
  if (words.length !== pattern.length) return false;

  const charToWord = new Map<string, string>();
  const wordToChar = new Map<string, string>();
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    const word = words[i];
    const mappedWord = charToWord.get(ch);
    const mappedChar = wordToChar.get(word);
    if (mappedWord === undefined && mappedChar === undefined) {
      charToWord.set(ch, word);
      wordToChar.set(word, ch);
    } else if (mappedWord !== word || mappedChar !== ch) {
      return false;
    }
  }
  return true;
}

// --- LeetCode 645. Set Mismatch (Easy) ---
// https://leetcode.com/problems/set-mismatch/
// `nums` should contain each of 1..n exactly once but one value got
// duplicated (overwriting the value it replaced). A frequency map found by
// one pass over `nums`, then one pass over 1..n, finds both in O(n).
export function findErrorNums(nums: readonly number[]): [duplicate: number, missing: number] {
  const counts = new Map<number, number>();
  for (const num of nums) {
    counts.set(num, (counts.get(num) ?? 0) + 1);
  }

  let duplicate = -1;
  let missing = -1;
  for (let value = 1; value <= nums.length; value++) {
    const count = counts.get(value) ?? 0;
    if (count === 2) duplicate = value;
    else if (count === 0) missing = value;
  }
  return [duplicate, missing];
}

// --- LeetCode 202. Happy Number (Easy) ---
// https://leetcode.com/problems/happy-number/
// Repeatedly replace n by the sum of the squares of its digits. A Set of
// every value seen so far detects the cycle that non-happy numbers fall
// into, since a bounded sequence that never reaches 1 must eventually repeat.
function sumOfSquaredDigits(n: number): number {
  let sum = 0;
  let remaining = n;
  while (remaining > 0) {
    const digit = remaining % 10;
    sum += digit * digit;
    remaining = Math.floor(remaining / 10);
  }
  return sum;
}

export function isHappy(n: number): boolean {
  const seen = new Set<number>();
  let current = n;
  while (current !== 1 && !seen.has(current)) {
    seen.add(current);
    current = sumOfSquaredDigits(current);
  }
  return current === 1;
}

// --- LeetCode 560. Subarray Sum Equals K (Medium) ---
// https://leetcode.com/problems/subarray-sum-equals-k/
// A running prefix sum turns "does some subarray sum to k?" into "has
// (prefixSum - k) been seen as an earlier prefix sum?" — a Map<prefixSum,
// count> answers that in O(1) per element instead of checking every
// subarray directly.
export function subarraySumEqualsK(nums: readonly number[], k: number): number {
  const prefixSumCounts = new Map<number, number>();
  prefixSumCounts.set(0, 1); // empty prefix, sum 0, seen once
  let prefixSum = 0;
  let count = 0;

  for (const num of nums) {
    prefixSum += num;
    count += prefixSumCounts.get(prefixSum - k) ?? 0;
    prefixSumCounts.set(prefixSum, (prefixSumCounts.get(prefixSum) ?? 0) + 1);
  }
  return count;
}

// --- LeetCode 76. Minimum Window Substring (Hard) ---
// https://leetcode.com/problems/minimum-window-substring/
// Sliding window with two frequency Maps: `need` (built once from `t`) and
// `windowCounts` (updated as the window grows/shrinks). `satisfied` tracks
// how many distinct required characters currently meet their needed count,
// so the window only shrinks while every requirement still holds.
export function minWindowSubstring(s: string, t: string): string {
  if (t.length === 0 || s.length < t.length) return '';

  const need = new Map<string, number>();
  for (const ch of t) {
    need.set(ch, (need.get(ch) ?? 0) + 1);
  }
  const required = need.size;

  const windowCounts = new Map<string, number>();
  let satisfied = 0;
  let left = 0;
  let bestLength = Infinity;
  let bestStart = 0;

  for (let right = 0; right < s.length; right++) {
    const rightChar = s[right];
    windowCounts.set(rightChar, (windowCounts.get(rightChar) ?? 0) + 1);
    if (need.has(rightChar) && windowCounts.get(rightChar) === need.get(rightChar)) {
      satisfied++;
    }

    while (satisfied === required) {
      if (right - left + 1 < bestLength) {
        bestLength = right - left + 1;
        bestStart = left;
      }
      const leftChar = s[left];
      const newCount = (windowCounts.get(leftChar) ?? 0) - 1;
      windowCounts.set(leftChar, newCount);
      if (need.has(leftChar) && newCount < (need.get(leftChar) as number)) {
        satisfied--;
      }
      left++;
    }
  }

  return bestLength === Infinity ? '' : s.slice(bestStart, bestStart + bestLength);
}

// Exercise: LeetCode 442. Find All Duplicates in an Array (Medium)
// https://leetcode.com/problems/find-all-duplicates-in-an-array/
// Every value in 1..n appears once or twice; return every value that
// appears exactly twice, using a frequency Map instead of the array's
// index-marking trick.
export function findAllDuplicatesStub(_nums: readonly number[]): number[] {
  throw new Error('not implemented');
}
// Solution:
export function findAllDuplicates(nums: readonly number[]): number[] {
  const counts = new Map<number, number>();
  for (const num of nums) {
    counts.set(num, (counts.get(num) ?? 0) + 1);
  }
  const duplicates: number[] = [];
  for (const [value, count] of counts) {
    if (count === 2) duplicates.push(value);
  }
  return duplicates;
}

// Exercise: LeetCode 1189. Maximum Number of Balloons (Easy)
// https://leetcode.com/problems/maximum-number-of-balloons/
// "balloon" needs b:1, a:1, l:2, o:2, n:1. Count how many letters of `text`
// match each required letter, then the answer is limited by whichever
// letter runs out first relative to how many it needs per instance.
export function maxNumberOfBalloonsStub(_text: string): number {
  throw new Error('not implemented');
}
// Solution:
export function maxNumberOfBalloons(text: string): number {
  const required = new Map<string, number>([
    ['b', 1],
    ['a', 1],
    ['l', 2],
    ['o', 2],
    ['n', 1],
  ]);

  const available = new Map<string, number>();
  for (const ch of text) {
    if (required.has(ch)) available.set(ch, (available.get(ch) ?? 0) + 1);
  }

  let maxCount = Infinity;
  for (const [ch, neededPerInstance] of required) {
    const have = available.get(ch) ?? 0;
    maxCount = Math.min(maxCount, Math.floor(have / neededPerInstance));
  }
  return maxCount === Infinity ? 0 : maxCount;
}

// --- run ---
if (require.main === module) {
  console.assert(canConstructRansomNote('a', 'b') === false, "'a' cannot be built from 'b'");
  console.assert(canConstructRansomNote('aa', 'ab') === false, "'aa' needs two a's, magazine has one");
  console.assert(canConstructRansomNote('aa', 'aab') === true, "'aa' can be built from 'aab'");

  console.assert(wordPattern('abba', 'dog cat cat dog') === true, 'abba/dog cat cat dog should match');
  console.assert(wordPattern('abba', 'dog cat cat fish') === false, 'abba/dog cat cat fish should not match');
  console.assert(wordPattern('aaaa', 'dog cat cat dog') === false, 'aaaa requires the same word every time');

  console.assert(
    JSON.stringify(findErrorNums([1, 2, 2, 4])) === JSON.stringify([2, 3]),
    'findErrorNums should report duplicate 2 and missing 3'
  );
  console.assert(
    JSON.stringify(findErrorNums([1, 1])) === JSON.stringify([1, 2]),
    'findErrorNums should report duplicate 1 and missing 2'
  );

  console.assert(isHappy(19) === true, '19 is a happy number (19 -> 82 -> 68 -> 100 -> 1)');
  console.assert(isHappy(2) === false, '2 falls into the known non-happy cycle');
  console.assert(isHappy(1) === true, '1 is trivially happy');

  console.assert(subarraySumEqualsK([1, 1, 1], 2) === 2, 'two subarrays of [1,1,1] sum to 2');
  console.assert(subarraySumEqualsK([1, 2, 3], 3) === 2, '[1,2] and [3] both sum to 3');

  console.assert(minWindowSubstring('ADOBECODEBANC', 'ABC') === 'BANC', 'classic minimum window should be BANC');
  console.assert(minWindowSubstring('a', 'a') === 'a', 'single matching character should return itself');
  console.assert(minWindowSubstring('a', 'aa') === '', 'impossible window should return empty string');

  console.assert(
    JSON.stringify(findAllDuplicates([4, 3, 2, 7, 8, 2, 3, 1]).sort((a, b) => a - b)) === JSON.stringify([2, 3]),
    'findAllDuplicates should find 2 and 3'
  );

  console.assert(maxNumberOfBalloons('nlaebolko') === 1, "'nlaebolko' can spell balloon exactly once");
  console.assert(maxNumberOfBalloons('loonbalxballpoon') === 2, "'loonbalxballpoon' can spell balloon twice");

  console.log('08-leetcode-practice: all assertions passed');
}
