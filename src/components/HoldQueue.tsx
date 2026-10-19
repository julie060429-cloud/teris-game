import React from 'react';
import { TetrominoType } from '../types/tetris';
import { PiecePreview } from './PiecePreview';

interface HoldQueueProps {
  piece: TetrominoType | null;
  canHold: boolean;
  onHoldClick?: () => void;
}

export const HoldQueue: React.FC<HoldQueueProps> = ({ piece, canHold, onHoldClick }) => {
  return (
    <div
      onClick={canHold ? onHoldClick : undefined}
      className={`bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col items-center select-none transition-all ${
        onHoldClick && canHold ? 'cursor-pointer hover:border-slate-700 active:scale-98' : ''
      }`}
    >
      <div className="flex items-center justify-between w-full mb-3 text-xs font-semibold text-slate-400">
        <span>HOLD</span>
        <span className="text-[10px] text-slate-500 font-mono tracking-tighter">C / SHIFT</span>
      </div>

      <div className="w-24 h-20 flex items-center justify-center bg-slate-950/60 rounded-lg border border-slate-800/80">
        <PiecePreview type={piece} size={18} dimmed={!canHold && piece !== null} />
      </div>

      {!canHold && piece && (
        <span className="text-[10px] text-slate-500 mt-2 font-mono">LOCKED</span>
      )}
    </div>
  );
};
