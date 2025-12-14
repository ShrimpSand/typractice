import { Layout } from './index';

// Eucalyn配列
// ゆかり氏が開発した配列
// QWERTYのショートカットキー（ZXCVQWP）を維持しつつ、
// 日本語ローマ字入力を最適化。Vimユーザー向けにHJKLキーも考慮
export const eucalyn: Layout = {
  name: 'Eucalyn配列',
  rows: [
    ['q', 'w', ',', '.', ';', 'm', 'r', 'd', 'y', 'p'],
    ['a', 'o', 'e', 'i', 'u', 'g', 't', 'k', 's', 'n'],
    ['z', 'x', 'c', 'v', 'f', 'b', 'h', 'j', 'l', '/'],
  ],
};
