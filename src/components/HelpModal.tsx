import React from 'react';
import { X, Keyboard, Zap, Award } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">게임 가이드 & 조작법</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Keyboard Controls */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            키보드 조작
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
              <span className="text-slate-300">좌 / 우 이동</span>
              <div className="flex items-center gap-1 font-mono text-[11px] text-cyan-300 font-semibold">
                <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">←</kbd>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">→</kbd>
                <span className="text-slate-500 font-sans">또는</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">A</kbd>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">D</kbd>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
              <span className="text-slate-300">시계방향 회전 (SRS 벽차기 지원)</span>
              <div className="flex items-center gap-1 font-mono text-[11px] text-cyan-300 font-semibold">
                <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">↑</kbd>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">W</kbd>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">X</kbd>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
              <span className="text-slate-300">반시계방향 회전</span>
              <div className="flex items-center gap-1 font-mono text-[11px] text-cyan-300 font-semibold">
                <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">Z</kbd>
                <span className="text-slate-500 font-sans">또는</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">Ctrl</kbd>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
              <span className="text-slate-300">소프트 드롭 (+1점/칸)</span>
              <div className="flex items-center gap-1 font-mono text-[11px] text-cyan-300 font-semibold">
                <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">↓</kbd>
                <span className="text-slate-500 font-sans">또는</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">S</kbd>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
              <span className="text-slate-300">하드 드롭 (+2점/칸 즉시 착지)</span>
              <div className="flex items-center gap-1 font-mono text-[11px] text-cyan-300 font-semibold">
                <kbd className="px-3 py-0.5 bg-slate-800 rounded border border-slate-700">Space</kbd>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
              <span className="text-slate-300">블록 보관 (홀드)</span>
              <div className="flex items-center gap-1 font-mono text-[11px] text-cyan-300 font-semibold">
                <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">C</kbd>
                <span className="text-slate-500 font-sans">또는</span>
                <kbd className="px-2.5 py-0.5 bg-slate-800 rounded border border-slate-700">Shift</kbd>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
              <span className="text-slate-300">일시정지</span>
              <div className="flex items-center gap-1 font-mono text-[11px] text-cyan-300 font-semibold">
                <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">P</kbd>
                <span className="text-slate-500 font-sans">또는</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">Esc</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring & Rules */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            점수 체계
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
              <div className="font-semibold text-white">1줄 (Single)</div>
              <div className="text-slate-400 mt-0.5 font-mono">100 × 레벨 점수</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
              <div className="font-semibold text-white">2줄 (Double)</div>
              <div className="text-slate-400 mt-0.5 font-mono">300 × 레벨 점수</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
              <div className="font-semibold text-white">3줄 (Triple)</div>
              <div className="text-slate-400 mt-0.5 font-mono">500 × 레벨 점수</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/50 border border-cyan-500/30 bg-cyan-950/15">
              <div className="font-bold text-cyan-300">4줄 테트리스</div>
              <div className="text-cyan-400/80 mt-0.5 font-mono">800 × 레벨 점수 (연속시 1.5배)</div>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="text-xs text-slate-400 space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-1 text-slate-200 font-semibold mb-1">
            <Award className="w-4 h-4 text-cyan-400" />
            공식 테트리스 규격 지원
          </div>
          <p>· <strong>7-Bag 랜덤 생성기</strong>: 7종류의 테트리스 블록이 공평하게 균형있게 순환 지급됩니다.</p>
          <p>· <strong>SRS 슈퍼 로테이션 시스템</strong>: 벽이나 다른 블록에 붙어있어도 벽차기(Wall-kick) 회전이 자연스럽게 적용됩니다.</p>
          <p>· <strong>고스트 피스</strong>: 블록이 수직으로 떨어졌을 때 착지할 위치를 미리 윤곽선으로 확인할 수 있습니다.</p>
        </div>

        {/* Close button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-white font-semibold text-xs border border-slate-700 transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
