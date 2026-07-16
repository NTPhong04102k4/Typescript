// See ./03-sliding-window.md for the full lesson.

/**
 * LeetCode 3. Longest Substring Without Repeating Characters (Medium)
 * Tracks the last-seen index of each character so `left` can jump
 * directly past a repeat instead of shrinking one step at a time.
 */
export function lengthOfLongestSubstring(s: string): number {
  const lastIndex = new Map<string, number>();
  let left = 0;
  let maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    const prevIndex = lastIndex.get(ch);
    if (prevIndex !== undefined && prevIndex >= left) {
      left = prevIndex + 1;
    }
    lastIndex.set(ch, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

/**
 * LeetCode 76. Minimum Window Substring (Hard)
 * Grows the window until it satisfies every required character count,
 * then shrinks from the left while it remains valid, recording the
 * smallest valid window seen.
 */
export function minWindow(s: string, t: string): string {
  if (t.length === 0 || s.length === 0) return "";

  const need = new Map<string, number>();
  for (const ch of t) {
    need.set(ch, (need.get(ch) ?? 0) + 1);
  }
  const required = need.size;
  let formed = 0;

  const windowCounts = new Map<string, number>();
  let left = 0;
  let bestLen = Infinity;
  let bestLeft = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    windowCounts.set(ch, (windowCounts.get(ch) ?? 0) + 1);
    if (need.has(ch) && windowCounts.get(ch) === need.get(ch)) {
      formed++;
    }

    while (formed === required) {
      if (right - left + 1 < bestLen) {
        bestLen = right - left + 1;
        bestLeft = left;
      }
      const leftCh = s[left];
      windowCounts.set(leftCh, (windowCounts.get(leftCh) ?? 0) - 1);
      if (need.has(leftCh) && (windowCounts.get(leftCh) as number) < (need.get(leftCh) as number)) {
        formed--;
      }
      left++;
    }
  }

  return bestLen === Infinity ? "" : s.slice(bestLeft, bestLeft + bestLen);
}

/**
 * LeetCode 424. Longest Repeating Character Replacement (Medium)
 * Tracks the highest single-character frequency seen so far in the
 * window; the window is valid as long as (window length - maxCount)
 * <= k replacements. maxCount is allowed to go stale on shrink because
 * the recorded answer only ever grows when a strictly better maxCount
 * is found.
 */
export function characterReplacement(s: string, k: number): number {
  const counts = new Map<string, number>();
  let left = 0;
  let maxCount = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
    maxCount = Math.max(maxCount, counts.get(ch) as number);

    const windowLen = right - left + 1;
    if (windowLen - maxCount > k) {
      const leftCh = s[left];
      counts.set(leftCh, (counts.get(leftCh) as number) - 1);
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

function frequencyArraysEqual(a: number[], b: number[]): boolean {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// Exercise: implement LeetCode 567. Permutation in String (Medium) —
// return true if s2 contains a permutation (any reordering) of s1 as a
// contiguous substring. Inputs are lowercase English letters.
// Solution:
export function checkInclusion(s1: string, s2: string): boolean {
  if (s1.length > s2.length) return false;

  const code = (ch: string): number => ch.charCodeAt(0) - 97;
  const need = new Array<number>(26).fill(0);
  const window = new Array<number>(26).fill(0);

  for (const ch of s1) {
    need[code(ch)]++;
  }

  for (let i = 0; i < s2.length; i++) {
    window[code(s2[i])]++;
    if (i >= s1.length) {
      window[code(s2[i - s1.length])]--;
    }
    if (i >= s1.length - 1 && frequencyArraysEqual(need, window)) {
      return true;
    }
  }
  return false;
}

// --- run ---
if (require.main === module) {
  console.assert(lengthOfLongestSubstring("abcabcbb") === 3, "3: expected 'abc' length 3");
  console.assert(lengthOfLongestSubstring("bbbbb") === 1, "3: expected 'b' length 1");
  console.assert(lengthOfLongestSubstring("pwwkew") === 3, "3: expected 'wke' length 3");

  console.assert(minWindow("ADOBECODEBANC", "ABC") === "BANC", "76: expected 'BANC'");
  console.assert(minWindow("a", "a") === "a", "76: single character match");
  console.assert(minWindow("a", "aa") === "", "76: not enough 'a's in s");

  console.assert(characterReplacement("ABAB", 2) === 4, "424: replace both to get 'AAAA'/'BBBB'");
  console.assert(characterReplacement("AABABBA", 1) === 4, "424: expected window length 4");

  console.assert(checkInclusion("ab", "eidbaooo") === true, "567: 'ba' is a permutation of 'ab'");
  console.assert(checkInclusion("ab", "eidboaoo") === false, "567: no permutation of 'ab' present");

  console.log("03-sliding-window checks passed");
}
