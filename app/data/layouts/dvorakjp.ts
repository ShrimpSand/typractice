import { Layout } from './index';

// DvorakJP配列
// Dvorak配列を日本語ローマ字入力に最適化した配列
// 物理配列はDvorakと同じだが、拗音拡張などの入力ルールが追加される
// 「か」行に「c」キーを使える、「kya」→「kha」などの拡張がある
export const dvorakjp: Layout = {
  name: 'DvorakJP配列',
  rows: [
    ["'", ',', '.', 'p', 'y', 'f', 'g', 'c', 'r', 'l'],
    ['a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's'],
    [';', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z'],
  ],
};
