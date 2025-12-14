import { Layout } from './index';

// SKY配列（Simplified Keyboard for You）
// 1987年に白鳥嘉勇、小橋史彦らによって発表されたローマ字入力用配列
// 左手が子音、右手が母音を担当し、左右交互打鍵を実現
// 注: 実際のSKY配列は拡張キー（二重母音など）を含むため、これは基本配列のみ
export const sky: Layout = {
  name: 'SKY配列',
  rows: [
    ['w', 'r', 'm', 'h', 'f', 'q', 'u', 'a', 'o', '.'],
    ['n', 't', 's', 'k', 'y', 'v', 'u', 'a', 'o', 'i'],
    ['p', 'd', 'z', 'g', 'b', 'x', 'e', 'i', 'e', 'i'],
  ],
};
