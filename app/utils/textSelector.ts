import { TextWithReading } from '../data/texts/index';

// Fisher-Yatesアルゴリズムで配列をシャッフル
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// カテゴリからランダムに15個のテキストを選択
export function selectRandomTexts(
  texts: TextWithReading[],
  count: number = 15
): TextWithReading[] {
  const shuffled = shuffleArray(texts);
  return shuffled.slice(0, Math.min(count, texts.length));
}
