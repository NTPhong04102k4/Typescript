// See ./07-trie.md for the full lesson.

/** A single node in a trie: one child per next character, plus a flag
 * marking whether a complete word ends here. */
export class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord = false;
}

/**
 * LeetCode 208. Implement Trie (Prefix Tree) (Medium)
 */
export class Trie {
  private readonly root: TrieNode = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      let next = node.children.get(ch);
      if (!next) {
        next = new TrieNode();
        node.children.set(ch, next);
      }
      node = next;
    }
    node.isEndOfWord = true;
  }

  search(word: string): boolean {
    const node = this.findNode(word);
    return node !== null && node.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== null;
  }

  private findNode(word: string): TrieNode | null {
    let node = this.root;
    for (const ch of word) {
      const next = node.children.get(ch);
      if (!next) return null;
      node = next;
    }
    return node;
  }
}

/**
 * LeetCode 211. Design Add and Search Words Data Structure (Medium)
 * Extends trie search with a recursive wildcard: '.' matches any single
 * character, trying every child at that position.
 */
export class WordDictionary {
  private readonly root: TrieNode = new TrieNode();

  addWord(word: string): void {
    let node = this.root;
    for (const ch of word) {
      let next = node.children.get(ch);
      if (!next) {
        next = new TrieNode();
        node.children.set(ch, next);
      }
      node = next;
    }
    node.isEndOfWord = true;
  }

  search(word: string): boolean {
    return this.searchFrom(word, 0, this.root);
  }

  private searchFrom(word: string, index: number, node: TrieNode): boolean {
    if (index === word.length) return node.isEndOfWord;

    const ch = word[index];
    if (ch === ".") {
      for (const child of node.children.values()) {
        if (this.searchFrom(word, index + 1, child)) return true;
      }
      return false;
    }

    const next = node.children.get(ch);
    if (!next) return false;
    return this.searchFrom(word, index + 1, next);
  }
}

// Exercise: implement LeetCode 648. Replace Words (Medium) — given a
// dictionary of word roots and a sentence, replace every word in the
// sentence with the shortest root that is a prefix of it (leave the word
// unchanged if no root matches).
// Solution:
export function replaceWords(dictionary: string[], sentence: string): string {
  const root = new TrieNode();
  for (const word of dictionary) {
    let node = root;
    for (const ch of word) {
      let next = node.children.get(ch);
      if (!next) {
        next = new TrieNode();
        node.children.set(ch, next);
      }
      node = next;
    }
    node.isEndOfWord = true;
  }

  const replaced = sentence.split(" ").map((word) => {
    let node = root;
    let prefix = "";
    for (const ch of word) {
      const next = node.children.get(ch);
      if (!next) return word;
      prefix += ch;
      node = next;
      if (node.isEndOfWord) return prefix;
    }
    return word;
  });

  return replaced.join(" ");
}

// --- run ---
if (require.main === module) {
  const trie = new Trie();
  trie.insert("cat");
  trie.insert("car");
  trie.insert("dog");

  console.assert(trie.search("cat") === true, "208: 'cat' was inserted");
  console.assert(trie.search("ca") === false, "208: 'ca' is only a prefix, not a stored word");
  console.assert(trie.startsWith("ca") === true, "208: 'ca' is a valid prefix");
  console.assert(trie.startsWith("do") === true, "208: 'do' is a prefix of 'dog'");
  console.assert(trie.startsWith("bird") === false, "208: no word starts with 'bird'");

  const dict = new WordDictionary();
  dict.addWord("bad");
  dict.addWord("dad");
  dict.addWord("mad");
  console.assert(dict.search("pad") === false, "211: 'pad' was never added");
  console.assert(dict.search("bad") === true, "211: 'bad' was added");
  console.assert(dict.search(".ad") === true, "211: wildcard should match 'bad'/'dad'/'mad'");
  console.assert(dict.search("b..") === true, "211: wildcard should match 'bad' via 'b..'");
  console.assert(dict.search("b.d.") === false, "211: length must still match");

  console.assert(
    replaceWords(["cat", "bat", "rat"], "the cattle was rattled by the battery") ===
      "the cat was rat by the bat",
    "648: each word replaced by its shortest matching root"
  );
  console.assert(
    replaceWords(["a", "b", "c"], "aadsfasf absbs bbab cadsfafs") === "a a b c",
    "648: single-letter roots replace immediately"
  );

  console.log("07-trie checks passed");
}
