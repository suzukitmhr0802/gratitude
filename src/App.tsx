/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Heart,
  Sparkles,
  BookOpen,
  RotateCcw,
  Lightbulb,
  ArrowRight,
  Volume2,
  VolumeX,
  AlertCircle,
} from 'lucide-react';
import { GratitudeEntry, GratitudeSession } from './types.ts';
import { getJapaneseCounter, detectBodyPart, BodyHint } from './utils.ts';
import { RobotAvatar } from './components/RobotAvatar.tsx';
import { ReflectionView } from './components/ReflectionView.tsx';
import { BodyHintsPanel } from './components/BodyHintsPanel.tsx';
import { HistoryModal } from './components/HistoryModal.tsx';

// Simple pleasant chime via Web Audio API
function playGentleChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gentle warm chime chord frequency: 528 Hz (Love/Healing frequency)
    osc.frequency.setValueAtTime(528, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(792, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.85);
  } catch {
    // Audio context might be restricted before user interaction
  }
}

export default function App() {
  const [entries, setEntries] = useState<GratitudeEntry[]>(() => {
    try {
      const saved = localStorage.getItem('body_gratitude_current_entries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inputText, setInputText] = useState('');
  const [isReflecting, setIsReflecting] = useState(false);
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [historySessions, setHistorySessions] = useState<GratitudeSession[]>(() => {
    try {
      const saved = localStorage.getItem('body_gratitude_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync entries to localStorage
  useEffect(() => {
    localStorage.setItem('body_gratitude_current_entries', JSON.stringify(entries));
  }, [entries]);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem('body_gratitude_history', JSON.stringify(historySessions));
  }, [historySessions]);

  // Handle VisualViewport API for mobile keyboards
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleResize = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      // Calculate remaining height when keyboard opens
      const offset = window.innerHeight - vv.height - vv.offsetTop;
      setKeyboardOffset(offset > 0 ? offset : 0);
    };

    const viewport = window.visualViewport;
    viewport.addEventListener('resize', handleResize);
    viewport.addEventListener('scroll', handleResize);

    return () => {
      viewport.removeEventListener('resize', handleResize);
      viewport.removeEventListener('scroll', handleResize);
    };
  }, []);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (!isReflecting) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [entries.length, isReflecting]);

  // Handle gratitude submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (soundEnabled) {
      playGentleChime();
    }

    const nextIndex = entries.length + 1;
    const newEntry: GratitudeEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      index: nextIndex,
      content: trimmed,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      bodyTag: detectBodyPart(trimmed),
    };

    setEntries((prev) => [...prev, newEntry]);
    setInputText('');

    // Keep focus
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Handle selecting an inspiration hint
  const handleSelectHint = (hint: BodyHint) => {
    setInputText(`${hint.part}が、${hint.example}`);
    inputRef.current?.focus();
  };

  // Handle ending session and saving to history
  const handleRestartSession = () => {
    if (entries.length > 0) {
      const newSession: GratitudeSession = {
        id: `session-${Date.now()}`,
        date: new Date().toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'short',
        }),
        entries: [...entries],
      };
      setHistorySessions((prev) => [newSession, ...prev]);
    }
    setEntries([]);
    setIsReflecting(false);
    setInputText('');
  };

  const handleClearHistory = () => {
    setHistorySessions([]);
    localStorage.removeItem('body_gratitude_history');
  };

  const currentCount = entries.length + 1;
  const currentCounterName = getJapaneseCounter(currentCount);

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#fcfbf9]/90 backdrop-blur-md border-b border-stone-200/70">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h1 className="font-bold text-base md:text-lg text-stone-900 leading-tight">
                からだへの感謝
              </h1>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                自分のからだの機能に注目し感謝をする対話アプリ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              type="button"
              id="btn-sound-toggle"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-9 h-9 rounded-lg border border-stone-200 bg-white text-stone-500 hover:text-stone-800 hover:bg-stone-50 flex items-center justify-center transition cursor-pointer"
              title={soundEnabled ? '効果音をミュート' : '効果音をオン'}
              aria-label={soundEnabled ? '効果音をミュート' : '効果音をオン'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>

            {/* History Button */}
            <button
              type="button"
              id="btn-open-history"
              onClick={() => setIsHistoryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 text-xs font-medium transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-500" />
              <span>履歴</span>
              {historySessions.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                  {historySessions.length}
                </span>
              )}
            </button>

            {/* Reset / New Work Button */}
            {entries.length > 0 && (
              <button
                type="button"
                id="btn-reset-current"
                onClick={handleRestartSession}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 text-xs transition cursor-pointer"
                title="最初からやり直す"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">リセット</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-5 md:py-6 flex flex-col">
        {/* Explanation Banner */}
        <section
          id="intro-explanation-banner"
          className="mb-6 rounded-2xl bg-amber-50/80 border border-amber-200 p-4 md:p-5 shadow-xs space-y-3 shrink-0"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-200/80 flex items-center justify-center text-amber-800 flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs md:text-sm font-bold tracking-wide text-amber-900">
                ワークの内容と重要ポイント
              </span>
            </div>

            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-600 text-white font-bold text-xs md:text-sm shadow-xs self-start sm:self-auto">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>必ず見た目でなく機能に注目！</span>
            </div>
          </div>

          <p className="text-stone-800 text-sm md:text-base leading-relaxed font-medium">
            自分のからだへの感謝をしてみましょう。例えば，鼻への感謝であれば，鼻の形といった見た目ではなく，鼻がにおいをちゃんとかぎわけてくれた，といったように，機能的な部分について注目してください。それではどうぞ。
          </p>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              id="btn-open-hints-banner"
              onClick={() => setIsHintsOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-100/90 hover:bg-amber-200/90 border border-amber-300 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>機能の感謝のヒントを見る</span>
            </button>
          </div>
        </section>

        {isReflecting ? (
          /* Reflection View */
          <ReflectionView
            entries={entries}
            onBackToInput={() => setIsReflecting(false)}
            onRestart={handleRestartSession}
          />
        ) : (
          /* Interactive Chat / Gratitude Flow */
          <div className="flex-1 flex flex-col justify-between">
            {/* Conversation Flow - 下部に十分なパディング（pb-36）を確保し隠れないように配置 */}
            <div className="space-y-4 md:space-y-5 pb-36" id="chat-conversation-thread">
              {/* Message 1: Initial Robot Message */}
              <div className="flex items-start gap-3" id="robot-message-initial">
                <RobotAvatar mood="neutral" size="md" />
                <div className="bg-white border border-stone-200/90 rounded-2xl rounded-tl-xs p-4 md:p-4.5 max-w-lg shadow-xs">
                  <div className="text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-1">
                    <span>感謝ナビゲーター</span>
                  </div>
                  <p className="text-stone-900 text-base md:text-lg font-medium leading-relaxed">
                    まずは一つ目をどうぞ。
                  </p>
                </div>
              </div>

              {/* Sequential user entries and robot prompts */}
              {entries.map((entry) => {
                const nextNum = entry.index + 1;
                const nextCounter = getJapaneseCounter(nextNum);

                return (
                  <React.Fragment key={entry.id}>
                    {/* User's response */}
                    <div className="flex justify-end" id={`user-bubble-${entry.index}`}>
                      <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-xs px-4 py-3 md:px-5 md:py-3.5 max-w-lg shadow-xs space-y-1">
                        <div className="flex items-center justify-between gap-3 text-emerald-100 text-xs">
                          <span className="font-semibold bg-emerald-700/60 px-2 py-0.5 rounded">
                            {getJapaneseCounter(entry.index)}
                          </span>
                          <span className="text-[11px] opacity-80">{entry.timestamp}</span>
                        </div>
                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                          {entry.content}
                        </p>
                        {entry.bodyTag && (
                          <div className="pt-1 text-[11px] text-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                            <span>{entry.bodyTag}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Robot response */}
                    <div className="flex items-start gap-3" id={`robot-response-${entry.index}`}>
                      <RobotAvatar mood="happy" size="md" />
                      <div className="bg-white border border-stone-200/90 rounded-2xl rounded-tl-xs p-4 md:p-4.5 max-w-lg shadow-xs">
                        <div className="text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-1">
                          <span>感謝ナビゲーター</span>
                        </div>
                        <p className="text-stone-900 text-sm md:text-base font-medium leading-relaxed">
                          素晴らしいですね。次に{nextCounter}をどうぞ。もしもこれ以上思いつかなかった場合は「振り返る」を押してください。
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

              <div ref={chatEndRef} />
            </div>

            {/* Input & Action Panel - 画面最下部に固定し、キーボードの高さ（keyboardOffset）分だけ動的に持ち上げる */}
            <div
              className="fixed bottom-0 left-0 right-0 z-40 bg-[#fcfbf9]/95 backdrop-blur-sm border-t border-stone-200/80 p-3 md:p-4 transition-transform duration-100 ease-out"
              style={{
                transform: keyboardOffset > 0 ? `translateY(-${keyboardOffset}px)` : 'none',
              }}
              id="gratitude-input-container"
            >
              <div className="max-w-3xl mx-auto space-y-2.5">
                {/* Status Bar / Hints trigger */}
                <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      {currentCounterName}を入力しよう
                    </span>
                    <span className="hidden sm:inline text-stone-400">
                      （現在 {entries.length} 個記録済）
                    </span>
                  </div>

                  <button
                    type="button"
                    id="btn-open-hints"
                    onClick={() => setIsHintsOpen(true)}
                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>機能の感謝のヒントを見る</span>
                  </button>
                </div>

                {/* Input Textarea Form */}
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <div className="relative">
                    <textarea
                      ref={inputRef}
                      id="gratitude-text-input"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        entries.length === 0
                          ? '例：鼻がにおいをちゃんとかぎわけてくれた、足が目的地まで運んでくれた…'
                          : `${currentCounterName}のからだの機能への感謝を入力してください…`
                      }
                      rows={2}
                      className="w-full resize-none rounded-xl border border-stone-300 p-3 text-sm md:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white transition shadow-xs"
                    />
                  </div>

                  {/* Buttons Row */}
                  <div className="flex items-center justify-between gap-2">
                    {/* Review Button (振り返る) */}
                    <button
                      type="button"
                      id="btn-reflect"
                      disabled={entries.length === 0}
                      onClick={() => setIsReflecting(true)}
                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                        entries.length > 0
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300/80 shadow-xs'
                          : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200/50'
                      }`}
                      title={entries.length === 0 ? 'まずは一つ目を入力してください' : 'これまでの感謝を振り返る'}
                    >
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>振り返る</span>
                      {entries.length > 0 && (
                        <span className="ml-0.5 text-xs bg-amber-200/80 px-1.5 py-0.5 rounded-full font-bold">
                          {entries.length}
                        </span>
                      )}
                    </button>

                    {/* Submit Button */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-stone-400 hidden sm:inline">
                        Ctrl+Enter でも送信可
                      </span>
                      <button
                        type="submit"
                        id="btn-submit-gratitude"
                        disabled={!inputText.trim()}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium shadow-xs transition cursor-pointer"
                      >
                        <span>送る</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Hints Modal */}
      <BodyHintsPanel
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
        onSelectHint={handleSelectHint}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={historySessions}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}