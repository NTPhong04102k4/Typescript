// Companion code for ./06-trie-as-tree.md

/** Trie node: one child per next character, plus a word-boundary flag. */
export class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord = false;
}

/** Inserts `word` into the trie rooted at `root`, creating nodes as needed. */
function insertWord(root: TrieNode, word: string): void {
  let node = root;
  for (const char of word) {
    let next = node.children.get(char);
    if (next === undefined) {
      next = new TrieNode();
      node.children.set(char, next);
    }
    node = next;
  }
  node.isEndOfWord = true;
}

/** Walks from `root` along `str`'s characters; null if the path doesn't exist. */
function walk(root: TrieNode, str: string): TrieNode | null {
  let node = root;
  for (const char of str) {
    const next = node.children.get(char);
    if (next === undefined) return null;
    node = next;
  }
  return node;
}

// --- LeetCode 208. Implement Trie (Prefix Tree) (Medium) ---
// https://leetcode.com/problems/implement-trie-prefix-tree/
export class Trie {
  private readonly root = new TrieNode();

  insert(word: string): void {
    insertWord(this.root, word);
  }

  search(word: string): boolean {
    const node = walk(this.root, word);
    return node !== null && node.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    return walk(this.root, prefix) !== null;
  }
}

// --- LeetCode 14. Longest Common Prefix (Easy), via trie structure ---
// https://leetcode.com/problems/longest-common-prefix/
// Insert every word, then walk from the root while each node has exactly
// one child and isn't itself a word boundary -- that shared path is the
// longest common prefix.
export function longestCommonPrefix(words: readonly string[]): string {
  if (words.length === 0) return '';
  const root = new TrieNode();
  for (const word of words) insertWord(root, word);

  let node = root;
  let prefix = '';
  while (node.children.size === 1 && !node.isEndOfWord) {
    const [char, next] = [...node.children.entries()][0];
    prefix += char;
    node = next;
  }
  return prefix;
}

// Exercise: LeetCode 648. Replace Words (Medium) -- given dictionary
// "roots" and a sentence, replace every word that has one of the roots as
// a prefix with that (shortest matching) root.
export function replaceWordsStub(_roots: readonly string[], _sentence: string): string {
  throw new Error('not implemented');
}
// Solution:
export function replaceWords(roots: readonly string[], sentence: string): string {
  const root = new TrieNode();
  for (const dictWord of roots) insertWord(root, dictWord);

  function shortestRoot(word: string): string {
    let node = root;
    let prefix = '';
    for (const char of word) {
      const next = node.children.get(char);
      if (next === undefined) return word; // no matching root, keep the word
      prefix += char;
      node = next;
      if (node.isEndOfWord) return prefix;
    }
    return word;
  }

  return sentence
    .split(' ')
    .map(shortestRoot)
    .join(' ');
}

// --- run ---
if (require.main === module) {
  const trie = new Trie();
  trie.insert('cat');
  trie.insert('car');
  trie.insert('dog');

  console.assert(trie.search('cat') === true, '"cat" was inserted, should be found');
  console.assert(trie.search('ca') === false, '"ca" is only a prefix, not an inserted word');
  console.assert(trie.startsWith('ca') === true, '"ca" is a valid prefix (of both cat and car)');
  console.assert(trie.startsWith('do') === true, '"do" is a valid prefix of dog');
  console.assert(trie.search('do') === false, '"do" was never inserted as a whole word');
  console.assert(trie.startsWith('cow') === false, '"cow" was never inserted and shares no path');

  console.assert(
    longestCommonPrefix(['cat', 'car', 'cart']) === 'ca',
    'the longest shared path for cat/car/cart is "ca"'
  );
  console.assert(longestCommonPrefix(['dog', 'racecar', 'car']) === '', 'no shared prefix at all');

  console.assert(
    replaceWords(['cat', 'bat', 'rat'], 'the cattle was rattled by the battery') ===
      'the cat was rat by the bat',
    'each word with a dictionary root as prefix should be replaced by that root'
  );

  console.log('06-trie-as-tree: all assertions passed');
}
