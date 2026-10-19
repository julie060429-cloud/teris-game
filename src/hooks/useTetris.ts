import { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  LEVEL_SPEEDS,
  LOCK_DELAY_MS,
  MAX_LOCK_RESETS,
  POINTS,
} from '../constants/tetris';
import {
  ActivePiece,
  GameState,
  GameStats,
  Matrix,
  TetrominoType,
} from '../types/tetris';
import { sound } from '../utils/audio';
import {
  checkCollision,
  clearCompletedRows,
  createEmptyMatrix,
  generate7Bag,
  getCompletedRows,
  getSpawnPosition,
  lockPieceToMatrix,
  tryRotate,
} from '../utils/tetris';

export function useTetris() {
  const [gameState, setGameState] = useState<GameState>('READY');
  const [matrix, setMatrix] = useState<Matrix>(() => createEmptyMatrix());
  const [activePiece, setActivePiece] = useState<ActivePiece | null>(null);
  const [holdPiece, setHoldPiece] = useState<TetrominoType | null>(null);
  const [canHold, setCanHold] = useState<boolean>(true);
  const [nextQueue, setNextQueue] = useState<TetrominoType[]>([]);

  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tetris_high_score');
        return saved ? parseInt(saved, 10) : 0;
      } catch {}
    }
    return 0;
  });
  const [lines, setLines] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [combo, setCombo] = useState<number>(-1);
  const [isBackToBack, setIsBackToBack] = useState<boolean>(false);

  // Visual effects states
  const [clearingLines, setClearingLines] = useState<number[]>([]);
  const [shake, setShake] = useState<boolean>(false);
  const [lastActionText, setLastActionText] = useState<{ text: string; id: number } | null>(null);

  // Statistics
  const [stats, setStats] = useState<GameStats>({
    singles: 0,
    doubles: 0,
    triples: 0,
    tetrises: 0,
    maxCombo: 0,
    totalPieces: 0,
    startTime: 0,
    durationSeconds: 0,
  });

  // User Settings
  const [showGhost, setShowGhost] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tetris_show_ghost');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const [showGrid, setShowGrid] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tetris_show_grid');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  // Refs for loop management and mutable state inside callbacks
  const bagRef = useRef<TetrominoType[]>([]);
  const lockTimerRef = useRef<number | null>(null);
  const lockResetsRef = useRef<number>(0);
  const lastDropTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const gameStateRef = useRef<GameState>(gameState);
  gameStateRef.current = gameState;

  const matrixRef = useRef<Matrix>(matrix);
  matrixRef.current = matrix;

  const activePieceRef = useRef<ActivePiece | null>(activePiece);
  activePieceRef.current = activePiece;

  const levelRef = useRef<number>(level);
  levelRef.current = level;

  // Ref for keys currently held down for DAS / ARR
  const keysDownRef = useRef<Record<string, { time: number; dasFired: boolean; intervalId?: number }>>({});

  // Pull next piece from 7-bag
  const getNextFromBag = useCallback((): TetrominoType => {
    if (bagRef.current.length <= 7) {
      bagRef.current = [...bagRef.current, ...generate7Bag()];
    }
    return bagRef.current.shift()!;
  }, []);

  // Update High Score helper
  const updateHighScore = useCallback((newScore: number) => {
    setHighScore((prev) => {
      if (newScore > prev) {
        try {
          localStorage.setItem('tetris_high_score', String(newScore));
        } catch {}
        return newScore;
      }
      return prev;
    });
  }, []);

  // Show floating action text (e.g., TETRIS!, COMBO x3)
  const triggerActionText = useCallback((text: string) => {
    setLastActionText({ text, id: Date.now() });
    setTimeout(() => {
      setLastActionText((curr) => (curr && curr.text === text ? null : curr));
    }, 1200);
  }, []);

  // Spawn a new active piece
  const spawnPiece = useCallback(
    (type?: TetrominoType) => {
      setNextQueue((prevQueue) => {
        let currentQueue = [...prevQueue];
        while (currentQueue.length < 5) {
          currentQueue.push(getNextFromBag());
        }

        const nextType = type || currentQueue.shift()!;
        // Ensure at least 5 in preview
        while (currentQueue.length < 5) {
          currentQueue.push(getNextFromBag());
        }

        const newPiece: ActivePiece = {
          type: nextType,
          rotation: 0,
          position: getSpawnPosition(nextType),
        };

        // Check if spawn position collides immediately -> Game Over!
        if (checkCollision(newPiece, matrixRef.current)) {
          setGameState('GAME_OVER');
          sound.playGameOver();
          sound.stopBgm();
          return currentQueue;
        }

        setActivePiece(newPiece);
        setCanHold(true);
        lockResetsRef.current = 0;
        if (lockTimerRef.current) {
          clearTimeout(lockTimerRef.current);
          lockTimerRef.current = null;
        }

        setStats((s) => ({ ...s, totalPieces: s.totalPieces + 1 }));
        return currentQueue;
      });
    },
    [getNextFromBag]
  );

  // Lock the active piece to matrix and evaluate lines
  const lockPiece = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece) return;

    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }

    sound.playLock();
    const newMatrix = lockPieceToMatrix(piece, matrixRef.current);
    const completedLines = getCompletedRows(newMatrix);

    if (completedLines.length > 0) {
      // Trigger line clearing animation first
      setClearingLines(completedLines);
      sound.playLineClear(completedLines.length);

      // Screen shake on multiple lines
      if (completedLines.length >= 2) {
        setShake(true);
        setTimeout(() => setShake(false), 200);
      }

      // Calculate score & combo
      const count = completedLines.length;
      let basePoints = 0;
      let actionLabel = '';

      if (count === 1) {
        basePoints = POINTS.SINGLE * levelRef.current;
        setStats((s) => ({ ...s, singles: s.singles + 1 }));
      } else if (count === 2) {
        basePoints = POINTS.DOUBLE * levelRef.current;
        actionLabel = 'DOUBLE!';
        setStats((s) => ({ ...s, doubles: s.doubles + 1 }));
      } else if (count === 3) {
        basePoints = POINTS.TRIPLE * levelRef.current;
        actionLabel = 'TRIPLE!';
        setStats((s) => ({ ...s, triples: s.triples + 1 }));
      } else if (count === 4) {
        basePoints = POINTS.TETRIS * levelRef.current;
        if (isBackToBack) {
          basePoints = Math.round(basePoints * POINTS.BACK_TO_BACK_MULTIPLIER);
          actionLabel = 'B2B TETRIS!';
        } else {
          actionLabel = 'TETRIS!';
        }
        setIsBackToBack(true);
        setStats((s) => ({ ...s, tetrises: s.tetrises + 1 }));

        // Confetti for Tetris clear
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#3b82f6', '#eab308', '#a855f7'],
        });
      }

      if (count < 4) {
        setIsBackToBack(false);
      }

      // Combo handling
      setCombo((prevCombo) => {
        const nextCombo = prevCombo + 1;
        if (nextCombo > 0) {
          const comboBonus = POINTS.COMBO_BONUS * nextCombo * levelRef.current;
          basePoints += comboBonus;
          sound.playCombo(nextCombo);
          if (!actionLabel) {
            actionLabel = `${nextCombo} COMBO!`;
          } else {
            actionLabel += ` · ${nextCombo} COMBO!`;
          }
        }
        setStats((s) => ({ ...s, maxCombo: Math.max(s.maxCombo, nextCombo) }));
        return nextCombo;
      });

      if (actionLabel) {
        triggerActionText(actionLabel);
      }

      // Add points
      setScore((prevScore) => {
        const newScore = prevScore + basePoints;
        updateHighScore(newScore);
        return newScore;
      });

      // Update lines and level
      setLines((prevLines) => {
        const newTotalLines = prevLines + count;
        const newLevel = Math.min(15, Math.floor(newTotalLines / 10) + 1);
        if (newLevel > levelRef.current) {
          setLevel(newLevel);
          sound.playLevelUp();
          sound.setLevelTempo(newLevel);
          triggerActionText(`LEVEL ${newLevel}!`);
        }
        return newTotalLines;
      });

      // After brief animation, actually remove rows from matrix and spawn next
      setTimeout(() => {
        const clearedMatrix = clearCompletedRows(newMatrix, completedLines);
        setMatrix(clearedMatrix);
        setClearingLines([]);
        setActivePiece(null);
        spawnPiece();
      }, 180);
    } else {
      // No lines cleared -> reset combo
      setCombo(-1);
      setMatrix(newMatrix);
      setActivePiece(null);
      spawnPiece();
    }
  }, [isBackToBack, spawnPiece, triggerActionText, updateHighScore]);

  // Movement: Move Left / Right
  const moveHorizontal = useCallback((dx: number) => {
    if (gameStateRef.current !== 'PLAYING') return;
    const piece = activePieceRef.current;
    if (!piece) return;

    if (!checkCollision(piece, matrixRef.current, { x: dx, y: 0 })) {
      const nextPiece = {
        ...piece,
        position: { ...piece.position, x: piece.position.x + dx },
      };
      setActivePiece(nextPiece);
      sound.playMove();

      // If touching floor or block, reset lock delay
      if (checkCollision(nextPiece, matrixRef.current, { x: 0, y: 1 })) {
        if (lockResetsRef.current < MAX_LOCK_RESETS) {
          lockResetsRef.current++;
          if (lockTimerRef.current) {
            clearTimeout(lockTimerRef.current);
            lockTimerRef.current = window.setTimeout(lockPiece, LOCK_DELAY_MS);
          }
        }
      }
    }
  }, [lockPiece]);

  // Rotate piece (CW or CCW)
  const rotate = useCallback((direction: 'CW' | 'CCW') => {
    if (gameStateRef.current !== 'PLAYING') return;
    const piece = activePieceRef.current;
    if (!piece) return;

    const rotatedPiece = tryRotate(piece, matrixRef.current, direction);
    if (rotatedPiece) {
      setActivePiece(rotatedPiece);
      sound.playRotate();

      // Reset lock delay if on surface
      if (checkCollision(rotatedPiece, matrixRef.current, { x: 0, y: 1 })) {
        if (lockResetsRef.current < MAX_LOCK_RESETS) {
          lockResetsRef.current++;
          if (lockTimerRef.current) {
            clearTimeout(lockTimerRef.current);
            lockTimerRef.current = window.setTimeout(lockPiece, LOCK_DELAY_MS);
          }
        }
      }
    }
  }, [lockPiece]);

  // Soft Drop (down 1 step + 1 pt)
  const softDrop = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING') return;
    const piece = activePieceRef.current;
    if (!piece) return;

    if (!checkCollision(piece, matrixRef.current, { x: 0, y: 1 })) {
      setActivePiece({
        ...piece,
        position: { ...piece.position, y: piece.position.y + 1 },
      });
      setScore((s) => {
        const next = s + POINTS.SOFT_DROP_PER_CELL;
        updateHighScore(next);
        return next;
      });
      sound.playSoftDrop();
    } else {
      // Touching floor
      if (!lockTimerRef.current) {
        lockTimerRef.current = window.setTimeout(lockPiece, LOCK_DELAY_MS);
      }
    }
  }, [lockPiece, updateHighScore]);

  // Hard Drop (slam straight down + lock immediately + 2 pts per cell)
  const hardDrop = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING') return;
    const piece = activePieceRef.current;
    if (!piece) return;

    let dropDistance = 0;
    while (!checkCollision(piece, matrixRef.current, { x: 0, y: dropDistance + 1 })) {
      dropDistance++;
    }

    const droppedPiece = {
      ...piece,
      position: { ...piece.position, y: piece.position.y + dropDistance },
    };

    activePieceRef.current = droppedPiece;
    setActivePiece(droppedPiece);

    setScore((s) => {
      const next = s + dropDistance * POINTS.HARD_DROP_PER_CELL;
      updateHighScore(next);
      return next;
    });

    sound.playHardDrop();
    setShake(true);
    setTimeout(() => setShake(false), 150);

    lockPiece();
  }, [lockPiece, updateHighScore]);

  // Hold piece
  const hold = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING' || !canHold) return;
    const piece = activePieceRef.current;
    if (!piece) return;

    sound.playHold();
    const currentType = piece.type;

    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }

    if (holdPiece === null) {
      setHoldPiece(currentType);
      spawnPiece();
    } else {
      const nextToSpawn = holdPiece;
      setHoldPiece(currentType);
      spawnPiece(nextToSpawn);
    }

    setCanHold(false);
  }, [canHold, holdPiece, spawnPiece]);

  // Start new game
  const startGame = useCallback(() => {
    const empty = createEmptyMatrix();
    setMatrix(empty);
    matrixRef.current = empty;

    bagRef.current = [...generate7Bag(), ...generate7Bag()];
    const initialQueue: TetrominoType[] = [];
    while (initialQueue.length < 5) {
      initialQueue.push(bagRef.current.shift()!);
    }
    setNextQueue(initialQueue);

    setHoldPiece(null);
    setCanHold(true);
    setScore(0);
    setLines(0);
    setLevel(1);
    setCombo(-1);
    setIsBackToBack(false);
    setClearingLines([]);
    setLastActionText(null);

    setStats({
      singles: 0,
      doubles: 0,
      triples: 0,
      tetrises: 0,
      maxCombo: 0,
      totalPieces: 0,
      startTime: Date.now(),
      durationSeconds: 0,
    });

    sound.setLevelTempo(1);
    if (sound.bgmEnabled) {
      sound.startBgm();
    }

    const firstPieceType = initialQueue.shift()!;
    while (initialQueue.length < 5) {
      initialQueue.push(bagRef.current.shift()!);
    }
    setNextQueue(initialQueue);

    const firstPiece: ActivePiece = {
      type: firstPieceType,
      rotation: 0,
      position: getSpawnPosition(firstPieceType),
    };

    setActivePiece(firstPiece);
    activePieceRef.current = firstPiece;
    setGameState('PLAYING');
    lastDropTimeRef.current = performance.now();
  }, []);

  // Pause / Resume
  const togglePause = useCallback(() => {
    if (gameStateRef.current === 'PLAYING') {
      setGameState('PAUSED');
      sound.stopBgm();
    } else if (gameStateRef.current === 'PAUSED') {
      setGameState('PLAYING');
      if (sound.bgmEnabled) sound.startBgm();
      lastDropTimeRef.current = performance.now();
    }
  }, []);

  // Ghost and Grid settings
  const toggleGhost = useCallback(() => {
    setShowGhost((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('tetris_show_ghost', String(next));
      } catch {}
      return next;
    });
  }, []);

  const toggleGrid = useCallback(() => {
    setShowGrid((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('tetris_show_grid', String(next));
      } catch {}
      return next;
    });
  }, []);

  // Primary Game Gravity & Lock Delay Tick Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    let isSubscribed = true;

    const gameLoop = (time: number) => {
      if (!isSubscribed || gameStateRef.current !== 'PLAYING') return;

      const currentSpeed = LEVEL_SPEEDS[Math.min(levelRef.current - 1, LEVEL_SPEEDS.length - 1)];
      const piece = activePieceRef.current;

      if (piece) {
        // Check if piece can fall
        const canFall = !checkCollision(piece, matrixRef.current, { x: 0, y: 1 });

        if (canFall) {
          // Normal gravity step
          if (time - lastDropTimeRef.current >= currentSpeed) {
            setActivePiece({
              ...piece,
              position: { ...piece.position, y: piece.position.y + 1 },
            });
            lastDropTimeRef.current = time;
          }

          // If lock timer was running while falling, cancel it
          if (lockTimerRef.current) {
            clearTimeout(lockTimerRef.current);
            lockTimerRef.current = null;
          }
        } else {
          // Piece is on a surface
          if (!lockTimerRef.current) {
            lockTimerRef.current = window.setTimeout(() => {
              lockPiece();
            }, LOCK_DELAY_MS);
          }
        }
      }

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      isSubscribed = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
    };
  }, [gameState, lockPiece]);

  // Duration timer update
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const interval = setInterval(() => {
      setStats((s) => ({
        ...s,
        durationSeconds: Math.floor((Date.now() - (s.startTime || Date.now())) / 1000),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Keyboard Event Handlers with DAS (Delayed Auto Shift) & ARR (Auto Repeat Rate)
  useEffect(() => {
    const DAS = 135; // delay in ms before fast repeat starts
    const ARR = 38;  // repeat interval in ms

    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not capture if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.code;

      if (key === 'Escape' || key === 'KeyP') {
        e.preventDefault();
        togglePause();
        return;
      }

      if (gameStateRef.current !== 'PLAYING') {
        if (key === 'Space' || key === 'Enter') {
          if (gameStateRef.current === 'READY' || gameStateRef.current === 'GAME_OVER') {
            e.preventDefault();
            startGame();
          }
        }
        return;
      }

      // Handle action triggers (non-repeating or standard)
      if (e.repeat && (key === 'ArrowUp' || key === 'KeyW' || key === 'KeyX' || key === 'KeyZ' || key === 'KeyC' || key === 'ShiftLeft' || key === 'ShiftRight' || key === 'Space')) {
        return;
      }

      switch (key) {
        case 'ArrowLeft':
        case 'KeyA': {
          e.preventDefault();
          if (!keysDownRef.current['LEFT']) {
            moveHorizontal(-1);
            const intervalId = window.setTimeout(() => {
              const repeatId = window.setInterval(() => {
                moveHorizontal(-1);
              }, ARR);
              keysDownRef.current['LEFT'] = {
                ...keysDownRef.current['LEFT'],
                intervalId: repeatId,
                dasFired: true,
              };
            }, DAS);
            keysDownRef.current['LEFT'] = {
              time: Date.now(),
              dasFired: false,
              intervalId,
            };
          }
          break;
        }

        case 'ArrowRight':
        case 'KeyD': {
          e.preventDefault();
          if (!keysDownRef.current['RIGHT']) {
            moveHorizontal(1);
            const intervalId = window.setTimeout(() => {
              const repeatId = window.setInterval(() => {
                moveHorizontal(1);
              }, ARR);
              keysDownRef.current['RIGHT'] = {
                ...keysDownRef.current['RIGHT'],
                intervalId: repeatId,
                dasFired: true,
              };
            }, DAS);
            keysDownRef.current['RIGHT'] = {
              time: Date.now(),
              dasFired: false,
              intervalId,
            };
          }
          break;
        }

        case 'ArrowDown':
        case 'KeyS': {
          e.preventDefault();
          if (!keysDownRef.current['DOWN']) {
            softDrop();
            const repeatId = window.setInterval(() => {
              softDrop();
            }, 45);
            keysDownRef.current['DOWN'] = {
              time: Date.now(),
              dasFired: true,
              intervalId: repeatId,
            };
          }
          break;
        }

        case 'ArrowUp':
        case 'KeyW':
        case 'KeyX': {
          e.preventDefault();
          rotate('CW');
          break;
        }

        case 'KeyZ':
        case 'ControlLeft':
        case 'ControlRight': {
          e.preventDefault();
          rotate('CCW');
          break;
        }

        case 'Space': {
          e.preventDefault();
          hardDrop();
          break;
        }

        case 'KeyC':
        case 'ShiftLeft':
        case 'ShiftRight': {
          e.preventDefault();
          hold();
          break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.code;
      if (key === 'ArrowLeft' || key === 'KeyA') {
        const item = keysDownRef.current['LEFT'];
        if (item?.intervalId) {
          clearTimeout(item.intervalId);
          clearInterval(item.intervalId);
        }
        delete keysDownRef.current['LEFT'];
      }
      if (key === 'ArrowRight' || key === 'KeyD') {
        const item = keysDownRef.current['RIGHT'];
        if (item?.intervalId) {
          clearTimeout(item.intervalId);
          clearInterval(item.intervalId);
        }
        delete keysDownRef.current['RIGHT'];
      }
      if (key === 'ArrowDown' || key === 'KeyS') {
        const item = keysDownRef.current['DOWN'];
        if (item?.intervalId) {
          clearInterval(item.intervalId);
        }
        delete keysDownRef.current['DOWN'];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      Object.values(keysDownRef.current).forEach((item) => {
        if (item?.intervalId) {
          clearTimeout(item.intervalId);
          clearInterval(item.intervalId);
        }
      });
      keysDownRef.current = {};
    };
  }, [hardDrop, hold, moveHorizontal, rotate, softDrop, startGame, togglePause]);

  return {
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
    moveLeft: () => moveHorizontal(-1),
    moveRight: () => moveHorizontal(1),
    rotateCW: () => rotate('CW'),
    rotateCCW: () => rotate('CCW'),
    softDrop,
    hardDrop,
    hold,
    toggleGhost,
    toggleGrid,
  };
}
