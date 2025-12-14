'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LAYOUTS } from '../data/layouts/allLayouts';
import { TEXT_CATEGORIES } from '../data/texts/allTexts';
import { TextWithReading } from '../data/texts/index';
import {
  textToRomajiNodes,
  processInput,
  getRomajiDisplay,
  RomajiNode,
} from '../utils/romaji';
import { createKeyMap } from '../utils/keyMapping';
import { selectRandomTexts } from '../utils/textSelector';

export default function TypingPractice() {
  const [physicalLayout, setPhysicalLayout] = useState('qwerty');
  const [targetLayout, setTargetLayout] = useState('ohnishi');
  const [selectedCategory, setSelectedCategory] = useState('daily');
  const [practiceTexts, setPracticeTexts] = useState<TextWithReading[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [romajiNodes, setRomajiNodes] = useState<RomajiNode[]>([]);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  // カテゴリ変更時にランダムテキストを生成
  useEffect(() => {
    const categoryTexts = TEXT_CATEGORIES[selectedCategory].texts;
    const randomTexts = selectRandomTexts(categoryTexts, 15);
    setPracticeTexts(randomTexts);
    setCurrentTextIndex(0);
    resetPractice();
  }, [selectedCategory]);

  // テキスト変更時にローマ字ノードを生成
  useEffect(() => {
    if (practiceTexts.length > 0 && currentTextIndex < practiceTexts.length) {
      const currentText = practiceTexts[currentTextIndex];
      const nodes = textToRomajiNodes(currentText.reading);
      setRomajiNodes(nodes);
      setCurrentNodeIndex(0);
    }
  }, [practiceTexts, currentTextIndex]);

  const currentText = practiceTexts[currentTextIndex] || { display: '', reading: '' };
  const keyMap = useMemo(
    () => createKeyMap(LAYOUTS, physicalLayout, targetLayout),
    [physicalLayout, targetLayout]
  );
  const reverseKeyMap = useMemo(
    () => createKeyMap(LAYOUTS, targetLayout, physicalLayout),
    [physicalLayout, targetLayout]
  );

  // 表示用のローマ字文字列
  const displayRomaji = useMemo(() => {
    return getRomajiDisplay(romajiNodes);
  }, [romajiNodes]);

  // 完了済みの文字数を計算
  const completedLength = useMemo(() => {
    let count = 0;
    for (let i = 0; i < currentNodeIndex; i++) {
      if (romajiNodes[i]) {
        const shortestPattern = romajiNodes[i].patterns.reduce((shortest, current) =>
          current.length < shortest.length ? current : shortest
        );
        count += shortestPattern.length;
      }
    }
    if (currentNodeIndex < romajiNodes.length && romajiNodes[currentNodeIndex]) {
      const node = romajiNodes[currentNodeIndex];
      for (let i = 0; i < node.patterns.length; i++) {
        if (node.currentIndex[i] > 0) {
          count += node.currentIndex[i];
          break;
        }
      }
    }
    return count;
  }, [romajiNodes, currentNodeIndex]);

  // 次に入力可能なキー（練習配列上）
  // 表示されているローマ字の次の文字のみを使用
  const nextTargetKey = useMemo(() => {
    if (completedLength < displayRomaji.length) {
      return displayRomaji[completedLength];
    }
    return '';
  }, [displayRomaji, completedLength]);

  // 次に押すべきキー（物理キーボード上）
  const nextPhysicalKey = useMemo(() => {
    return reverseKeyMap[nextTargetKey] || nextTargetKey;
  }, [nextTargetKey, reverseKeyMap]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isComplete) return;
      if (e.key === 'Escape') {
        resetAll();
        return;
      }
      if (e.key.length !== 1) return;

      const pressedKey = e.key.toLowerCase();

      // 物理キーを論理キーに変換
      const logicalKey = keyMap[pressedKey] || pressedKey;

      if (!startTime) {
        setStartTime(Date.now());
      }

      setTotalKeystrokes((prev) => prev + 1);

      // 入力処理
      const result = processInput(romajiNodes, currentNodeIndex, logicalKey);

      if (result.success) {
        setRomajiNodes(result.newNodes);

        if (result.nodeCompleted) {
          // ノード完了、次のノードへ
          const nextIndex = currentNodeIndex + 1;
          setCurrentNodeIndex(nextIndex);

          // 全ノード完了チェック
          if (nextIndex >= romajiNodes.length) {
            setIsComplete(true);
            setCompletedCount((prev) => prev + 1);

            // 0.3秒後に次の文章へ自動遷移
            setTimeout(() => {
              if (currentTextIndex < practiceTexts.length - 1) {
                setCurrentTextIndex((prev) => prev + 1);
                resetPractice();
              } else {
                // 全問完了
                setIsComplete(true);
              }
            }, 300);
          }
        }
      } else {
        setErrors((prev) => prev + 1);
      }
    },
    [
      romajiNodes,
      currentNodeIndex,
      startTime,
      isComplete,
      keyMap,
      currentTextIndex,
      practiceTexts.length,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const resetPractice = () => {
    setStartTime(null);
    setErrors(0);
    setTotalKeystrokes(0);
    setIsComplete(false);
    setCurrentNodeIndex(0);
    if (practiceTexts.length > 0 && currentTextIndex < practiceTexts.length) {
      const currentText = practiceTexts[currentTextIndex];
      const nodes = textToRomajiNodes(currentText.reading);
      setRomajiNodes(nodes);
    }
  };

  const resetAll = () => {
    setCompletedCount(0);
    setCurrentTextIndex(0);
    resetPractice();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLayoutChange = (type: 'physical' | 'target', value: string) => {
    if (type === 'physical') {
      setPhysicalLayout(value);
    } else {
      setTargetLayout(value);
    }
    resetPractice();
  };

  const getKeyStyle = (key: string, rowIndex: number, keyIndex: number) => {
    const isNextKey = key === nextTargetKey;
    const baseStyle =
      'w-10 h-10 m-0.5 rounded flex items-center justify-center text-sm font-mono transition-all font-semibold';

    if (isNextKey) {
      return `${baseStyle} bg-blue-500 text-white scale-110 shadow-lg`;
    }

    // ホームポジション（中段の4番目と5番目のキー）
    if (rowIndex === 1 && (keyIndex === 4 || keyIndex === 5)) {
      return `${baseStyle} bg-gray-200 text-gray-900`;
    }

    // ホームポジションの他のキー
    if (rowIndex === 1) {
      return `${baseStyle} bg-gray-200 border-2 border-gray-400 text-gray-900`;
    }

    return `${baseStyle} bg-gray-100 border border-gray-300 text-gray-900`;
  };

  // 全問完了の判定
  const isAllComplete = completedCount === practiceTexts.length && practiceTexts.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          カスタム配列タイピング練習
        </h1>

        {/* 配列選択とカテゴリ選択 */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-6 justify-center items-end flex-wrap">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                物理キーボード配列
              </label>
              <select
                value={physicalLayout}
                onChange={(e) => handleLayoutChange('physical', e.target.value)}
                className="border-2 border-gray-300 rounded px-3 py-2 w-40 text-gray-900 font-medium"
              >
                {Object.entries(LAYOUTS).map(([key, layout]) => (
                  <option key={key} value={key}>
                    {layout.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <span className="text-2xl text-gray-700">→</span>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                練習したい配列
              </label>
              <select
                value={targetLayout}
                onChange={(e) => handleLayoutChange('target', e.target.value)}
                className="border-2 border-gray-300 rounded px-3 py-2 w-40 text-gray-900 font-medium"
              >
                {Object.entries(LAYOUTS).map(([key, layout]) => (
                  <option key={key} value={key}>
                    {layout.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <span className="text-2xl text-gray-400">|</span>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                練習文カテゴリ
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="border-2 border-gray-300 rounded px-3 py-2 w-40 text-gray-900 font-medium"
              >
                {Object.entries(TEXT_CATEGORIES).map(([key, category]) => (
                  <option key={key} value={key}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 進捗表示 */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-gray-900">
              問題 {completedCount + 1} / {practiceTexts.length}
            </div>
            <div className="text-base text-gray-700 font-medium">
              カテゴリ: {TEXT_CATEGORIES[selectedCategory].name}
            </div>
          </div>
        </div>

        {isAllComplete ? (
          // 全問完了画面
          <div className="bg-white rounded-lg shadow p-8 mb-6 text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4">おめでとうございます！</h2>
            <p className="text-xl text-gray-800 mb-6">全ての問題を完了しました！</p>
            <button
              onClick={resetAll}
              className="px-8 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              もう一度練習する
            </button>
          </div>
        ) : (
          <>
            {/* 練習テキスト表示 */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="text-xl mb-3 text-gray-900 font-medium">{currentText.display}</div>
              <div className="text-base mb-4 text-gray-600">({currentText.reading})</div>

              <div className="font-mono text-xl bg-gray-100 p-4 rounded mb-4 min-h-16 break-all">
                <span className="text-green-600 font-semibold">
                  {displayRomaji.slice(0, completedLength)}
                </span>
                <span className="bg-yellow-300 px-1 text-gray-900 font-bold">
                  {displayRomaji[completedLength] || ''}
                </span>
                <span className="text-gray-700">{displayRomaji.slice(completedLength + 1)}</span>
              </div>

              {/* 統計 */}
              <div className="flex gap-6 text-base text-gray-800 font-medium">
                <div>
                  進捗: {completedLength}/{displayRomaji.length}
                </div>
                <div>エラー: {errors}</div>
                {isComplete && <div className="text-green-600 font-bold">完了！次へ...</div>}
              </div>
            </div>

            {/* キーボード表示（練習配列） */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="text-base text-gray-700 mb-3 text-center font-medium">
                {LAYOUTS[targetLayout].name} 配列（青いキーを押してください）
              </div>
              <div className="flex flex-col items-center gap-1">
                {LAYOUTS[targetLayout].rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex" style={{ marginLeft: rowIndex * 16 }}>
                    {row.map((key, keyIndex) => (
                      <div key={keyIndex} className={getKeyStyle(key, rowIndex, keyIndex)}>
                        {key.toUpperCase()}
                      </div>
                    ))}
                  </div>
                ))}
                <div className="flex mt-1">
                  <div className="w-64 h-10 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-sm text-gray-600 font-medium">
                    Space
                  </div>
                </div>
              </div>

              {nextPhysicalKey && nextPhysicalKey !== nextTargetKey && (
                <div className="text-center mt-4 text-base text-gray-700 font-medium">
                  物理キーボードでは「
                  <span className="font-bold text-blue-600 text-lg">
                    {nextPhysicalKey.toUpperCase()}
                  </span>
                  」を押してください
                </div>
              )}
            </div>

            {/* 操作ボタン */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetAll}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition font-medium"
              >
                リセット (Esc)
              </button>
            </div>
          </>
        )}

        {/* 説明 */}
        <div className="mt-8 text-sm text-gray-700 text-center">
          <p className="mb-1">物理キーボードで打った文字が、練習配列の文字として入力されます。</p>
          <p>例：物理QWERTY → 練習大西配列の場合、Qキーを押すとLが入力されます。</p>
        </div>
      </div>
    </div>
  );
}
