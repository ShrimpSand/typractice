import { Layout } from './index';

// Astarte配列
// neinvalliが作成した日英両方に最適化されたIT エンジニア向け配列
// 左手に母音を配置し、日本語ローマ字入力と英語入力のバランスを考慮
export const astarte: Layout = {
  name: 'Astarte配列',
  rows: [
    ['q', 'p', 'u', 'y', ',', 'j', 'd', 'h', 'g', 'w'],
    ['o', 'e', 'a', 'i', '.', 'c', 't', 'n', 's', 'r'],
    ['z', 'x', '-', 'v', '/', 'm', 'l', 'f', 'b', 'k'],
  ],
};
