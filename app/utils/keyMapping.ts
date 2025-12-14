import { Layouts } from '../data/layouts/index';

// 物理キーから論理キーへのマッピングを生成
export const createKeyMap = (
  layouts: Layouts,
  physicalLayout: string,
  targetLayout: string
): { [key: string]: string } => {
  const map: { [key: string]: string } = {};
  const physicalRows = layouts[physicalLayout].rows;
  const targetRows = layouts[targetLayout].rows;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 10; col++) {
      const physicalKey = physicalRows[row][col];
      const targetKey = targetRows[row][col];
      map[physicalKey] = targetKey;
    }
  }
  return map;
};
