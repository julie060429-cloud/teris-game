import { TetrominoType, RotationState } from '../types/tetris';

export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;
export const BUFFER_ROWS = 2; // Extra rows above visible top
export const TOTAL_ROWS = BOARD_ROWS + BUFFER_ROWS;

export const TETROMINO_COLORS: Record<TetrominoType, {
  primary: string;
  glow: string;
  border: string;
  highlight: string;
}> = {
  I: {
    primary: '#06b6d4', // Cyan
    glow: 'rgba(6, 182, 212, 0.45)',
    border: '#22d3ee',
    highlight: '#a5f3fc',
  },
  J: {
    primary: '#3b82f6', // Blue
    glow: 'rgba(59, 130, 246, 0.45)',
    border: '#60a5fa',
    highlight: '#bfdbfe',
  },
  L: {
    primary: '#f97316', // Orange
    glow: 'rgba(249, 115, 22, 0.45)',
    border: '#fb923c',
    highlight: '#fed7aa',
  },
  O: {
    primary: '#eab308', // Yellow
    glow: 'rgba(234, 179, 8, 0.45)',
    border: '#facc15',
    highlight: '#fef08a',
  },
  S: {
    primary: '#10b981', // Emerald Green
    glow: 'rgba(16, 185, 129, 0.45)',
    border: '#34d399',
    highlight: '#a7f3d0',
  },
  T: {
    primary: '#a855f7', // Purple
    glow: 'rgba(168, 85, 247, 0.45)',
    border: '#c084fc',
    highlight: '#e9d5ff',
  },
  Z: {
    primary: '#ef4444', // Red
    glow: 'rgba(239, 68, 68, 0.45)',
    border: '#f87171',
    highlight: '#fecaca',
  },
};

// Tetromino matrices for 4 rotation states (0, 1, 2, 3)
// 1 = solid, 0 = empty
export const TETROMINO_SHAPES: Record<TetrominoType, number[][][]> = {
  I: [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
  J: [
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],
  L: [
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
  O: [
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
  ],
  S: [
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  T: [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  Z: [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],
};

// SRS Wall-Kick tables [fromRotation -> toRotation]
// For J, L, S, T, Z pieces:
export const WALL_KICKS_JLSTZ: Record<string, [number, number][]> = {
  '0->1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '1->0': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '1->2': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '2->1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '2->3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  '3->2': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '3->0': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '0->3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
};

// For I piece:
export const WALL_KICKS_I: Record<string, [number, number][]> = {
  '0->1': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  '1->0': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  '1->2': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
  '2->1': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  '2->3': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  '3->2': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  '3->0': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  '0->3': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
};

// Gravity fall speed per level in ms
export const LEVEL_SPEEDS: number[] = [
  800, // Level 1
  715, // Level 2
  632, // Level 3
  550, // Level 4
  470, // Level 5
  395, // Level 6
  325, // Level 7
  260, // Level 8
  200, // Level 9
  150, // Level 10
  115, // Level 11
  90,  // Level 12
  70,  // Level 13
  55,  // Level 14
  45,  // Level 15+
];

export const LOCK_DELAY_MS = 500;
export const MAX_LOCK_RESETS = 15;

// Scoring:
export const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  BACK_TO_BACK_MULTIPLIER: 1.5,
  SOFT_DROP_PER_CELL: 1,
  HARD_DROP_PER_CELL: 2,
  COMBO_BONUS: 50,
};

// Authentic Tetris Korobeiniki Melody Data (Note name to Frequency)
export const NOTE_FREQ: Record<string, number> = {
  'REST': 0,
  'E4': 329.63,
  'B3': 246.94,
  'C4': 261.63,
  'D4': 293.66,
  'A3': 220.00,
  'GS3': 207.65,
  'F4': 349.23,
  'A4': 440.00,
  'G4': 392.00,
  'E3': 164.81,
  'C3': 130.81,
  'D3': 146.83,
  'F3': 174.61,
};

// Note and duration in 16th steps (tempo ~ 140 bpm, 1 beat = 4 steps)
export const TETRIS_THEME_NOTES: Array<[string, number]> = [
  // Section A
  ['E4', 4], ['B3', 2], ['C4', 2], ['D4', 4], ['C4', 2], ['B3', 2],
  ['A3', 4], ['A3', 2], ['C4', 2], ['E4', 4], ['D4', 2], ['C4', 2],
  ['B3', 6], ['C4', 2], ['D4', 4], ['E4', 4],
  ['C4', 4], ['A3', 4], ['A3', 6], ['REST', 2],
  
  // Section A Repeat
  ['D4', 4], ['F4', 2], ['A4', 4], ['G4', 2], ['F4', 2],
  ['E4', 6], ['C4', 2], ['E4', 4], ['D4', 2], ['C4', 2],
  ['B3', 4], ['B3', 2], ['C4', 2], ['D4', 4], ['E4', 4],
  ['C4', 4], ['A3', 4], ['A3', 6], ['REST', 2],
];
