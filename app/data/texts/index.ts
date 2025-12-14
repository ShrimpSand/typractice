// 練習テキストの型定義
export interface TextWithReading {
  display: string;
  reading: string;
}

export interface TextCategory {
  name: string;
  texts: TextWithReading[];
}

export type TextCategories = {
  [key: string]: TextCategory;
};
