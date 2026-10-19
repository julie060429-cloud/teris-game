import React from 'react';
import { TetrominoType } from '../types/tetris';
import { PiecePreview } from './PiecePreview';

interface NextQueueProps {
  queue: TetrominoType[];
}

export const NextQueue: React.FC<NextQueueProps> = ({ queue }) => {
  const displayPieces = queue.slice(0, 4);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col items-center select-none w-full">
      <div className="flex items-center justify-between w-full mb-3 text-xs font-semibold text-slate-400">
        <span>NEXT</span>
        <span className="text-[10px] text-slate-500 font-mono tracking-tighter">QUEUE</span>
      </div>

      <div className="flex flex-col gap-2.5 w-full items-center">
        {displayPieces.map((type, idx) => (
          <div
            key={`${type}-${idx}`}
            className={`w-full h-16 flex items-center justify-center bg-slate-950/60 rounded-lg border border-slate-800/80 transition-all ${
              idx === 0 ? 'scale-100 border-slate-700/80 shadow-sm' : 'scale-90 opacity-80'
            }`}
          >
            <PiecePreview type={type} size={idx === 0 ? 17 : 14} />
          </div>
        ))}
      </div>
    </div>
  );
};
