// ひらがな1文字に対する複数のローマ字入力パターン
const ROMAJI_TABLE: { [key: string]: string[] } = {
  あ: ['a'],
  い: ['i', 'yi'],
  う: ['u', 'wu', 'whu'],
  え: ['e'],
  お: ['o'],
  か: ['ka', 'ca'],
  き: ['ki'],
  く: ['ku', 'cu', 'qu'],
  け: ['ke'],
  こ: ['ko', 'co'],
  さ: ['sa'],
  し: ['si', 'shi', 'ci'],
  す: ['su'],
  せ: ['se', 'ce'],
  そ: ['so'],
  た: ['ta'],
  ち: ['ti', 'chi'],
  つ: ['tu', 'tsu'],
  て: ['te'],
  と: ['to'],
  な: ['na'],
  に: ['ni'],
  ぬ: ['nu'],
  ね: ['ne'],
  の: ['no'],
  は: ['ha'],
  ひ: ['hi'],
  ふ: ['hu', 'fu'],
  へ: ['he'],
  ほ: ['ho'],
  ま: ['ma'],
  み: ['mi'],
  む: ['mu'],
  め: ['me'],
  も: ['mo'],
  や: ['ya'],
  ゆ: ['yu'],
  よ: ['yo'],
  ら: ['ra'],
  り: ['ri'],
  る: ['ru'],
  れ: ['re'],
  ろ: ['ro'],
  わ: ['wa'],
  を: ['wo'],
  ん: ['nn', 'xn'],
  が: ['ga'],
  ぎ: ['gi'],
  ぐ: ['gu'],
  げ: ['ge'],
  ご: ['go'],
  ざ: ['za'],
  じ: ['zi', 'ji'],
  ず: ['zu'],
  ぜ: ['ze'],
  ぞ: ['zo'],
  だ: ['da'],
  ぢ: ['di'],
  づ: ['du'],
  で: ['de'],
  ど: ['do'],
  ば: ['ba'],
  び: ['bi'],
  ぶ: ['bu'],
  べ: ['be'],
  ぼ: ['bo'],
  ぱ: ['pa'],
  ぴ: ['pi'],
  ぷ: ['pu'],
  ぺ: ['pe'],
  ぽ: ['po'],
  きゃ: ['kya'],
  きゅ: ['kyu'],
  きょ: ['kyo'],
  しゃ: ['sya', 'sha'],
  しゅ: ['syu', 'shu'],
  しょ: ['syo', 'sho'],
  ちゃ: ['tya', 'cha', 'cya'],
  ちゅ: ['tyu', 'chu', 'cyu'],
  ちょ: ['tyo', 'cho', 'cyo'],
  にゃ: ['nya'],
  にゅ: ['nyu'],
  にょ: ['nyo'],
  ひゃ: ['hya'],
  ひゅ: ['hyu'],
  ひょ: ['hyo'],
  みゃ: ['mya'],
  みゅ: ['myu'],
  みょ: ['myo'],
  りゃ: ['rya'],
  りゅ: ['ryu'],
  りょ: ['ryo'],
  ぎゃ: ['gya'],
  ぎゅ: ['gyu'],
  ぎょ: ['gyo'],
  じゃ: ['zya', 'ja', 'jya'],
  じゅ: ['zyu', 'ju', 'jyu'],
  じょ: ['zyo', 'jo', 'jyo'],
  びゃ: ['bya'],
  びゅ: ['byu'],
  びょ: ['byo'],
  ぴゃ: ['pya'],
  ぴゅ: ['pyu'],
  ぴょ: ['pyo'],
  ふぁ: ['fa', 'huxa', 'fwa'],
  ふぃ: ['fi', 'huxi', 'fwi', 'fyi'],
  ふぇ: ['fe', 'huxe', 'fwe', 'fye'],
  ふぉ: ['fo', 'huxo', 'fwo'],
  っ: ['ltu', 'xtu', 'ltsu'],
  ー: ['-'],
  '、': [','],
  '。': ['.'],
  '？': ['?'],
  '！': ['!'],
  ' ': [' '],
  '　': [' '],
};

// ひらがなノード（入力候補のツリー構造）
export interface RomajiNode {
  kana: string; // ひらがな
  patterns: string[][]; // 各パターンの文字配列
  currentIndex: number[]; // 各パターンの現在の入力位置
  completed: boolean; // 完了フラグ
}

// テキストをローマ字ノードの配列に変換
export const textToRomajiNodes = (text: string): RomajiNode[] => {
  const nodes: RomajiNode[] = [];
  let i = 0;

  while (i < text.length) {
    // 2文字の組み合わせをチェック（拗音など）
    if (i + 1 < text.length) {
      const twoChar = text.substring(i, i + 2);
      if (ROMAJI_TABLE[twoChar]) {
        nodes.push({
          kana: twoChar,
          patterns: ROMAJI_TABLE[twoChar].map((p) => p.split('')),
          currentIndex: new Array(ROMAJI_TABLE[twoChar].length).fill(0),
          completed: false,
        });
        i += 2;
        continue;
      }
    }

    // 1文字
    const oneChar = text[i];
    if (ROMAJI_TABLE[oneChar]) {
      nodes.push({
        kana: oneChar,
        patterns: ROMAJI_TABLE[oneChar].map((p) => p.split('')),
        currentIndex: new Array(ROMAJI_TABLE[oneChar].length).fill(0),
        completed: false,
      });
    } else if (/[a-zA-Z0-9]/.test(oneChar)) {
      // 英数字はそのまま
      const char = oneChar.toLowerCase();
      nodes.push({
        kana: char,
        patterns: [[char]],
        currentIndex: [0],
        completed: false,
      });
    } else if (/[\u4e00-\u9faf]/.test(oneChar)) {
      // 漢字は?
      nodes.push({
        kana: '?',
        patterns: [['?']],
        currentIndex: [0],
        completed: false,
      });
    } else {
      // その他の記号
      nodes.push({
        kana: oneChar,
        patterns: [[oneChar]],
        currentIndex: [0],
        completed: false,
      });
    }
    i++;
  }

  // 促音（っ）の処理：次の子音を重ねる
  for (let j = 0; j < nodes.length - 1; j++) {
    if (nodes[j].kana === 'っ') {
      const nextNode = nodes[j + 1];
      if (nextNode && nextNode.patterns.length > 0) {
        const firstConsonant = nextNode.patterns[0][0];
        // 次の文字の最初の子音を取得
        if (firstConsonant && /[a-z]/.test(firstConsonant)) {
          // 促音のパターンに次の子音を追加
          nodes[j].patterns = [[firstConsonant], ...nodes[j].patterns];
          nodes[j].currentIndex = new Array(nodes[j].patterns.length).fill(0);
        }
      }
    }
  }

  // 「ん」の特殊処理：次の文字が母音・y・nでない場合のみ1文字の「n」を許可
  for (let j = 0; j < nodes.length; j++) {
    if (nodes[j].kana === 'ん') {
      const nextNode = nodes[j + 1];

      // 次のノードが存在し、その最初の文字が母音・y・nでない場合
      if (nextNode && nextNode.patterns.length > 0) {
        const nextFirstChar = nextNode.patterns[0][0];
        const canUseSingleN = !['a', 'i', 'u', 'e', 'o', 'y', 'n'].includes(nextFirstChar);

        if (canUseSingleN) {
          // 1文字の「n」を追加
          nodes[j].patterns = [['n'], ...nodes[j].patterns];
          nodes[j].currentIndex = new Array(nodes[j].patterns.length).fill(0);
        }
      } else if (!nextNode) {
        // 文末の「ん」は「n」でもOK
        nodes[j].patterns = [['n'], ...nodes[j].patterns];
        nodes[j].currentIndex = new Array(nodes[j].patterns.length).fill(0);
      }
    }
  }

  return nodes;
};

// 入力が正しいかチェックし、ノードを更新
export const processInput = (
  nodes: RomajiNode[],
  currentNodeIndex: number,
  input: string
): { success: boolean; nodeCompleted: boolean; newNodes: RomajiNode[] } => {
  if (currentNodeIndex >= nodes.length) {
    return { success: false, nodeCompleted: false, newNodes: nodes };
  }

  const newNodes = [...nodes];
  const node = { ...newNodes[currentNodeIndex] };
  let matchedPatternIndex = -1;

  // 各パターンをチェック
  for (let i = 0; i < node.patterns.length; i++) {
    const pattern = node.patterns[i];
    const currentPos = node.currentIndex[i];

    if (currentPos < pattern.length && pattern[currentPos] === input) {
      matchedPatternIndex = i;
      break;
    }
  }

  if (matchedPatternIndex === -1) {
    return { success: false, nodeCompleted: false, newNodes: nodes };
  }

  // マッチしたパターンを進める
  node.currentIndex[matchedPatternIndex]++;

  // パターンが完了したかチェック
  const patternCompleted = node.currentIndex[matchedPatternIndex] === node.patterns[matchedPatternIndex].length;

  if (patternCompleted) {
    node.completed = true;
  }

  newNodes[currentNodeIndex] = node;

  return {
    success: true,
    nodeCompleted: patternCompleted,
    newNodes,
  };
};

// 次に入力可能なキーの一覧を取得
export const getNextKeys = (nodes: RomajiNode[], currentNodeIndex: number): string[] => {
  if (currentNodeIndex >= nodes.length) {
    return [];
  }

  const node = nodes[currentNodeIndex];
  const nextKeys = new Set<string>();

  for (let i = 0; i < node.patterns.length; i++) {
    const pattern = node.patterns[i];
    const currentPos = node.currentIndex[i];

    if (currentPos < pattern.length) {
      nextKeys.add(pattern[currentPos]);
    }
  }

  return Array.from(nextKeys);
};

// 表示用のローマ字文字列を生成（最短パターンを使用）
export const getRomajiDisplay = (nodes: RomajiNode[]): string => {
  return nodes
    .map((node) => {
      // 最短パターンを選択
      const shortestPattern = node.patterns.reduce((shortest, current) => (current.length < shortest.length ? current : shortest));
      return shortestPattern.join('');
    })
    .join('');
};

// 後方互換性のため
export const textToRomaji = (text: string): string => {
  const nodes = textToRomajiNodes(text);
  return getRomajiDisplay(nodes);
};
