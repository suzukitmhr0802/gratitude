import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Plus } from 'lucide-react';
import { BODY_HINTS, BodyHint } from '../utils.ts';

interface BodyHintsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHint: (hint: BodyHint) => void;
}

export function BodyHintsPanel({ isOpen, onClose, onSelectHint }: BodyHintsPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
            id="body-hints-modal"
          >
            {/* Header */}
            <div className="p-4 md:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-800">からだの機能ヒント</h3>
                  <p className="text-xs text-stone-500">見た目ではなく「機能や働き」に注目するヒント集</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200/60 flex items-center justify-center transition cursor-pointer"
                aria-label="閉じる"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="p-4 md:p-5 overflow-y-auto space-y-3">
              <p className="text-xs text-stone-500 leading-relaxed bg-amber-50 border border-amber-200/60 p-3 rounded-xl">
                💡 「鼻がにおいをちゃんとかぎわけてくれた」「足が目的地まで運んでくれた」など、日頃当たり前に思える機能に目を向けてみましょう。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {BODY_HINTS.map((item) => (
                  <button
                    key={item.part}
                    type="button"
                    onClick={() => {
                      onSelectHint(item);
                      onClose();
                    }}
                    className="text-left p-3 rounded-xl border border-stone-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/40 transition group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-stone-800 group-hover:text-emerald-800">
                          {item.part}
                        </span>
                        <span className="text-[11px] text-emerald-600 group-hover:text-emerald-700 font-medium">
                          {item.functionText}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 line-clamp-2">
                        例: {item.example}
                      </p>
                    </div>
                    <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <Plus className="w-3 h-3" />
                      <span>これを参考に書く</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-stone-100 bg-stone-50 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-200/60 rounded-lg transition cursor-pointer"
              >
                閉じる
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
