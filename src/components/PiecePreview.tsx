import React from 'react';
import { TETROMINO_COLORS, TETROMINO_SHAPES } from '../constants/tetris';
import { TetrominoType } from '../types/tetris';

interface PiecePreviewProps {
  type: TetrominoType | null;
  size?: number; // cell size in px
  dimmed?: boolean;
}

export const PiecePreview: React.FC<PiecePreviewProps> = ({
  type,
  size = 18,
  dimmed = false,
}) => {
  if (!type) {
    return (
      <div
        className="flex items-center justify-center text-slate-600 text-xs font-mono"
        style={{ width: size * 4, height: size * 3 }}
      >
        —
      </div>
    );
  }

  // Get spawn rotation shape (rotation 0)
  const matrix = TETROMINO_SHAPES[type][0];
  const colorData = TETROMINO_COLORS[type];

  // Trim empty rows/cols for nice centering
  let minR = matrix.length, maxR = -1, minC = matrix[0].length, maxC = -1;
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] !== 0) {
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
        if (c < minC) minC = c;
        if (c > maxC) maxC = c;
      }
    }
  }

  const pieceRows = maxR - minR + 1;
  const pieceCols = maxC - minC + 1;

  return (
    <div
      className={`relative transition-opacity duration-200 flex items-center justify-center ${
        dimmed ? 'opacity-40 grayscale' : 'opacity-100'
      }`}
      style={{
        width: size * 4,
        height: size * (type === 'I' ? 2 : 3),
      }}
    >
      <div
        className="grid gap-[1px]"
        style={{
          gridTemplateColumns: `repeat(${pieceCols}, ${size}px)`,
          gridTemplateRows: `repeat(${pieceRows}, ${size}px)`,
        }}
      >
        {Array.from({ length: pieceRows }).map((_, rIdx) => {
          const r = minR + rIdx;
          return Array.from({ length: pieceCols }).map((_, cIdx) => {
            const c = minC + cIdx;
            const filled = matrix[r][c] !== 0;

            if (!filled) {
              return <div key={`${r}-${c}`} style={{ width: size, height: size }} />;
            }

            return (
              <div
                key={`${r}-${c}`}
                className="rounded-[2px] relative overflow-hidden"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: colorData.primary,
                  boxShadow: `0 0 6px ${colorData.glow}`,
                  border: `1px solid ${colorData.border}`,
                }}
              >
                {/* Specular highlight */}
                <div
                  className="absolute top-0 left-0 right-0 h-[35%] opacity-50"
                  style={{ backgroundColor: colorData.highlight }}
                />
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};
