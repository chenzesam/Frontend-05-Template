// 代表该字符节点是否是一个单词的最后一个字符。
const $ = Symbol();

class Trie {
  constructor() {
    this.root = Object.create(null);
  }

  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node[char]) {
        node[char] = Object.create(null);
      }
      node = node[char];
    }
    // 如果该字符节点没有 $，代表第一次生成该单词。
    if (!node[$]) node[$] = 0;
    // 用于后面判断哪个单词出现最多次。
    node[$]++;
  }

  most() {
    let max = 0;
    let maxWord = '';
    const findLongest = (node, word) => {
      if (node[$] && node[$] > max) {
        max = node[$];
        maxWord = word;
      }
      for (const char in node) {
        findLongest(node[char], word + char);
      }
    }
    findLongest(this.root, "");
    return { max, maxWord };
  }
}

const t = new Trie();

const randomWord = (len) => {
  let word = '';
  for (let i = 0; i < len; i++) {
    word += String.fromCharCode(Math.random() * 26 + "a".charCodeAt(0));
  }
  return word;
}

for (let i = 0; i < 100000; i++) {
  t.insert(randomWord(4));
}