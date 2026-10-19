import {
  BOARD_COLS,
  BOARD_ROWS,
  TETROMINO_SHAPES,
  WALL_KICKS_JLSTZ,
  WALL_KICKS_I,
} from '../constants/tetris';
import {
  ActivePiece,
  Matrix,
  Position,
  RotationState,
  TetrominoType,
} from '../types/tetris';

// Create an empty 20x10 matrix (rows x cols)
export function createEmptyMatrix(): Matrix {
  return Array.from({ length: BOARD_ROWS }, () =>
    Array.from({ length: BOARD_COLS }, () => null)
  );
}

// 7-Bag Randomizer
export function generate7Bag(): TetrominoType[] {
  const pieces: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  // Fisher-Yates shuffle
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  return pieces;
}

// Get the initial spawn position for a tetromino
export function getSpawnPosition(type: TetrominoType): Position {
  // Center pieces horizontally
  switch (type) {
    case 'O':
      return { x: 4, y: 0 };
    case 'I':
      return { x: 3, y: -1 }; // Spawn slightly higher so visible rows match
    default:
      return { x: 3, y: 0 };
  }
}

// Check if a piece collides with walls, floor, or locked blocks
export function checkCollision(
  piece: ActivePiece,
  matrix: Matrix,
  offset: Position = { x: 0, y: 0 }
): boolean {
  const shape = TETROMINO_SHAPES[piece.type][piece.rotation];
  const targetX = piece.position.x + offset.x;
  const targetY = piece.position.y + offset.y;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] !== 0) {
        const boardX = targetX + c;
        const boardY = targetY + r;

        // Check horizontal boundaries
        if (boardX < 0 || boardX >= BOARD_COLS) {
          return true;
        }

        // Check bottom boundary
        if (boardY >= BOARD_ROWS) {
          return true;
        }

        // Check collision with already locked blocks (ignore if above board)
        if (boardY >= 0 && matrix[boardY][boardX] !== null) {
          return true;
        }
      }
    }
  }

  return false;
}

// Calculate the ghost piece position (lowest valid position directly downward)
export function getGhostPosition(piece: ActivePiece, matrix: Matrix): Position {
  let dropY = 0;
  while (!checkCollision(piece, matrix, { x: 0, y: dropY + 1 })) {
    dropY++;
  }
  return {
    x: piece.position.x,
    y: piece.position.y + dropY,
  };
}

// Try rotating a piece with SRS Wall Kicks
export function tryRotate(
  piece: ActivePiece,
  matrix: Matrix,
  direction: 'CW' | 'CCW'
): ActivePiece | null {
  const currentRotation = piece.rotation;
  let nextRotation: RotationState;

  if (direction === 'CW') {
    nextRotation = ((currentRotation + 1) % 4) as RotationState;
  } else {
    nextRotation = ((currentRotation + 3) % 4) as RotationState;
  }

  // O piece doesn't need kicks
  if (piece.type === 'O') {
    return {
      ...piece,
      rotation: nextRotation,
    };
  }

  const kickKey = `${currentRotation}->${nextRotation}`;
  const kickTable = piece.type === 'I' ? WALL_KICKS_I : WALL_KICKS_JLSTZ;
  const tests = kickTable[kickKey] || [[0, 0]];

  for (const [kx, ky] of tests) {
    // Note: SRS kick table Y is positive upwards, but board Y is positive downwards
    const candidatePiece: ActivePiece = {
      ...piece,
      rotation: nextRotation,
      position: {
        x: piece.position.x + kx,
        y: piece.position.y - ky,
      },
    };

    if (!checkCollision(candidatePiece, matrix)) {
      return candidatePiece;
    }
  }

  // If all kicks fail, rotation blocked
  return null;
}

// Lock a piece into the matrix
export function lockPieceToMatrix(piece: ActivePiece, matrix: Matrix): Matrix {
  const shape = TETROMINO_SHAPES[piece.type][piece.rotation];
  const newMatrix = matrix.map((row) => [...row]);

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] !== 0) {
        const boardX = piece.position.x + c;
        const boardY = piece.position.y + r;
        if (boardY >= 0 && boardY < BOARD_ROWS && boardX >= 0 && boardX < BOARD_COLS) {
          newMatrix[boardY][boardX] = piece.type;
        }
      }
    }
  }

  return newMatrix;
}

// Find all completed row indices
export function getCompletedRows(matrix: Matrix): number[] {
  const completed: number[] = [];
  for (let r = 0; r < BOARD_ROWS; r++) {
    if (matrix[r].every((cell) => cell !== null)) {
      completed.push(r);
    }
  }
  return completed;
}

// Clear specified rows and prepend new empty rows
export function clearCompletedRows(matrix: Matrix, rowIndices: number[]): Matrix {
  if (rowIndices.length === 0) return matrix;

  const rowSet = new Set(rowIndices);
  const remaining = matrix.filter((_, idx) => !rowSet.has(idx));
  const newRows = Array.from({ length: rowIndices.length }, () =>
    Array.from({ length: BOARD_COLS }, () => null)
  );

  return [...newRows, ...remaining];
}
