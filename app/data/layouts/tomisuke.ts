import { Layout } from './index';

// Tomisuke配列
// とみすけ氏が作成した日本語向け配列
// 左手ホームポジションに母音、右手に子音を配置し、連続打鍵を削減
export const tomisuke: Layout = {
  name: 'Tomisuke配列',
  rows: [
    ['=', ',', '.', '-', ';', 'l', 'r', 'd', 'y', 'p'],
    ['a', 'o', 'e', 'i', 'u', 'g', 'n', 't', 's', 'k'],
    ['q', 'x', 'c', 'w', 'v', 'h', 'm', 'f', 'b', 'z'],
  ],
};
