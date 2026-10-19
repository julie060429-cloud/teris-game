import React from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface PauseModalProps {
  score: number;
  level: number;
  lines: number;
  onResume: () => void;
  onRestart: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  score,
  level,
  lines,
  onResume,
  onRestart,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center">
        <h2 className="text-2xl font-bold text-white mb-2">일시정지</h2>
        <p className="text-xs text-slate-400 mb-6">게임이 일시정지 되었습니다.</p>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 mb-6 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[10px] text-slate-500 font-semibold">점수</div>
            <div className="text-sm font-bold text-white font-mono tabular-nums">
              {score.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold">레벨</div>
            <div className="text-sm font-bold text-cyan-300 font-mono tabular-nums">
              {level}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold">라인</div>
            <div className="text-sm font-bold text-slate-200 font-mono tabular-nums">
              {lines}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-98 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>계속하기 (P / Esc)</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>게임 처음부터 다시 시작</span>
          </button>
        </div>
      </div>
    </div>
  );
};
