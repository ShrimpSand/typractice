import { TextCategories } from './index';
import { dailyTexts } from './daily';
import { foodTexts } from './food';
import { natureTexts } from './nature';
import { workTexts } from './work';

export const TEXT_CATEGORIES: TextCategories = {
  daily: {
    name: '日常会話',
    texts: dailyTexts,
  },
  food: {
    name: '食事・料理',
    texts: foodTexts,
  },
  nature: {
    name: '自然・季節',
    texts: natureTexts,
  },
  work: {
    name: 'ビジネス',
    texts: workTexts,
  },
};
