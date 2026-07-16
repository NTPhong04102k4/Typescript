// See ./09-leetcode-practice.md for the full lesson.

/**
 * LeetCode 383. Ransom Note (Easy)
 * Counts letters available in `magazine`, then spends them one by one
 * for each letter required by `ransomNote`.
 */
export function canConstruct(ransomNote: string, magazine: string): boolean {
  const available = new Map<string, number>();
  for (const ch of magazine) {
    available.set(ch, (available.get(ch) ?? 0) + 1);
  }

  for (const ch of ransomNote) {
    const remaining = available.get(ch) ?? 0;
    if (remaining === 0) return false;
    available.set(ch, remaining - 1);
  }
  return true;
}

/**
 * LeetCode 415. Add Strings (Easy)
 * Simulates elementary-school addition from the least significant digit,
 * carrying into the next column, without converting to native numbers.
 */
export function addStrings(num1: string, num2: string): string {
  let i = num1.length - 1;
  let j = num2.length - 1;
  let carry = 0;
  const digits: string[] = [];

  while (i >= 0 || j >= 0 || carry > 0) {
    const d1 = i >= 0 ? num1.charCodeAt(i) - 48 : 0;
    const d2 = j >= 0 ? num2.charCodeAt(j) - 48 : 0;
    const sum = d1 + d2 + carry;
    digits.push(String(sum % 10));
    carry = Math.floor(sum / 10);
    i--;
    j--;
  }

  return digits.reverse().join("");
}

/**
 * LeetCode 151. Reverse Words in a String (Medium)
 * Trims leading/trailing whitespace, splits on runs of whitespace, and
 * reverses word order.
 */
export function reverseWords(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .reverse()
    .join(" ");
}

const INT_MAX = 2 ** 31 - 1;
const INT_MIN = -(2 ** 31);

/**
 * LeetCode 8. String to Integer (atoi) (Medium)
 * Hand-parses optional leading whitespace, an optional sign, then digits,
 * clamping to the 32-bit signed integer range as soon as it is exceeded.
 */
export function myAtoi(s: string): number {
  let i = 0;
  const n = s.length;

  while (i < n && s[i] === " ") i++;

  let sign = 1;
  if (i < n && (s[i] === "+" || s[i] === "-")) {
    sign = s[i] === "-" ? -1 : 1;
    i++;
  }

  let result = 0;
  while (i < n && s[i] >= "0" && s[i] <= "9") {
    result = result * 10 + (s.charCodeAt(i) - 48);
    if (sign === 1 && result > INT_MAX) return INT_MAX;
    if (sign === -1 && -result < INT_MIN) return INT_MIN;
    i++;
  }

  return sign * result;
}

/**
 * LeetCode 43. Multiply Strings (Medium)
 * Grade-school digit-by-digit multiplication: each digit pair (i, j)
 * contributes to result positions (i+j) and (i+j+1), carrying into the
 * more significant position.
 */
export function multiply(num1: string, num2: string): string {
  if (num1 === "0" || num2 === "0") return "0";

  const m = num1.length;
  const n = num2.length;
  const result = new Array<number>(m + n).fill(0);

  for (let i = m - 1; i >= 0; i--) {
    const d1 = num1.charCodeAt(i) - 48;
    for (let j = n - 1; j >= 0; j--) {
      const d2 = num2.charCodeAt(j) - 48;
      const sum = result[i + j + 1] + d1 * d2;
      result[i + j + 1] = sum % 10;
      result[i + j] += Math.floor(sum / 10);
    }
  }

  let start = 0;
  while (start < result.length - 1 && result[start] === 0) start++;

  return result.slice(start).join("");
}

/**
 * LeetCode 187. Repeated DNA Sequences (Medium)
 * Slides a fixed 10-character window across the string; a Set of
 * already-seen windows flags any sequence that occurs more than once.
 */
export function findRepeatedDnaSequences(s: string): string[] {
  const WINDOW = 10;
  const seen = new Set<string>();
  const repeated = new Set<string>();

  for (let i = 0; i + WINDOW <= s.length; i++) {
    const sequence = s.slice(i, i + WINDOW);
    if (seen.has(sequence)) {
      repeated.add(sequence);
    } else {
      seen.add(sequence);
    }
  }

  return Array.from(repeated);
}

/**
 * LeetCode 32. Longest Valid Parentheses (Hard)
 * A stack of indices seeded with -1 (the position "before" the start of
 * the current run). Pushing '(' indices and popping on ')' lets the gap
 * to the new stack top measure the length of the current valid run.
 */
export function longestValidParentheses(s: string): number {
  const stack: number[] = [-1];
  let maxLen = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      stack.push(i);
      continue;
    }
    stack.pop();
    if (stack.length === 0) {
      stack.push(i);
    } else {
      maxLen = Math.max(maxLen, i - stack[stack.length - 1]);
    }
  }

  return maxLen;
}

// --- run ---
if (require.main === module) {
  console.assert(canConstruct("a", "b") === false, "383: 'b' cannot build 'a'");
  console.assert(canConstruct("aa", "aab") === true, "383: 'aab' has enough letters for 'aa'");

  console.assert(addStrings("11", "123") === "134", "415: 11 + 123 = 134");
  console.assert(addStrings("456", "77") === "533", "415: 456 + 77 = 533");
  console.assert(addStrings("0", "0") === "0", "415: 0 + 0 = 0");

  console.assert(reverseWords("  hello world  ") === "world hello", "151: trimmed and reversed");
  console.assert(reverseWords("a good   example") === "example good a", "151: collapses inner whitespace runs");

  console.assert(myAtoi("42") === 42, "8: plain positive number");
  console.assert(myAtoi("   -42") === -42, "8: leading whitespace and sign");
  console.assert(myAtoi("4193 with words") === 4193, "8: stops at first non-digit");
  console.assert(myAtoi("words and 987") === 0, "8: no leading digits means 0");
  console.assert(myAtoi("-91283472332") === INT_MIN, "8: clamps to INT_MIN on overflow");

  console.assert(multiply("2", "3") === "6", "43: 2 * 3 = 6");
  console.assert(multiply("123", "456") === "56088", "43: 123 * 456 = 56088");
  console.assert(multiply("0", "12345") === "0", "43: zero short-circuits to '0'");

  const dnaInput = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT";
  const repeatedDna = new Set(findRepeatedDnaSequences(dnaInput));
  console.assert(repeatedDna.size === 2, "187: expected exactly 2 repeated 10-letter sequences");
  console.assert(repeatedDna.has("AAAAACCCCC") && repeatedDna.has("CCCCCAAAAA"), "187: expected sequences present");

  console.assert(longestValidParentheses("(()") === 2, "32: longest valid run is '()'");
  console.assert(longestValidParentheses(")()())") === 4, "32: longest valid run is '()()'");
  console.assert(longestValidParentheses("") === 0, "32: empty string has no valid run");

  console.log("09-leetcode-practice checks passed");
}
