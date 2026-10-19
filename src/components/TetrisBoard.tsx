import React, { useEffect, useRef } from 'react';
import {
  BOARD_COLS,
  BOARD_ROWS,
  TETROMINO_COLORS,
  TETROMINO_SHAPES,
} from '../constants/tetris';
import { ActivePiece, Matrix, Particle, TetrominoType } from '../types/tetris';
import { getGhostPosition } from '../utils/tetris';

interface TetrisBoardProps {
  matrix: Matrix;
  activePiece: ActivePiece | null;
  clearingLines: number[];
  showGhost: boolean;
  showGrid: boolean;
  shake: boolean;
  lastActionText: { text: string; id: number } | null;
}

export const TetrisBoard: React.FC<TetrisBoardProps> = ({
  matrix,
  activePiece,
  clearingLines,
  showGhost,
  showGrid,
  shake,
  lastActionText,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Ghost piece calculation
  const ghostPos = activePiece && showGhost
    ? getGhostPosition(activePiece, matrix)
    : null;

  // Active piece shape coordinates
  const activeCells = new Map<string, TetrominoType>();
  if (activePiece) {
    const shape = TETROMINO_SHAPES[activePiece.type][activePiece.rotation];
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const by = activePiece.position.y + r;
          const bx = activePiece.position.x + c;
          if (by >= 0 && by < BOARD_ROWS && bx >= 0 && bx < BOARD_COLS) {
            activeCells.set(`${by}-${bx}`, activePiece.type);
          }
        }
      }
    }
  }

  // Ghost piece shape coordinates
  const ghostCells = new Set<string>();
  if (ghostPos && activePiece) {
    const shape = TETROMINO_SHAPES[activePiece.type][activePiece.rotation];
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const by = ghostPos.y + r;
          const bx = ghostPos.x + c;
          if (by >= 0 && by < BOARD_ROWS && bx >= 0 && bx < BOARD_COLS) {
            const key = `${by}-${bx}`;
            // Only draw ghost where active piece is not already present
            if (!activeCells.has(key)) {
              ghostCells.add(key);
            }
          }
        }
      }
    }
  }

  // Particle explosion on line clear
  useEffect(() => {
    if (clearingLines.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const cellH = canvas.height / BOARD_ROWS;
    const cellW = canvas.width / BOARD_COLS;

    // Spawn particles along the cleared rows
    clearingLines.forEach((rowIdx) => {
      const y = (rowIdx + 0.5) * cellH;
      const palette = ['#06b6d4', '#3b82f6', '#facc15', '#a855f7', '#ffffff'];

      for (let i = 0; i < 35; i++) {
        const x = Math.random() * canvas.width;
        const angle = (Math.random() * Math.PI) - Math.PI / 2; // spray left and right
        const speed = 1.5 + Math.random() * 4.5;

        particlesRef.current.push({
          x,
          y: y + (Math.random() - 0.5) * cellH,
          vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
          vy: Math.sin(angle) * speed - 1.0,
          color: palette[Math.floor(Math.random() * palette.length)],
          size: 2 + Math.random() * 3.5,
          alpha: 1.0,
          decay: 0.02 + Math.random() * 0.025,
        });
      }
    });
  }, [clearingLines]);

  // Particle animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particlesRef.current.length > 0) {
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08; // subtle gravity
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(renderParticles);
    };

    animFrameRef.current = requestAnimationFrame(renderParticles);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      className={`relative rounded-xl p-2.5 bg-slate-950/90 border-2 border-slate-800 shadow-2xl transition-transform duration-75 ${
        shake ? 'animate-shake' : ''
      }`}
      style={{
        boxShadow: '0 0 40px -10px rgba(6, 182, 212, 0.15), inset 0 0 20px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* 10 x 20 Matrix Grid */}
      <div
        className="grid grid-cols-10 gap-[1.5px] bg-slate-900/60 p-[1px] rounded-lg overflow-hidden relative"
        style={{
          width: 'min(78vw, 320px)',
          height: 'min(156vw, 640px)',
        }}
      >
        {Array.from({ length: BOARD_ROWS }).map((_, r) => {
          const isRowClearing = clearingLines.includes(r);

          return Array.from({ length: BOARD_COLS }).map((_, c) => {
            const key = `${r}-${c}`;
            const activePieceType = activeCells.get(key);
            const isGhost = ghostCells.has(key);
            const lockedType = matrix[r][c] as TetrominoType | null;

            // Determine cell appearance
            let cellContent = null;

            if (isRowClearing) {
              // Row currently clearing -> radiant white flash
              cellContent = (
                <div className="w-full h-full bg-white animate-clear-line rounded-[2px] shadow-[0_0_12px_#ffffff]" />
              );
            } else if (activePieceType) {
              // Active moving piece
              const colors = TETROMINO_COLORS[activePieceType];
              cellContent = (
                <div
                  className="w-full h-full rounded-[3px] relative overflow-hidden transition-all duration-75"
                  style={{
                    backgroundColor: colors.primary,
                    border: `1.5px solid ${colors.border}`,
                    boxShadow: `0 0 8px ${colors.glow}`,
                  }}
                >
                  {/* Top gloss highlight */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[38%] opacity-60"
                    style={{ backgroundColor: colors.highlight }}
                  />
                  {/* Bottom inner shadow */}
                  <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-black/30" />
                </div>
              );
            } else if (lockedType) {
              // Locked piece
              const colors = TETROMINO_COLORS[lockedType];
              cellContent = (
                <div
                  className="w-full h-full rounded-[3px] relative overflow-hidden"
                  style={{
                    backgroundColor: colors.primary,
                    border: `1px solid ${colors.border}`,
                    boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.4)`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[32%] opacity-45"
                    style={{ backgroundColor: colors.highlight }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-black/35" />
                </div>
              );
            } else if (isGhost && activePiece) {
              // Ghost piece outline
              const colors = TETROMINO_COLORS[activePiece.type];
              cellContent = (
                <div
                  className="w-full h-full rounded-[2px] border border-dashed transition-all"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: `${colors.primary}18`, // 10% opacity tint
                  }}
                />
              );
            }

            return (
              <div
                key={key}
                className={`w-full h-full flex items-center justify-center relative transition-colors ${
                  showGrid ? 'bg-slate-950/40' : 'bg-transparent'
                }`}
              >
                {cellContent}
              </div>
            );
          });
        })}

        {/* Floating Action Banner (TETRIS!, 3 COMBO!, etc.) */}
        {lastActionText && (
          <div
            key={lastActionText.id}
            className="absolute inset-x-0 top-1/3 flex items-center justify-center pointer-events-none z-30 transition-all transform animate-bounce"
          >
            <div className="bg-slate-950/90 border border-cyan-400 text-cyan-300 px-4 py-2 rounded-lg font-black text-lg md:text-xl tracking-wider shadow-2xl shadow-cyan-500/40 backdrop-blur-md">
              {lastActionText.text}
            </div>
          </div>
        )}

        {/* Canvas overlay for particle sparks */}
        <canvas
          ref={canvasRef}
          width={320}
          height={640}
          className="absolute inset-0 pointer-events-none w-full h-full z-20"
        />
      </div>
    </div>
  );
};
