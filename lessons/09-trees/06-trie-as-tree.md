# Trie Revisited as a Tree of Characters

**Objective:** See a trie (prefix tree) as an n-ary tree whose edges are
labeled by characters instead of an implicit "left/right", and implement
insert/search/prefix operations over it.

## Concept

Every earlier lesson used `TreeNode<T>` with exactly two children. A
**trie** relaxes that cap: each node can have as many children as there
are distinct characters, keyed by the character that labels the edge to
that child. A dedicated `end` flag marks "a word ends here" — without it,
you couldn't tell whether `"car"` is a stored word or just a prefix of
`"cart"`.

Inserting `"cat"`, `"car"`, and `"dog"` builds this tree (`*` marks
`isEndOfWord`):

```
                    (root)
                    /    \
                  'c'    'd'
                   |       |
                  'a'     'o'
                  / \       |
               't'* 'r'*  'g'*
```

`root -> c -> a` branches into two children, `t` and `r`, each marked `*`
(end of word) for `"cat"` and `"car"`. `root -> d -> o -> g*` is a separate
branch sharing only the root. Searching `"cat"` walks `c -> a -> t` and
checks the `*` at `t`; checking `startsWith("ca")` walks the same first two
edges and stops without needing a `*` at all — a prefix is valid the
moment the path exists, regardless of whether a word actually ends there.

This structural fact — "a common prefix is a shared path from the root" —
is also how a trie finds the longest common prefix of a whole word list:
walk down from the root for as long as every node has *exactly one* child
and isn't itself a word ending; the path traced out is the longest prefix
every inserted word shares.

## Complexity

| Operation                          | Time         | Space |
|---------------------------------------|--------------|-------|
| `insert(word)`                        | O(L)         | O(L) new nodes worst case |
| `search(word)`                        | O(L)         | O(1) |
| `startsWith(prefix)`                   | O(L)         | O(1) |
| `longestCommonPrefix(words)`           | O(total chars inserted) | O(total chars) |
| `replaceWords(dict, sentence)`         | O(total chars in dict + sentence) | O(total chars in dict) |

`L` is the length of the word/prefix being processed; trie operations don't
depend on how many *other* words are stored, unlike scanning an array of
strings.

## Walkthrough

[`06-trie-as-tree.ts`](./06-trie-as-tree.ts) defines its own `TrieNode`
(a `Map<string, TrieNode>` of children plus an `isEndOfWord` flag) rather
than reusing the binary `TreeNode<T>` from lesson 01, since a trie's
branching factor isn't fixed at two. The `Trie` class implements
`insert`, `search`, and `startsWith` by walking (or creating) one child per
character. `longestCommonPrefix` inserts every word, then walks from the
root while each node has exactly one child and isn't a word boundary,
building up the shared prefix. `replaceWordsStub` is the exercise: for each
word in a sentence, walk the trie of dictionary roots until either hitting
`isEndOfWord` (replace the word with that shorter root) or running out of
matching characters (keep the original word); `replaceWords` is the worked
solution.

## LeetCode practice

- **14. Longest Common Prefix** (Easy) — solved here via trie structure
  instead of the usual pairwise string comparison.
- **208. Implement Trie (Prefix Tree)** (Medium)
- **648. Replace Words** (Medium)

## Key takeaways

- A trie is a tree whose branching factor is the alphabet size, not two —
  edges are labeled by characters, not "left"/"right".
- `isEndOfWord` is required: without it, a stored word and a mere prefix
  of a longer word are indistinguishable.
- Trie operations cost O(L) in the length of the string being processed,
  independent of how many other words are stored.
- "Longest common prefix" and "replace with shortest matching root" are
  both just walks down the trie from the root, stopping at different
  conditions (branching vs. a word boundary).

Companion code: [`06-trie-as-tree.ts`](./06-trie-as-tree.ts)
