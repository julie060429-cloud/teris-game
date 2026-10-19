import React from 'react';
import { Volume2, VolumeX, Music, HelpCircle, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import { GameState } from '../types/tetris';

interface HeaderProps {
  gameState: GameState;
  sfxEnabled: boolean;
  bgmEnabled: boolean;
  onToggleSfx: () => void;
  onToggleBgm: () => void;
  onStartOrPause: () => void;
  onRestart: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  gameState,
  sfxEnabled,
  bgmEnabled,
  onToggleSfx,
  onToggleBgm,
  onStartOrPause,
  onRestart,
  onOpenHelp,
  onOpenSettings,
}) => {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element, no pills, no subtitles) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-white font-black text-sm tracking-tighter">T</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Tetris Neo
          </span>
        </div>

        {/* Zone 2: Navigation / Quick toggles (clean text & icon buttons) */}
        <nav className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <button
            onClick={onToggleSfx}
            title={sfxEnabled ? '효과음 끄기' : '효과음 켜기'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 ${
              sfxEnabled ? 'text-slate-200 hover:text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {sfxEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">효과음</span>
          </button>

          <button
            onClick={onToggleBgm}
            title={bgmEnabled ? 'BGM 끄기' : 'BGM 켜기'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 ${
              bgmEnabled ? 'text-slate-200 hover:text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Music className={`w-4 h-4 ${bgmEnabled ? 'text-indigo-400' : ''}`} />
            <span className="hidden sm:inline">음악</span>
          </button>

          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors text-slate-400 hover:text-white whitespace-nowrap shrink-0"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">조작법</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors text-slate-400 hover:text-white whitespace-nowrap shrink-0"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">설정</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          {gameState === 'PLAYING' || gameState === 'PAUSED' ? (
            <>
              <button
                onClick={onRestart}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="다시 시작"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onStartOrPause}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg border border-slate-700 transition-all whitespace-nowrap shrink-0"
              >
                {gameState === 'PLAYING' ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>일시정지</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>계속하기</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={onStartOrPause}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 active:scale-95 rounded-lg transition-all shadow-md shadow-cyan-500/20 whitespace-nowrap shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>게임 시작</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
