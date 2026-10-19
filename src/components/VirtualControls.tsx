import React, { useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  RotateCw,
  RotateCcw,
  ChevronsDown,
  Repeat,
} from 'lucide-react';

interface VirtualControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onRotateCW: () => void;
  onRotateCCW: () => void;
  onHold: () => void;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onSoftDrop,
  onHardDrop,
  onRotateCW,
  onRotateCCW,
  onHold,
}) => {
  const repeatTimerRef = useRef<number | null>(null);

  const startHoldAction = (action: () => void, interval = 55) => {
    action();
    repeatTimerRef.current = window.setInterval(action, interval);
  };

  const stopHoldAction = () => {
    if (repeatTimerRef.current) {
      clearInterval(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-2 py-3 select-none flex items-center justify-between gap-3">
      {/* Directional Pad (Left, Down, Right) */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            startHoldAction(onMoveLeft, 110);
          }}
          onTouchEnd={stopHoldAction}
          onMouseDown={() => startHoldAction(onMoveLeft, 110)}
          onMouseUp={stopHoldAction}
          onMouseLeave={stopHoldAction}
          className="w-13 h-13 rounded-xl bg-slate-800/90 active:bg-cyan-500/30 border border-slate-700 active:border-cyan-400 text-slate-200 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="왼쪽 이동"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            startHoldAction(onSoftDrop, 50);
          }}
          onTouchEnd={stopHoldAction}
          onMouseDown={() => startHoldAction(onSoftDrop, 50)}
          onMouseUp={stopHoldAction}
          onMouseLeave={stopHoldAction}
          className="w-13 h-13 rounded-xl bg-slate-800/90 active:bg-cyan-500/30 border border-slate-700 active:border-cyan-400 text-slate-200 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="소프트 드롭"
        >
          <ArrowDown className="w-6 h-6" />
        </button>

        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            startHoldAction(onMoveRight, 110);
          }}
          onTouchEnd={stopHoldAction}
          onMouseDown={() => startHoldAction(onMoveRight, 110)}
          onMouseUp={stopHoldAction}
          onMouseLeave={stopHoldAction}
          className="w-13 h-13 rounded-xl bg-slate-800/90 active:bg-cyan-500/30 border border-slate-700 active:border-cyan-400 text-slate-200 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="오른쪽 이동"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Middle: Hard Drop & Hold */}
      <div className="flex flex-col gap-1.5 items-center">
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            onHardDrop();
          }}
          onClick={onHardDrop}
          className="px-4 py-2.5 rounded-xl bg-cyan-500/20 active:bg-cyan-500/40 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1 shadow-lg active:scale-95 transition-transform whitespace-nowrap"
          aria-label="하드 드롭"
        >
          <ChevronsDown className="w-4 h-4" />
          <span>하드드롭</span>
        </button>

        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            onHold();
          }}
          onClick={onHold}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800/80 active:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-[11px] flex items-center gap-1 active:scale-95 transition-transform whitespace-nowrap"
          aria-label="홀드"
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>홀드</span>
        </button>
      </div>

      {/* Action Pad: Rotate CCW & CW */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            onRotateCCW();
          }}
          onClick={onRotateCCW}
          className="w-12 h-12 rounded-xl bg-slate-800/90 active:bg-purple-500/30 border border-slate-700 active:border-purple-400 text-purple-300 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="반시계 회전"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            onRotateCW();
          }}
          onClick={onRotateCW}
          className="w-13 h-13 rounded-xl bg-purple-600/30 active:bg-purple-600/50 border border-purple-500/50 active:border-purple-400 text-purple-200 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="시계방향 회전"
        >
          <RotateCw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
