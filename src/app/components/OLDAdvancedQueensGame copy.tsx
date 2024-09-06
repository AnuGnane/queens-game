'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Crown, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { generateBoard, Board } from '@/utils/boardGenerator';

const AdvancedQueensGame: React.FC = () => {
  const [gridSize, setGridSize] = useState<number>(8);
  const [board, setBoard] = useState<Board>([]);
  const [colorRegions, setColorRegions] = useState<number[][]>([]);
  const [message, setMessage] = useState<string>('');
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [solution, setSolution] = useState<Board>([]);
  const [showingSolution, setShowingSolution] = useState<boolean>(false);
  const [isBoardValid, setIsBoardValid] = useState<boolean>(true);
  const [hintCells, setHintCells] = useState<{row: number, col: number}[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [queenHint, setQueenHint] = useState<{row: number, col: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const [lastInteractionTime, setLastInteractionTime] = useState<number>(0);
  const interactionDelay = 500; // 500ms delay for queen placement
  
  

  const clearBoard = useCallback(() => {
    setBoard(Array(gridSize).fill(null).map(() => Array(gridSize).fill(null)));
    setHintCells([]);
    setQueenHint(null);
    setMessage('Board cleared. Start placing queens!');
  }, [gridSize]);

  const generateValidBoard = useCallback(() => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setMessage('Generating board...');

    const generate = () => {
      const result = generateBoard(gridSize);
      if (result) {
        const { regions, solution } = result;
        setColorRegions(regions);
        setSolution(solution);
        clearBoard();
        setIsBoardValid(true);
        setMessage('The board is valid and has a solution. Good luck!');
        setIsGenerating(false);
        setGameCompleted(false);
        setTimer(0);
        setShowingSolution(false);
      } else {
        setMessage('Failed to generate a valid board. Please try again.');
        setIsGenerating(false);
      }
    };

    setTimeout(generate, 100);
  }, [gridSize, clearBoard]);

  useEffect(() => {
    generateValidBoard();
  }, [generateValidBoard]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const provideQueenHint = () => {
    if (!solution || solution.length === 0) {
      setMessage('No solution available for queen hint.');
      return;
    }

    const emptyPositions = solution.flatMap((row, rowIndex) => 
      row.map((cell, colIndex) => ({ row: rowIndex, col: colIndex, value: cell }))
    ).filter(pos => pos.value === 'Q' && board[pos.row][pos.col] !== 'Q');

    if (emptyPositions.length === 0) {
      setMessage('All queens are already correctly placed!');
      return;
    }

    const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    setQueenHint({ row: randomPosition.row, col: randomPosition.col });
    setMessage('A queen hint has been provided. The highlighted cell shows a correct queen position.');
  };

  const isQueenPlacementValid = (row: number, col: number): boolean => {
    const currentRegion = colorRegions[row][col];

    // Check row and column
    for (let i = 0; i < gridSize; i++) {
      if (board[row][i] === 'Q' || board[i][col] === 'Q') return false;
    }

    // Check diagonals
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (board[i][j] === 'Q' && (Math.abs(i - row) === Math.abs(j - col))) return false;
      }
    }

    // Check if there's already a queen in the same region
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (board[i][j] === 'Q' && colorRegions[i][j] === currentRegion) {
          return false;
        }
      }
    }

    return true;
  };

  const handleCellInteraction = (row: number, col: number, forceX: boolean = false) => {
    if (gameCompleted || showingSolution) return;
  
    const currentTime = new Date().getTime();
    const newBoard = [...board];
  
    if (forceX) {
      // If forceX is true (dragging), always place or keep an X
      newBoard[row][col] = 'X';
    } else {
      // Normal click interactions
      if (newBoard[row][col] === null) {
        // Empty cell: place an X
        newBoard[row][col] = 'X';
        setLastInteractionTime(currentTime);
      } else if (newBoard[row][col] === 'X') {
        if (currentTime - lastInteractionTime < interactionDelay) {
          // Quick click on X: remove it
          newBoard[row][col] = null;
        } else if (isQueenPlacementValid(row, col)) {
          // Delayed click on X: place a Queen if valid
          newBoard[row][col] = 'Q';
        } else {
          setMessage('Invalid queen placement. Check row, column, diagonal, and color region.');
          return;
        }
      } else if (newBoard[row][col] === 'Q') {
        // Queen placed: remove it (back to empty)
        newBoard[row][col] = null;
      }
      setLastInteractionTime(currentTime);
    }
  
    setBoard(newBoard);
    setQueenHint(null);
    setHintCells(prev => prev.filter(cell => cell.row !== row || cell.col !== col));
    checkSolution();
  };


  const checkSolution = () => {
    const rowCounts = Array(gridSize).fill(0);
    const colCounts = Array(gridSize).fill(0);
    const regionCounts = new Map<number, number>();

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (board[i][j] === 'Q') {
          rowCounts[i]++;
          colCounts[j]++;
          const region = colorRegions[i][j];
          regionCounts.set(region, (regionCounts.get(region) || 0) + 1);
        }
      }
    }

    if (rowCounts.every(count => count === 1) && 
        colCounts.every(count => count === 1) && 
        Array.from(regionCounts.values()).every(count => count === 1)) {
      setMessage('Congratulations! You solved the puzzle!');
      setGameCompleted(true);
    }
  };

  const provideHint = () => {
    if (!isBoardValid || !solution) {
      setMessage('This board has no valid solution. Please reset the game.');
      return;
    }

    const incorrectPlacements: {row: number, col: number}[] = [];
    const missingQueens: {row: number, col: number}[] = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (board[row][col] === 'Q' && solution[row][col] !== 'Q') {
          incorrectPlacements.push({row, col});
        } else if (board[row][col] !== 'Q' && solution[row][col] === 'Q') {
          missingQueens.push({row, col});
        }
      }
    }

    if (incorrectPlacements.length > 0) {
      const hintCells = incorrectPlacements.slice(0, 3);
      setHintCells(hintCells);
      setMessage(`${hintCells.length} incorrect queen placement${hintCells.length > 1 ? 's' : ''} highlighted. Try moving ${hintCells.length > 1 ? 'them' : 'it'}.`);
    } else if (missingQueens.length > 0) {
      const hintCells = missingQueens.sort(() => 0.5 - Math.random()).slice(0, 3);
      setHintCells(hintCells);
      setMessage(`Highlighted ${hintCells.length} cell${hintCells.length > 1 ? 's' : ''} where queen${hintCells.length > 1 ? 's' : ''} can be placed.`);
    } else {
      setMessage('Great job! All queens are correctly placed.');
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };


  const getRegionColor = (regionId: number): string => {
    const colors = [
      'bg-purple-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400',
      'bg-red-400', 'bg-pink-400', 'bg-indigo-400', 'bg-orange-400',
      'bg-teal-400', 'bg-cyan-400'
    ];
    return colors[regionId % colors.length];
  };

  const toggleSolution = () => {
    if (solution.length === 0) {
      setMessage("This puzzle configuration has no valid solution.");
      return;
    }
    setShowingSolution(!showingSolution);
    setBoard(showingSolution ? Array(gridSize).fill(null).map(() => Array(gridSize).fill(null)) : solution);
    setHintCells([]);
  };

  const handleGridSizeChange = (newSize: string) => {
    const size = parseInt(newSize, 10);
    setGridSize(size);
    generateValidBoard();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleDragStart(e);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    if (e.touches.length > 0) {
      handleDragStart(e.touches[0]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) handleDrag(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging && e.touches.length > 0) {
      handleDrag(e.touches[0]);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.Touch) => {
    const cell = getCellFromEvent(e);
    if (cell) handleCellInteraction(cell.row, cell.col, true);
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement> | React.Touch) => {
    const cell = getCellFromEvent(e);
    if (cell) handleCellInteraction(cell.row, cell.col, true);
  };

  const getCellFromEvent = (e: React.MouseEvent<HTMLDivElement> | React.Touch): { row: number; col: number } | null => {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('clientX' in e && 'clientY' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return null;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const cellSize = rect.width / gridSize;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    return (row >= 0 && row < gridSize && col >= 0 && col < gridSize) ? { row, col } : null;
  };

  const getCellSize = () => {
    if (typeof window === 'undefined') return 40; // Default size for SSR
    const screenWidth = window.innerWidth;
    const maxBoardSize = Math.min(screenWidth - 40, 500); // 20px padding on each side, max 500px
    return Math.floor(maxBoardSize / gridSize);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Advanced Queens Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-xl font-semibold">Time: {formatTime(timer)}</div>
          <div className="mb-4">
            <Select onValueChange={handleGridSizeChange} value={gridSize.toString()}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select grid size" />
              </SelectTrigger>
              <SelectContent>
                {[7, 8, 9, 10].map(size => (
                  <SelectItem key={size} value={size.toString()}>{size}x{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isGenerating ? (
            <div className="mb-4">
              <Progress value={generationProgress} className="w-full" />
              <p className="text-center mt-2">Generating valid board...</p>
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <div 
                ref={boardRef}
                className="grid gap-0.5 bg-gray-200 p-0.5 touch-none"
                style={{ 
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  width: `${getCellSize() * gridSize + (gridSize - 1) * 2}px`,
                  height: `${getCellSize() * gridSize + (gridSize - 1) * 2}px`,
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleDragEnd}
              >
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      flex items-center justify-center cursor-pointer
                      ${getRegionColor(colorRegions[rowIndex]?.[colIndex] ?? 0)}
                      ${hintCells.some(h => h.row === rowIndex && h.col === colIndex) ? 'border-2 border-red-500' : ''}
                      ${queenHint && queenHint.row === rowIndex && queenHint.col === colIndex ? 'border-4 border-black' : ''}
                      ${cell === 'X' && (new Date().getTime() - lastInteractionTime >= interactionDelay) ? 'opacity-50' : ''}
                      transition-all duration-200
                    `}
                    style={{
                      width: `${getCellSize()}px`,
                      height: `${getCellSize()}px`,
                    }}
                    onClick={() => handleCellInteraction(rowIndex, colIndex)}
                    onMouseEnter={() => cell === 'X' && setLastInteractionTime(new Date().getTime())}
                  >
                    {cell === 'Q' ? <Crown className="w-3/4 h-3/4 text-black" /> : cell === 'X' ? <X className="w-3/4 h-3/4 text-black" /> : null}
                  </div>  
                  ))
                )}
              </div>
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Button onClick={generateValidBoard} variant="default" disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Reset'}
            </Button>
            <Button onClick={clearBoard} variant="secondary">Clear Board</Button>
            <Button onClick={provideHint} variant="secondary">Hint</Button>
            <Button onClick={provideQueenHint} variant="secondary">Queen Hint</Button>
            <Button onClick={toggleSolution} variant="outline" className="flex items-center">
              {showingSolution ? "Hide Solution" : "Show Solution"}
            </Button>
          </div>
          {message && (
            <Alert>
              <AlertTitle>Game Status</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedQueensGame;