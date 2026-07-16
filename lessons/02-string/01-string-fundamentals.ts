// See ./01-string-fundamentals.md for the full lesson.

/**
 * Compares two primitive strings and two boxed String objects to show
 * that primitives compare by value while boxed objects compare by
 * reference.
 */
export function demonstrateBoxedStringIdentity(): {
  primitiveEqual: boolean;
  boxedEqual: boolean;
} {
  const a = "hello";
  const b = "hello";
  const primitiveEqual = a === b; // true: primitives compared by value

  const boxedA: String = new String("hello");
  const boxedB: String = new String("hello");
  const boxedEqual = boxedA === boxedB; // false: distinct object references

  return { primitiveEqual, boxedEqual };
}

/**
 * Splits a string into code points using Array.from, which is
 * surrogate-pair-aware (handles emoji and other astral characters
 * correctly).
 */
export function codePointsOf(s: string): string[] {
  return Array.from(s);
}

/**
 * Splits a string into raw UTF-16 code units via split(''), which can
 * tear a surrogate pair (e.g. many emoji) into two invalid halves.
 * Kept only to contrast with codePointsOf.
 */
export function naiveCodeUnitsOf(s: string): string[] {
  return s.split("");
}

/**
 * LeetCode 344. Reverse String (Easy)
 * Reverses the character array in place using the two-pointer swap
 * pattern used throughout this topic.
 */
export function reverseStringLeetCode344(chars: string[]): void {
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    const tmp = chars[left];
    chars[left] = chars[right];
    chars[right] = tmp;
    left++;
    right--;
  }
}

// Exercise: implement LeetCode 14. Longest Common Prefix (Easy) —
// given an array of strings, return the longest prefix shared by all of
// them, or "" if none exists.
// Solution:
export function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return "";
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    const current = strs[i];
    let j = 0;
    const limit = Math.min(prefix.length, current.length);
    while (j < limit && prefix[j] === current[j]) {
      j++;
    }
    prefix = prefix.slice(0, j);
    if (prefix === "") return "";
  }
  return prefix;
}

// Exercise: implement LeetCode 58. Length of Last Word (Easy) — given a
// string of words separated by spaces, return the length of the last
// word (trailing spaces should be ignored).
// Solution:
export function lengthOfLastWord(s: string): number {
  let i = s.length - 1;
  while (i >= 0 && s[i] === " ") {
    i--;
  }
  let length = 0;
  while (i >= 0 && s[i] !== " ") {
    length++;
    i--;
  }
  return length;
}

// --- run ---
if (require.main === module) {
  const identity = demonstrateBoxedStringIdentity();
  console.log("boxed string identity demo:", identity);
  console.assert(identity.primitiveEqual === true, "primitives should be value-equal");
  console.assert(identity.boxedEqual === false, "boxed Strings should not be reference-equal");

  const withEmoji = "a👍b";
  console.log("codePointsOf:", codePointsOf(withEmoji));
  console.log("naiveCodeUnitsOf:", naiveCodeUnitsOf(withEmoji));
  console.assert(codePointsOf(withEmoji).length === 3, "code points should count the emoji as one unit");
  console.assert(naiveCodeUnitsOf(withEmoji).length === 4, "split('') tears the surrogate pair into two units");

  const chars = ["h", "e", "l", "l", "o"];
  reverseStringLeetCode344(chars);
  console.log("reverseStringLeetCode344:", chars.join(""));
  console.assert(chars.join("") === "olleh", "reverseStringLeetCode344 should reverse in place");

  console.assert(
    longestCommonPrefix(["flower", "flow", "flight"]) === "fl",
    "longestCommonPrefix should find shared prefix"
  );
  console.assert(
    longestCommonPrefix(["dog", "racecar", "car"]) === "",
    "longestCommonPrefix should return empty when there is no common prefix"
  );

  console.assert(lengthOfLastWord("Hello World") === 5, "lengthOfLastWord should count 'World'");
  console.assert(lengthOfLastWord("   fly me   to   the moon  ") === 4, "lengthOfLastWord should ignore trailing spaces");

  console.log("01-string-fundamentals checks passed");
}
