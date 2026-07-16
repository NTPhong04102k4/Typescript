// See ./06-pattern-matching-kmp.md for the full lesson.

/**
 * Builds the KMP failure function (a.k.a. LPS table): failure[i] is the
 * length of the longest proper prefix of pattern[0..i] that is also a
 * suffix of pattern[0..i].
 */
export function buildFailureFunction(pattern: string): number[] {
  const m = pattern.length;
  const failure = new Array<number>(m).fill(0);
  let len = 0;

  for (let i = 1; i < m; i++) {
    while (len > 0 && pattern[i] !== pattern[len]) {
      len = failure[len - 1];
    }
    if (pattern[i] === pattern[len]) {
      len++;
    }
    failure[i] = len;
  }
  return failure;
}

/**
 * Finds every occurrence of `pattern` in `text` in O(n + m) using the
 * failure function to avoid ever moving the text pointer backward.
 * Returns all match start indices.
 */
export function kmpSearch(text: string, pattern: string): number[] {
  const matches: number[] = [];
  const m = pattern.length;
  if (m === 0) return matches;

  const failure = buildFailureFunction(pattern);
  let j = 0;

  for (let i = 0; i < text.length; i++) {
    while (j > 0 && text[i] !== pattern[j]) {
      j = failure[j - 1];
    }
    if (text[i] === pattern[j]) {
      j++;
    }
    if (j === m) {
      matches.push(i - m + 1);
      j = failure[j - 1];
    }
  }
  return matches;
}

/**
 * LeetCode 28. Find the Index of the First Occurrence in a String (Easy)
 */
export function strStr(haystack: string, needle: string): number {
  if (needle.length === 0) return 0;
  const matches = kmpSearch(haystack, needle);
  return matches.length > 0 ? matches[0] : -1;
}

/**
 * LeetCode 1392. Longest Happy Prefix (Hard)
 * The answer is exactly failure[n-1] applied to the string's own
 * failure function: the longest proper prefix that is also a suffix.
 */
export function longestHappyPrefix(s: string): string {
  if (s.length === 0) return "";
  const failure = buildFailureFunction(s);
  const len = failure[s.length - 1];
  return s.slice(0, len);
}

// Exercise: implement LeetCode 459. Repeated Substring Pattern (Easy) —
// return true if the string can be built by repeating a shorter
// substring one or more times.
// Solution: the failure function's last value tells us the longest
// border (prefix == suffix). If the "unit" length (n - border) evenly
// divides n, the string is exactly that unit repeated n/(n-border) times.
export function repeatedSubstringPattern(s: string): boolean {
  const n = s.length;
  if (n === 0) return false;

  const failure = buildFailureFunction(s);
  const borderLen = failure[n - 1];
  const unitLen = n - borderLen;
  return borderLen > 0 && n % unitLen === 0;
}

// --- run ---
if (require.main === module) {
  console.assert(
    JSON.stringify(buildFailureFunction("ababc")) === JSON.stringify([0, 0, 1, 2, 0]),
    "failure function of 'ababc' should be [0,0,1,2,0]"
  );

  console.assert(
    JSON.stringify(kmpSearch("ababaabab", "abab")) === JSON.stringify([0, 5]),
    "kmpSearch should find 'abab' at indices 0 and 5"
  );

  console.assert(strStr("hello", "ll") === 2, "28: 'll' starts at index 2");
  console.assert(strStr("aaaaa", "bba") === -1, "28: pattern not present");
  console.assert(strStr("abc", "") === 0, "28: empty needle matches at index 0");

  console.assert(longestHappyPrefix("level") === "l", "1392: expected 'l'");
  console.assert(longestHappyPrefix("ababab") === "abab", "1392: expected 'abab'");

  console.assert(repeatedSubstringPattern("abab") === true, "459: 'abab' = 'ab' + 'ab'");
  console.assert(repeatedSubstringPattern("aba") === false, "459: 'aba' has no repeating unit");
  console.assert(repeatedSubstringPattern("abcabcabcabc") === true, "459: 'abc' repeated 4 times");

  console.log("06-pattern-matching-kmp checks passed");
}
