import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Trash2, Heart, Award } from 'lucide-react';
import { GratitudeSession } from '../types.ts';
import { getJapaneseCounter } from '../utils.ts';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: GratitudeSession[];
  onClearHistory: () => void;
}

export function HistoryModal({ isOpen, onClose, sessions, onClearHistory }: HistoryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
          >
            <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 text-base">過去の感謝ワーク履歴</h3>
                  <p className="text-xs text-stone-500">これまでからだに届けた感謝の記録</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200/60 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {sessions.length === 0 ? (
                <div className="text-center py-12 text-stone-400 space-y-2">
                  <Heart className="w-8 h-8 mx-auto text-stone-300 stroke-1" />
                  <p className="text-sm">まだ保存された過去のワークはありません。</p>
                  <p className="text-xs text-stone-400">「振り返る」を終えて新しく始めるとここに保存されます。</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-stone-500 pb-1 border-b border-stone-200/60">
                      <span className="font-medium text-stone-700">{session.date}</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        {session.entries.length}個の感謝
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-stone-700">
                      {session.entries.map((entry) => (
                        <li key={entry.id} className="flex gap-2">
                          <span className="text-emerald-600 font-medium whitespace-nowrap">
                            {getJapaneseCounter(entry.index)}:
                          </span>
                          <span className="text-stone-800">{entry.content}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>

            {sessions.length > 0 && (
              <div className="p-3 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>履歴をクリア</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 text-xs font-medium bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg transition cursor-pointer"
                >
                  閉じる
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
