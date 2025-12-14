// キーボード配列の型定義
export interface Layout {
  name: string;
  rows: string[][];
}

export type Layouts = {
  [key: string]: Layout;
};
