# Traversal & Two Pointers (Palindromes)

**Objective:** Use two pointers moving inward from both ends of a string to
check and build palindromes in O(n) time and O(1) extra space.

## Concept

A palindrome reads the same forwards and backwards. Instead of reversing the
string (O(n) extra space) and comparing, walk one pointer from the start and
one from the end, moving them toward the middle and comparing characters as
you go. As soon as a mismatch is found, you can stop (or, for "almost
palindrome" variants, try skipping one side).

```
s = "r a c e c a r"
     ^             ^
   left           right      s[left] === s[right] ('r' === 'r') -> move inward

s = "r a c e c a r"
       ^         ^
     left       right        s[left] === s[right] ('a' === 'a') -> move inward

s = "r a c e c a r"
           ^ ^
         left right          left crosses right -> palindrome confirmed
```

For **expand-around-center** (used for substrings, e.g. Longest Palindromic
Substring), the pointers start together (or adjacent, for even length) at a
candidate center and move *outward* instead of inward:

```
s = "b a b a d"
        ^
     center (index 2, 'b')
   expand: left-- , right++
       ^   ^
   s[1]='a' === s[3]='a' -> keep expanding
     ^       ^
  s[0]='b' === s[4]='d'? no -> stop, palindrome = "aba"
```

## Complexity

| Operation                                   | Time | Space |
|----------------------------------------------|------|-------|
| Two-pointer palindrome check                  | O(n) | O(1)  |
| Filtered palindrome check (alnum-only, 125)   | O(n) | O(1)  |
| Valid Palindrome II (one deletion allowed)    | O(n) | O(1)  |
| Expand around center (per center)             | O(n) | O(1)  |
| Longest Palindromic Substring (all centers)   | O(n^2) | O(1) |

## Walkthrough

`02-two-pointers-palindromes.ts` builds up from a strict check to fuzzier
variants:

- `isPalindrome` is the plain two-pointer check on the whole string.
- `isPalindromeValid125` solves **125. Valid Palindrome** by skipping
  non-alphanumeric characters and comparing case-insensitively.
- `isPalindromeRange` is a small helper (start/end bounds) reused by
  `validPalindromeII`, which solves **680. Valid Palindrome II** by trying
  to skip either the left or right character on the first mismatch.
- `longestPalindromicSubstring` solves **5. Longest Palindromic Substring**
  using expand-around-center for both odd- and even-length palindromes.
- The exercise implements **917. Reverse Only Letters**.

## LeetCode practice

- 125. Valid Palindrome (Easy)
- 680. Valid Palindrome II (Easy)
- 5. Longest Palindromic Substring (Medium)
- 917. Reverse Only Letters (Easy)

## Key takeaways

- Two pointers moving inward check a palindrome in O(n) time, O(1) space —
  no need to allocate a reversed copy.
- Filtering/normalizing (case, non-alphanumeric) can be done lazily while
  the pointers move, avoiding a separate O(n) pass.
- "Almost palindrome" problems (680) extend the pattern: on the first
  mismatch, branch into two sub-checks that each skip one side.
- Expand-around-center reuses the same inward/outward pointer idea to find
  palindromic substrings, at the cost of trying every possible center.

Companion code: [`02-two-pointers-palindromes.ts`](./02-two-pointers-palindromes.ts)
