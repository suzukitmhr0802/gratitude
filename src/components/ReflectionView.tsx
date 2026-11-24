import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Copy, PlusCircle, RotateCcw, Heart } from 'lucide-react';
import { GratitudeEntry } from '../types.ts';
import { RobotAvatar } from './RobotAvatar.tsx';
import { getJapaneseCounter } from '../utils.ts';

interface ReflectionViewProps {
  entries: GratitudeEntry[];
  onBackToInput: () => void;
  onRestart: () => void;
}

export function ReflectionView({ entries, onBackToInput, onRestart }: ReflectionViewProps) {
  const [copied, setCopied] = useState(false);
  const [showConfirmRestart, setShowConfirmRestart] = useState(false);

  const handleCopy = () => {
    const text = [
      '【からだへの感謝ワーク 記録】',
      `実施日時: ${new Date().toLocaleDateString('ja-JP')} ${new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`,
      '',
      ...entries.map(
        (e) => `・${getJapaneseCounter(e.index)}（${e.bodyTag || 'からだ'}）: ${e.content}`
      ),
      '',
      'いつも支えてくれてありがとう。',
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-2xl mx-auto space-y-6 pb-12"
      id="reflection-view"
    >
      {/* Robot Greeting in Reflection Mode */}
      <div
        id="reflection-robot-banner"
        className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-xs"
      >
        <RobotAvatar mood="happy" size="lg" />
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-medium">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>振り返りの時間</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-stone-800 tracking-tight">
            あなたのからだへの感謝リスト
          </h2>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed">
            素晴らしいですね！今日は <strong className="text-emerald-700 font-bold">{entries.length}個</strong> のからだの機能に感謝を届けることができました。目に見えないところでも、毎日あなたを支えてくれているからだに、心からありがとうを伝えましょう。
          </p>
        </div>
      </div>

      {/* List of Gratitudes */}
      <div className="space-y-3" id="gratitude-entries-list">
        {entries.map((entry, idx) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            id={`gratitude-item-${entry.index}`}
            className="bg-white border border-stone-200/80 rounded-xl p-4 md:p-5 shadow-xs hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  {entry.index}
                </span>
                <span className="font-semibold text-stone-700 text-sm">
                  {getJapaneseCounter(entry.index)}
                </span>
                {entry.bodyTag && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    {entry.bodyTag}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-stone-400">
                {entry.timestamp}
              </span>
            </div>
            <p className="text-stone-800 text-sm md:text-base leading-relaxed pl-8 whitespace-pre-wrap">
              {entry.content}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Action Controls */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          id="btn-copy-reflection"
          onClick={handleCopy}
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 active:bg-stone-100 text-sm font-medium transition shadow-xs cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-medium">コピーしました！</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-stone-500" />
              <span>感謝の記録をコピー</span>
            </>
          )}
        </button>

        <button
          type="button"
          id="btn-continue-writing"
          onClick={onBackToInput}
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-medium transition shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>感謝をさらに書く</span>
        </button>

        <button
          type="button"
          id="btn-restart-session"
          onClick={() => setShowConfirmRestart(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-medium transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-stone-500" />
          <span>新しく始める</span>
        </button>
      </div>

      {/* Confirmation Dialog for Restarting */}
      {showConfirmRestart && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200 space-y-4"
          >
            <h3 className="font-bold text-stone-800 text-base">新しいワークを始めますか？</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              現在の感謝リストは履歴に保存され、新しい最初の一つ目からワークを開始します。
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmRestart(false)}
                className="flex-1 py-2 px-3 border border-stone-300 rounded-xl text-stone-700 text-sm hover:bg-stone-50 cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmRestart(false);
                  onRestart();
                }}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium cursor-pointer"
              >
                新しく始める
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}