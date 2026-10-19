export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type RotationState = 0 | 1 | 2 | 3; // 0: spawn, 1: 90deg, 2: 180deg, 3: 270deg

export interface Position {
  x: number;
  y: number;
}

export interface ActivePiece {
  type: TetrominoType;
  rotation: RotationState;
  position: Position;
}

export type CellValue = string | null; // Color string if filled, null if empty

export type Matrix = CellValue[][]; // 20 rows x 10 columns (visible) + buffer

export interface GameStats {
  singles: number;
  doubles: number;
  triples: number;
  tetrises: number;
  maxCombo: number;
  totalPieces: number;
  startTime: number;
  durationSeconds: number;
}

export type GameState = 'READY' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}
