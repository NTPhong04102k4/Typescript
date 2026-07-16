// See ./02-two-pointers-palindromes.md for the full lesson.

/** Plain two-pointer palindrome check over the entire string. */
export function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

const ALNUM_PATTERN = /[a-z0-9]/i;

function isAlphanumeric(ch: string): boolean {
  return ALNUM_PATTERN.test(ch);
}

/**
 * LeetCode 125. Valid Palindrome (Easy)
 * Two pointers that skip non-alphanumeric characters and compare
 * case-insensitively.
 */
export function isPalindromeValid125(s: string): boolean {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    while (left < right && !isAlphanumeric(s[left])) left++;
    while (left < right && !isAlphanumeric(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}

/** Helper: is s[start..end] (inclusive) a palindrome? */
export function isPalindromeRange(s: string, start: number, end: number): boolean {
  let left = start;
  let right = end;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

/**
 * LeetCode 680. Valid Palindrome II (Easy)
 * On the first mismatch, try skipping either the left or the right
 * character — the string is valid if either resulting range is a
 * palindrome.
 */
export function validPalindromeII(s: string): boolean {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) {
      return isPalindromeRange(s, left + 1, right) || isPalindromeRange(s, left, right - 1);
    }
    left++;
    right--;
  }
  return true;
}

function expandAroundCenter(s: string, left: number, right: number): string {
  while (left >= 0 && right < s.length && s[left] === s[right]) {
    left--;
    right++;
  }
  // left/right have overshot by one on both sides.
  return s.slice(left + 1, right);
}

/**
 * LeetCode 5. Longest Palindromic Substring (Medium)
 * Tries every center (odd-length centers at i, even-length centers
 * between i and i+1) and keeps the longest palindrome found.
 */
export function longestPalindromicSubstring(s: string): string {
  if (s.length === 0) return "";
  let longest = s[0];
  for (let i = 0; i < s.length; i++) {
    const odd = expandAroundCenter(s, i, i);
    if (odd.length > longest.length) longest = odd;

    const even = expandAroundCenter(s, i, i + 1);
    if (even.length > longest.length) longest = even;
  }
  return longest;
}

// Exercise: implement LeetCode 917. Reverse Only Letters (Easy) — reverse
// only the letters in the string, leaving all other characters (digits,
// punctuation, spaces) in their original positions.
// Solution:
export function reverseOnlyLetters(s: string): string {
  const chars = s.split("");
  let left = 0;
  let right = chars.length - 1;
  const isLetter = (ch: string): boolean => /[a-z]/i.test(ch);
  while (left < right) {
    if (!isLetter(chars[left])) {
      left++;
    } else if (!isLetter(chars[right])) {
      right--;
    } else {
      const tmp = chars[left];
      chars[left] = chars[right];
      chars[right] = tmp;
      left++;
      right--;
    }
  }
  return chars.join("");
}

// --- run ---
if (require.main === module) {
  console.assert(isPalindrome("racecar") === true, "racecar is a palindrome");
  console.assert(isPalindrome("hello") === false, "hello is not a palindrome");

  console.assert(
    isPalindromeValid125("A man, a plan, a canal: Panama") === true,
    "125: should ignore case and punctuation"
  );
  console.assert(isPalindromeValid125("race a car") === false, "125: should reject non-palindromes");

  console.assert(validPalindromeII("aba") === true, "680: already a palindrome");
  console.assert(validPalindromeII("abca") === true, "680: removing 'c' or 'b' yields a palindrome");
  console.assert(validPalindromeII("abc") === false, "680: no single deletion fixes this");

  console.assert(longestPalindromicSubstring("babad") === "bab", "5: expected 'bab' (or 'aba', both length 3)");
  console.assert(longestPalindromicSubstring("cbbd") === "bb", "5: expected 'bb'");

  console.assert(reverseOnlyLetters("ab-cd") === "dc-ba", "917: letters reversed, '-' stays put");
  console.assert(reverseOnlyLetters("a-bC-dEf-ghIj") === "j-Ih-gfE-dCba", "917: non-letters keep their positions");

  console.log("02-two-pointers-palindromes checks passed");
}
