import React from 'react';
import { X, Volume2, Music, Eye, Grid } from 'lucide-react';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  onClose: () => void;
  sfxEnabled: boolean;
  bgmEnabled: boolean;
  sfxVolume: number;
  bgmVolume: number;
  showGhost: boolean;
  showGrid: boolean;
  onToggleSfx: () => void;
  onToggleBgm: () => void;
  onChangeSfxVolume: (vol: number) => void;
  onChangeBgmVolume: (vol: number) => void;
  onToggleGhost: () => void;
  onToggleGrid: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  sfxEnabled,
  bgmEnabled,
  sfxVolume,
  bgmVolume,
  showGhost,
  showGrid,
  onToggleSfx,
  onToggleBgm,
  onChangeSfxVolume,
  onChangeBgmVolume,
  onToggleGhost,
  onToggleGrid,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <h2 className="text-lg font-bold text-white">환경 설정</h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-xs">
          {/* SFX */}
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-slate-200 font-semibold">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                효과음 (SFX)
              </span>
              <button
                onClick={onToggleSfx}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  sfxEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    sfxEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {sfxEnabled && (
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxVolume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onChangeSfxVolume(val);
                    sound.playMove();
                  }}
                  className="w-full accent-cyan-400"
                />
                <span className="font-mono text-slate-400 w-8 text-right">
                  {Math.round(sfxVolume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* BGM */}
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-slate-200 font-semibold">
                <Music className="w-4 h-4 text-indigo-400" />
                8-bit 테트리스 배경음악
              </span>
              <button
                onClick={onToggleBgm}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  bgmEnabled ? 'bg-indigo-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    bgmEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {bgmEnabled && (
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={bgmVolume}
                  onChange={(e) => onChangeBgmVolume(parseFloat(e.target.value))}
                  className="w-full accent-indigo-400"
                />
                <span className="font-mono text-slate-400 w-8 text-right">
                  {Math.round(bgmVolume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Ghost Piece */}
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-200 font-semibold mb-0.5">
                <Eye className="w-4 h-4 text-amber-400" />
                고스트 피스 (낙하 위치 가이드)
              </div>
              <div className="text-[11px] text-slate-500">
                블록이 떨어질 위치를 미리 윤곽선으로 표시
              </div>
            </div>
            <button
              onClick={onToggleGhost}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                showGhost ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  showGhost ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Grid lines */}
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-200 font-semibold mb-0.5">
                <Grid className="w-4 h-4 text-emerald-400" />
                격자선 (그리드)
              </div>
              <div className="text-[11px] text-slate-500">
                보드 칸 구분선을 은은하게 표시
              </div>
            </div>
            <button
              onClick={onToggleGrid}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                showGrid ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  showGrid ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-white font-semibold text-xs border border-slate-700 transition-all"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
