import React from 'react';
import { Trophy, Zap, Layers, Flame } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  level: number;
  lines: number;
  combo: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  highScore,
  level,
  lines,
  combo,
}) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 select-none w-full">
      {/* Score */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-1">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>SCORE</span>
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
          {score.toLocaleString()}
        </div>
      </div>

      {/* High Score */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-1">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>HIGH SCORE</span>
        </div>
        <div className="text-lg lg:text-xl font-bold text-amber-200/90 font-mono tabular-nums">
          {highScore.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
        {/* Level */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 mb-0.5">LEVEL</div>
          <div className="text-xl font-bold text-cyan-300 font-mono tabular-nums">
            {level}
          </div>
        </div>

        {/* Lines */}
        <div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mb-0.5">
            <Layers className="w-3 h-3 text-slate-400" />
            <span>LINES</span>
          </div>
          <div className="text-xl font-bold text-slate-200 font-mono tabular-nums">
            {lines}
          </div>
        </div>
      </div>

      {/* Combo indicator if active */}
      {combo > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-amber-400 text-xs font-semibold animate-pulse">
          <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{combo} COMBO</span>
        </div>
      )}
    </div>
  );
};
