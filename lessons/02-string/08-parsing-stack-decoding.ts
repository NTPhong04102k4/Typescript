// See ./08-parsing-stack-decoding.md for the full lesson.

const CLOSING_TO_OPENING: Record<string, string> = {
  ")": "(",
  "]": "[",
  "}": "{",
};

/**
 * LeetCode 20. Valid Parentheses (Easy)
 * Pushes every opening bracket; on a closing bracket, the top of the
 * stack must be its matching opener.
 */
export function isValid(s: string): boolean {
  const stack: string[] = [];

  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
      continue;
    }
    const expectedOpener = CLOSING_TO_OPENING[ch];
    if (expectedOpener === undefined) continue;
    if (stack.pop() !== expectedOpener) return false;
  }

  return stack.length === 0;
}

interface DecodeFrame {
  count: number;
  previousString: string;
}

/**
 * LeetCode 394. Decode String (Medium)
 * Pushes a { count, previousString } frame every time a repeat group
 * opens, and resolves it (appending the repeated inner string) when the
 * group closes.
 */
export function decodeString(s: string): string {
  const stack: DecodeFrame[] = [];
  let currentString = "";
  let currentCount = 0;

  for (const ch of s) {
    if (ch >= "0" && ch <= "9") {
      currentCount = currentCount * 10 + Number(ch);
    } else if (ch === "[") {
      stack.push({ count: currentCount, previousString: currentString });
      currentCount = 0;
      currentString = "";
    } else if (ch === "]") {
      const frame = stack.pop();
      if (!frame) throw new Error("Unbalanced brackets in input");
      currentString = frame.previousString + currentString.repeat(frame.count);
    } else {
      currentString += ch;
    }
  }

  return currentString;
}

/**
 * LeetCode 1047. Remove All Adjacent Duplicates In String (Easy)
 * Pushes each character, popping whenever it matches the current top —
 * equivalent to repeatedly cancelling adjacent duplicate pairs.
 */
export function removeDuplicates(s: string): string {
  const stack: string[] = [];

  for (const ch of s) {
    if (stack.length > 0 && stack[stack.length - 1] === ch) {
      stack.pop();
    } else {
      stack.push(ch);
    }
  }

  return stack.join("");
}

// Exercise: implement LeetCode 71. Simplify Path (Medium) — collapse a
// Unix-style absolute path into its canonical form (resolve ".." and
// ".", drop redundant slashes).
// Solution:
export function simplifyPath(path: string): string {
  const stack: string[] = [];

  for (const segment of path.split("/")) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") {
      stack.pop();
    } else {
      stack.push(segment);
    }
  }

  return "/" + stack.join("/");
}

// --- run ---
if (require.main === module) {
  console.assert(isValid("()[]{}") === true, "20: well-formed brackets");
  console.assert(isValid("(]") === false, "20: mismatched bracket types");
  console.assert(isValid("([)]") === false, "20: wrong nesting order");
  console.assert(isValid("{[]}") === true, "20: properly nested brackets");

  console.assert(decodeString("3[a2[c]]") === "accaccacc", "394: expected 'accaccacc'");
  console.assert(decodeString("2[abc]3[cd]ef") === "abcabccdcdcdef", "394: expected 'abcabccdcdcdef'");
  console.assert(decodeString("abc") === "abc", "394: no repeat groups is a no-op");

  console.assert(removeDuplicates("abbaca") === "ca", "1047: expected 'ca'");
  console.assert(removeDuplicates("azxxzy") === "ay", "1047: expected 'ay'");

  console.assert(simplifyPath("/home/") === "/home", "71: trailing slash dropped");
  console.assert(simplifyPath("/../") === "/", "71: '..' at root stays at root");
  console.assert(simplifyPath("/home//foo/") === "/home/foo", "71: redundant slashes collapsed");
  console.assert(simplifyPath("/a/./b/../../c/") === "/c", "71: '.' and '..' resolved");

  console.log("08-parsing-stack-decoding checks passed");
}
