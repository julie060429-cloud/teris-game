import React from 'react';
import { Trophy, RotateCcw, Clock, Layers, Award } from 'lucide-react';
import { GameStats } from '../types/tetris';

interface GameOverModalProps {
  score: number;
  highScore: number;
  level: number;
  lines: number;
  stats: GameStats;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  level,
  lines,
  stats,
  onPlayAgain,
}) => {
  const isNewHighScore = score > 0 && score >= highScore;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-xs font-semibold text-rose-400 tracking-wider uppercase mb-1">
            GAME OVER
          </div>
          <h2 className="text-3xl font-extrabold text-white">게임 종료</h2>
        </div>

        {/* High score callout if achieved */}
        {isNewHighScore && (
          <div className="mb-4 p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl flex items-center gap-3 text-amber-300">
            <Trophy className="w-5 h-5 shrink-0 text-amber-400" />
            <div className="text-xs font-semibold">
              축하합니다! 새로운 최고 기록을 달성했습니다!
            </div>
          </div>
        )}

        {/* Primary Score Board */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 mb-5">
          <div className="text-xs font-medium text-slate-400 mb-1">최종 점수</div>
          <div className="text-4xl font-extrabold text-white font-mono tabular-nums tracking-tight mb-3">
            {score.toLocaleString()}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center">
            <div>
              <div className="text-[11px] text-slate-500">최고 점수</div>
              <div className="text-sm font-bold text-amber-300 font-mono tabular-nums">
                {highScore.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500">도달 레벨</div>
              <div className="text-sm font-bold text-cyan-300 font-mono tabular-nums">
                {level}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500">클리어 라인</div>
              <div className="text-sm font-bold text-slate-200 font-mono tabular-nums">
                {lines}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="space-y-2 mb-6 text-xs text-slate-300 bg-slate-950/40 rounded-xl p-3 border border-slate-800/60">
          <div className="flex justify-between py-1 border-b border-slate-800/40">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" /> 플레이 시간
            </span>
            <span className="font-mono tabular-nums font-semibold">
              {formatTime(stats.durationSeconds)}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/40">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Award className="w-3.5 h-3.5" /> 최대 콤보
            </span>
            <span className="font-mono tabular-nums font-semibold">
              {stats.maxCombo > 0 ? `${stats.maxCombo} Combo` : '—'}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/40">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> 테트리스 (4줄 클리어)
            </span>
            <span className="font-mono tabular-nums font-bold text-cyan-400">
              {stats.tetrises}회
            </span>
          </div>

          <div className="flex justify-between py-1 text-slate-400">
            <span>라인 제거 세부 (1줄 / 2줄 / 3줄)</span>
            <span className="font-mono tabular-nums">
              {stats.singles} / {stats.doubles} / {stats.triples}
            </span>
          </div>
        </div>

        {/* Action Button: Single line Play Again */}
        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 active:scale-98 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>다시 시작</span>
        </button>
      </div>
    </div>
  );
};
