// See ./05-string-building-perf.md for the full lesson.

/**
 * Builds a string with repeated `+=`. Correct, and often fast in
 * practice thanks to engine-specific cons-string optimizations, but not
 * a portable performance guarantee.
 */
export function buildStringNaiveConcat(parts: string[]): string {
  let result = "";
  for (const piece of parts) {
    result += piece;
  }
  return result;
}

/**
 * Builds the same string by pushing pieces into an array and joining
 * once. This is O(total length) regardless of engine internals.
 */
export function buildStringArrayJoin(parts: string[]): string {
  const buffer: string[] = [];
  for (const piece of parts) {
    buffer.push(piece);
  }
  return buffer.join("");
}

/**
 * LeetCode 6. Zigzag Conversion (Medium)
 * Builds one string buffer per row by walking a bouncing row index,
 * then joins all rows once at the end.
 */
export function convert(s: string, numRows: number): string {
  if (numRows <= 1 || numRows >= s.length) return s;

  const rows: string[] = new Array(numRows).fill("");
  let currentRow = 0;
  let goingDown = false;

  for (const ch of s) {
    rows[currentRow] += ch;
    if (currentRow === 0 || currentRow === numRows - 1) {
      goingDown = !goingDown;
    }
    currentRow += goingDown ? 1 : -1;
  }

  return rows.join("");
}

/**
 * LeetCode 443. String Compression (Medium)
 * Writes run-length pairs directly back into the input array (read/write
 * pointers), then truncates the array to the new length. O(1) extra
 * space beyond the input/output itself.
 */
export function compress(chars: string[]): number {
  let write = 0;
  let read = 0;

  while (read < chars.length) {
    const currentChar = chars[read];
    let count = 0;
    while (read < chars.length && chars[read] === currentChar) {
      read++;
      count++;
    }
    chars[write++] = currentChar;
    if (count > 1) {
      for (const digit of String(count)) {
        chars[write++] = digit;
      }
    }
  }

  chars.length = write;
  return write;
}

// Exercise: implement LeetCode 38. Count and Say (Medium) — return the
// nth term of the count-and-say sequence (1, 11, 21, 1211, 111221, ...),
// where each term describes the run-lengths of the previous term.
// Solution:
export function countAndSay(n: number): string {
  let result = "1";
  for (let i = 1; i < n; i++) {
    const chunks: string[] = [];
    let read = 0;
    while (read < result.length) {
      const currentChar = result[read];
      let count = 0;
      while (read < result.length && result[read] === currentChar) {
        read++;
        count++;
      }
      chunks.push(String(count), currentChar);
    }
    result = chunks.join("");
  }
  return result;
}

// --- run ---
if (require.main === module) {
  const parts = ["a", "bb", "ccc", "d"];
  console.assert(buildStringNaiveConcat(parts) === "abbcccd", "naive concat should match array-join result");
  console.assert(buildStringArrayJoin(parts) === "abbcccd", "array-join should build the same string");

  console.assert(convert("PAYPALISHIRING", 3) === "PAHNAPLSIIGYIR", "6: 3-row zigzag");
  console.assert(convert("PAYPALISHIRING", 4) === "PINALSIGYAHRPI", "6: 4-row zigzag");
  console.assert(convert("AB", 1) === "AB", "6: single row is unchanged");

  const compressible = ["a", "a", "b", "b", "c", "c", "c"];
  const newLength = compress(compressible);
  console.assert(newLength === 6, "443: expected compressed length 6");
  console.assert(compressible.join("") === "a2b2c3", "443: expected 'a2b2c3'");

  const single = ["a"];
  console.assert(compress(single) === 1 && single.join("") === "a", "443: single character stays uncompressed");

  console.assert(countAndSay(1) === "1", "38: first term is '1'");
  console.assert(countAndSay(4) === "1211", "38: fourth term is '1211'");

  console.log("05-string-building-perf checks passed");
}
