import { useState } from 'react';
import { Play, RotateCcw, HelpCircle, Trophy, Sparkles } from 'lucide-react';
import { useTetris } from './hooks/useTetris';
import { Header } from './components/Header';
import { TetrisBoard } from './components/TetrisBoard';
import { HoldQueue } from './components/HoldQueue';
import { NextQueue } from './components/NextQueue';
import { ScoreBoard } from './components/ScoreBoard';
import { VirtualControls } from './components/VirtualControls';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';
import { sound } from './utils/audio';

export default function App() {
  const {
    gameState,
    matrix,
    activePiece,
    holdPiece,
    canHold,
    nextQueue,
    score,
    highScore,
    lines,
    level,
    combo,
    clearingLines,
    shake,
    lastActionText,
    stats,
    showGhost,
    showGrid,
    startGame,
    togglePause,
    moveLeft,
    moveRight,
    rotateCW,
    rotateCCW,
    softDrop,
    hardDrop,
    hold,
    toggleGhost,
    toggleGrid,
  } = useTetris();

  // Audio state
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => sound.sfxEnabled);
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(() => sound.bgmEnabled);
  const [sfxVolume, setSfxVolume] = useState<number>(() => sound.sfxVolume);
  const [bgmVolume, setBgmVolume] = useState<number>(() => sound.bgmVolume);

  // Modals state
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    sound.setSfxEnabled(next);
    if (next) sound.playMove();
  };

  const handleToggleBgm = () => {
    const next = !bgmEnabled;
    setBgmEnabled(next);
    sound.setBgmEnabled(next);
  };

  const handleChangeSfxVol = (vol: number) => {
    setSfxVolume(vol);
    sound.setSfxVolume(vol);
  };

  const handleChangeBgmVol = (vol: number) => {
    setBgmVolume(vol);
    sound.setBgmVolume(vol);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3-Zone Header Contract */}
      <Header
        gameState={gameState}
        sfxEnabled={sfxEnabled}
        bgmEnabled={bgmEnabled}
        onToggleSfx={handleToggleSfx}
        onToggleBgm={handleToggleBgm}
        onStartOrPause={() => {
          if (gameState === 'READY' || gameState === 'GAME_OVER') {
            startGame();
          } else {
            togglePause();
          }
        }}
        onRestart={startGame}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Arena */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 md:py-6 flex flex-col items-center justify-center">
        {/* Mobile top mini-metrics bar (visible on small screens) */}
        <div className="flex md:hidden items-center justify-between w-full max-w-[340px] px-2 mb-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>점수:</span>
            <span className="font-bold text-white text-sm tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">LV {level}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">{lines}줄</span>
          </div>
        </div>

        {/* Desktop 3-Column Arena */}
        <div className="flex items-start justify-center gap-4 lg:gap-8 w-full">
          {/* Left Panel: Hold & Secondary Stats (hidden on tiny screens, flex on md+) */}
          <div className="hidden md:flex flex-col gap-4 w-44 shrink-0">
            <HoldQueue piece={holdPiece} canHold={canHold} onHoldClick={hold} />

            {/* Quick Level & Lines Card */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-0.5">LEVEL</div>
                <div className="text-2xl font-bold text-cyan-300 font-mono tabular-nums">
                  {level}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 mb-0.5">CLEARED LINES</div>
                <div className="text-xl font-bold text-slate-200 font-mono tabular-nums">
                  {lines}
                </div>
              </div>
            </div>

            {/* Stats Breakdown Card */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 text-xs">
              <div className="text-[11px] font-semibold text-slate-400 mb-2">클리어 통계</div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>테트리스 (4줄)</span>
                  <span className="font-bold text-cyan-400 font-mono tabular-nums">
                    {stats.tetrises}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>3줄 (Triple)</span>
                  <span className="font-mono tabular-nums text-slate-300">{stats.triples}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>2줄 (Double)</span>
                  <span className="font-mono tabular-nums text-slate-300">{stats.doubles}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>1줄 (Single)</span>
                  <span className="font-mono tabular-nums text-slate-300">{stats.singles}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: The Matrix */}
          <div className="flex flex-col items-center relative">
            <TetrisBoard
              matrix={matrix}
              activePiece={activePiece}
              clearingLines={clearingLines}
              showGhost={showGhost}
              showGrid={showGrid}
              shake={shake}
              lastActionText={lastActionText}
            />

            {/* Overlay for READY state */}
            {gameState === 'READY' && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/85 backdrop-blur-sm rounded-xl text-center">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mb-4 text-cyan-300 shadow-xl shadow-cyan-500/20">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
                  Tetris Classic Neo
                </h1>
                <p className="text-xs text-slate-400 max-w-xs mb-6">
                  공식 SRS 슈퍼 로테이션 회전 시스템과 7-Bag 랜덤 생성기를 탑재한 클래식 아케이드 테트리스
                </p>

                <button
                  onClick={startGame}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/30 active:scale-95 transition-all mb-4"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>게임 시작 (Space / Enter)</span>
                </button>

                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>키보드 조작법 & 점수 안내</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Panel: Score & Next Queue */}
          <div className="hidden md:flex flex-col gap-4 w-44 shrink-0">
            <ScoreBoard
              score={score}
              highScore={highScore}
              level={level}
              lines={lines}
              combo={combo}
            />

            <NextQueue queue={nextQueue} />
          </div>

          {/* Mobile Side Strip for Hold & Next Queue on mobile screens */}
          <div className="flex md:hidden flex-col gap-3 w-18 shrink-0">
            <HoldQueue piece={holdPiece} canHold={canHold} onHoldClick={hold} />
            {nextQueue.length > 0 && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2 flex flex-col items-center">
                <span className="text-[10px] font-semibold text-slate-400 mb-1.5">NEXT</span>
                <div className="w-14 h-14 flex items-center justify-center bg-slate-950/60 rounded border border-slate-800">
                  <NextQueue queue={nextQueue.slice(0, 1)} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Virtual Touch Controller (always visible for mobile/touch users, or toggled) */}
        <div className="w-full mt-4 md:hidden">
          <VirtualControls
            onMoveLeft={moveLeft}
            onMoveRight={moveRight}
            onSoftDrop={softDrop}
            onHardDrop={hardDrop}
            onRotateCW={rotateCW}
            onRotateCCW={rotateCCW}
            onHold={hold}
          />
        </div>

        {/* Desktop Quick Shortcuts Bar below arena */}
        <div className="hidden md:flex items-center justify-center gap-6 mt-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-slate-400">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-slate-400">→</kbd>
            <span>이동</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-slate-400">↑ / W</kbd>
            <span>회전</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-slate-400">Space</kbd>
            <span>하드드롭</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-slate-400">↓ / S</kbd>
            <span>소프트드롭</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-slate-400">C</kbd>
            <span>홀드</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-slate-400">P</kbd>
            <span>일시정지</span>
          </span>
        </div>
      </main>

      {/* Modals */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          score={score}
          highScore={highScore}
          level={level}
          lines={lines}
          stats={stats}
          onPlayAgain={startGame}
        />
      )}

      {gameState === 'PAUSED' && (
        <PauseModal
          score={score}
          level={level}
          lines={lines}
          onResume={togglePause}
          onRestart={startGame}
        />
      )}

      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}

      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          sfxEnabled={sfxEnabled}
          bgmEnabled={bgmEnabled}
          sfxVolume={sfxVolume}
          bgmVolume={bgmVolume}
          showGhost={showGhost}
          showGrid={showGrid}
          onToggleSfx={handleToggleSfx}
          onToggleBgm={handleToggleBgm}
          onChangeSfxVolume={handleChangeSfxVol}
          onChangeBgmVolume={handleChangeBgmVol}
          onToggleGhost={toggleGhost}
          onToggleGrid={toggleGrid}
        />
      )}
    </div>
  );
}
