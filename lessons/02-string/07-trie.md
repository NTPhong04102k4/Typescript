# Trie for Strings

**Objective:** Store a set of strings in a tree of characters so prefix
lookups, insertions, and searches all run in time proportional to the
string length, independent of how many strings are stored.

## Concept

A **trie** (prefix tree) is a tree where each edge is labeled with one
character. Each node holds a map from character to child node, plus a flag
marking whether a complete word ends at that node. Following a string
character by character from the root traces a path through the tree;
shared prefixes share the same path.

```
insert("cat"), insert("car"), insert("dog")

                 (root)
                /      \
              c          d
              |          |
              a          o
             / \         |
            t   r        g*
            *   *

  * marks isEndOfWord = true
  "cat" -> root -c-> -a-> -t*      "car" -> root -c-> -a-> -r*
  "dog" -> root -d-> -o-> -g*
```

`search("ca")` walks `c -> a` and finds a node, but that node's
`isEndOfWord` is false — so `"ca"` is a known **prefix**, not a stored
word. `startsWith("ca")` returns true because the path exists at all;
`search("ca")` returns false because no word ends there.

## Complexity

| Operation                          | Time   | Space          |
|-------------------------------------|--------|----------------|
| `insert(word)`                      | O(L)   | O(L) new nodes worst case |
| `search(word)`                      | O(L)   | O(1)           |
| `startsWith(prefix)`                | O(L)   | O(1)           |
| Total space for n words, avg length L | —    | O(n · L) worst case (no shared prefixes) |

`L` is the length of the word/prefix being processed.

## Walkthrough

`07-trie.ts` implements the data structure and two LeetCode problems built
on it:

- `TrieNode` holds a `Map<string, TrieNode>` of children plus an
  `isEndOfWord` flag.
- `Trie` solves **208. Implement Trie (Prefix Tree)** with `insert`,
  `search`, and `startsWith`, all walking the tree one character at a time.
- `WordDictionary` solves **211. Design Add and Search Words Data
  Structure**, extending trie search with a recursive wildcard (`.`) that
  matches search across every child when encountered.
- The exercise implements **648. Replace Words**, building a trie of
  "roots" and replacing each word in a sentence with its shortest matching
  root.

## LeetCode practice

- 208. Implement Trie (Prefix Tree) (Medium)
- 211. Design Add and Search Words Data Structure (Medium)
- 648. Replace Words (Medium)

## Key takeaways

- A trie trades memory (one node per distinct character path) for lookup
  speed that depends only on string length, not dataset size.
- `isEndOfWord` is what distinguishes "this is a complete stored word"
  from "this is just a prefix some word passes through."
- Wildcard search (211) is a straightforward recursive extension: on `.`,
  try every child instead of one specific character.
- Shared prefixes (e.g. many words starting with the same root) are the
  case where a trie's space savings over a plain list/set are most
  significant.

Companion code: [`07-trie.ts`](./07-trie.ts)
