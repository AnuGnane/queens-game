'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Crown, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { generateBoard, Board } from '@/utils/boardGenerator';
import VictorySplashScreen from './VictorySplashScreen';
import Link from 'next/link';

const AdvancedQueensGame: React.FC = () => {
  const [gridSize, setGridSize] = useState<number>(8);
  const [board, setBoard] = useState<Board>(() => Array(8).fill(null).map(() => Array(8).fill(null)));
  const [colorRegions, setColorRegions] = useState<number[][]>(() => Array(8).fill(null).map(() => Array(8).fill(0)));
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
  const boardRef = useRef<HTMLDivElement>(null);
  const [showVictoryScreen, setShowVictoryScreen] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const lastInteractedCell = useRef<{ row: number; col: number } | null>(null);

  useEffect(() => {
    setIsClient(true);
    generateValidBoard();
  }, []);

  const getCellFromEvent = useCallback((e: React.MouseEvent | React.Touch): { row: number; col: number } | null => {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cellSize = rect.width / gridSize;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    return (row >= 0 && row < gridSize && col >= 0 && col < gridSize) ? { row, col } : null;
  }, [gridSize]);

  const clearBoard = useCallback(() => {
    setBoard(Array(gridSize).fill(null).map(() => Array(gridSize).fill(null)));
    setHintCells([]);
    setQueenHint(null);
    setMessage('Board cleared. Start placing queens!');
  }, [gridSize]);

  const checkQueenPlacement = useCallback((row: number, col: number) => {
    if (!board || !colorRegions) return;

    const currentRegion = colorRegions[row][col];
    let isValid = true;
    let message = '';

    // Check row and column
    for (let i = 0; i < gridSize; i++) {
      if ((i !== col && board[row][i] === 'Q') || (i !== row && board[i][col] === 'Q')) {
        isValid = false;
        message = 'Invalid placement: Queens cannot be in the same row or column.';
        break;
      }
    }

    // Check diagonals
    if (isValid) {
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (board[i][j] === 'Q' && (Math.abs(i - row) === Math.abs(j - col)) && (i !== row || j !== col)) {
            isValid = false;
            message = 'Invalid placement: Queens cannot be on the same diagonal.';
            break;
          }
        }
        if (!isValid) break;
      }
    }

    // Check if there's already a queen in the same region
    if (isValid) {
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (board[i][j] === 'Q' && colorRegions[i][j] === currentRegion && (i !== row || j !== col)) {
            isValid = false;
            message = 'Invalid placement: Only one queen is allowed in each color region.';
            break;
          }
        }
        if (!isValid) break;
      }
    }

    if (!isValid) {
      setMessage(message);
    } else {
      setMessage('');
    }
  }, [board, colorRegions, gridSize]);


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
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const provideQueenHint = () => {
    if (!solution || solution.length === 0 || !board) {
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

  
  const handleCellInteraction = useCallback((row: number, col: number, isDragAction: boolean = false) => {
    if (gameCompleted || showingSolution) return;

    setBoard(prevBoard => {
      if (!prevBoard) return prevBoard;
      const newBoard = [...prevBoard.map(row => [...row])];
      
      if (isDragAction) {
        if (newBoard[row][col] !== 'X') {
          newBoard[row][col] = 'X';
        }
      } else {
        switch (newBoard[row][col]) {
          case null:
            newBoard[row][col] = 'X';
            break;
          case 'X':
            newBoard[row][col] = 'Q';
            break;
          case 'Q':
            newBoard[row][col] = null;
            break;
        }
      }
      
      return newBoard;
    });

    setQueenHint(null);
    setHintCells(prev => prev.filter(cell => cell.row !== row || cell.col !== col));
    
    // Check queen placement validity after setting the board
    setTimeout(() => {
      checkQueenPlacement(row, col);
    }, 0);
  }, [gameCompleted, showingSolution, checkQueenPlacement]);


  const checkSolution = useCallback(() => {
    if (!board || !colorRegions || board.length === 0 || colorRegions.length === 0) return;
    const rowCounts = Array(gridSize).fill(0);
    const colCounts = Array(gridSize).fill(0);
    const regionCounts = new Map<number, number>();

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (board[i] && board[i][j] === 'Q') {
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
      setShowVictoryScreen(true);
    }
  }, [board, gridSize, colorRegions]);

  useEffect(() => {
    if (board && colorRegions) {
      checkSolution();
    }
  }, [board, colorRegions, checkSolution]);

  const handleVictoryScreenClose = () => {
    setShowVictoryScreen(false);
    generateValidBoard();  // Reset the game
  };

  const provideHint = useCallback(() => {
    if (!isBoardValid || !solution || !board) {
      setMessage('This board has no valid solution. Please reset the game.');
      return;
    }

    const validXPlacements: {row: number, col: number}[] = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (board[row][col] === null && solution[row][col] !== 'Q') {
          // Check if this position is not under attack by any existing queen
          let isValidXPlacement = true;
          
          // Check row and column
          for (let i = 0; i < gridSize; i++) {
            if (board[row][i] === 'Q' || board[i][col] === 'Q') {
              isValidXPlacement = false;
              break;
            }
          }
          
          // Check diagonals
          if (isValidXPlacement) {
            for (let i = 0; i < gridSize; i++) {
              for (let j = 0; j < gridSize; j++) {
                if (board[i][j] === 'Q' && Math.abs(i - row) === Math.abs(j - col)) {
                  isValidXPlacement = false;
                  break;
                }
              }
              if (!isValidXPlacement) break;
            }
          }

          if (isValidXPlacement) {
            validXPlacements.push({row, col});
          }
        }
      }
    }

    if (validXPlacements.length > 0) {
      const hintCells = validXPlacements.sort(() => 0.5 - Math.random()).slice(0, 3);
      setHintCells(hintCells);
      setMessage(`Highlighted ${hintCells.length} cell${hintCells.length > 1 ? 's' : ''} where you can safely place X${hintCells.length > 1 ? 's' : ''}.`);
    } else {
      setMessage('No valid positions for X marks. Try moving some queens or X marks.');
    }
  }, [isBoardValid, solution, gridSize, board]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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

  const handleGridSizeChange = useCallback((newSize: string) => {
    const size = parseInt(newSize, 10);
    setGridSize(size);
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Use setTimeout to ensure the UI updates before starting the generation process
    setTimeout(() => {
      const result = generateBoard(size);
      if (result) {
        const { regions, solution } = result;
        setColorRegions(regions);
        setSolution(solution);
        setBoard(Array(size).fill(null).map(() => Array(size).fill(null)));
        setHintCells([]);
        setQueenHint(null);
        setIsBoardValid(true);
        setMessage('The board is valid and has a solution. Good luck!');
        setGameCompleted(false);
        setTimer(0);
        setShowingSolution(false);
      } else {
        setMessage('Failed to generate a valid board. Please try again.');
      }
      setIsGenerating(false);
    }, 100);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseDown(true);
    const cell = getCellFromEvent(e);
    if (cell) {
      handleCellInteraction(cell.row, cell.col);
      lastInteractedCell.current = cell;
    }
  }, [handleCellInteraction, getCellFromEvent]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMouseDown) {
      const cell = getCellFromEvent(e);
      if (cell && (cell.row !== lastInteractedCell.current?.row || cell.col !== lastInteractedCell.current?.col)) {
        handleCellInteraction(cell.row, cell.col, true);
        lastInteractedCell.current = cell;
      }
    }
  }, [isMouseDown, handleCellInteraction, getCellFromEvent]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    lastInteractedCell.current = null;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const cell = getCellFromEvent(e.touches[0]);
    if (cell) {
      handleCellInteraction(cell.row, cell.col);
      lastInteractedCell.current = cell;
    }
  }, [handleCellInteraction, getCellFromEvent]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();  // Prevent scrolling
    const cell = getCellFromEvent(e.touches[0]);
    if (cell && (cell.row !== lastInteractedCell.current?.row || cell.col !== lastInteractedCell.current?.col)) {
      handleCellInteraction(cell.row, cell.col, true);
      lastInteractedCell.current = cell;
    }
  }, [handleCellInteraction, getCellFromEvent]);

  const handleTouchEnd = useCallback(() => {
    lastInteractedCell.current = null;
  }, []);


  const getCellSize = useCallback(() => {
    if (typeof window === 'undefined') return 40; // Default size for SSR
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const maxBoardSize = Math.min(screenWidth - 40, screenHeight - 200, 500); // Consider height, 20px padding on each side, max 500px
    return Math.floor((maxBoardSize - gridSize - 1) / gridSize); // Subtract gridSize - 1 for gaps and 1 for outer border
  }, [gridSize]);

  const getRegionColor = useCallback((regionId: number): string => {
    const colors = [
      'bg-purple-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400',
      'bg-red-400', 'bg-pink-400', 'bg-indigo-400', 'bg-orange-400',
      'bg-teal-400', 'bg-cyan-400'
    ];
    return colors[regionId % colors.length];
  }, []);

  const getBorderClasses = useCallback((rowIndex: number, colIndex: number): string => {
    let classes = '';
    if (rowIndex === 0 || colorRegions[rowIndex][colIndex] !== colorRegions[rowIndex - 1][colIndex]) {
      classes += ' border-t-2';
    }
    if (colIndex === 0 || colorRegions[rowIndex][colIndex] !== colorRegions[rowIndex][colIndex - 1]) {
      classes += ' border-l-2';
    }
    if (rowIndex === gridSize - 1 || colorRegions[rowIndex][colIndex] !== colorRegions[rowIndex + 1]?.[colIndex]) {
      classes += ' border-b-2';
    }
    if (colIndex === gridSize - 1 || colorRegions[rowIndex][colIndex] !== colorRegions[rowIndex][colIndex + 1]) {
      classes += ' border-r-2';
    }
    return classes;
  }, [colorRegions, gridSize]);

  if (!isClient || !board || !colorRegions) {
    return <div>Loading...</div>;
  }

  const cellSize = getCellSize();
  const boardSize = cellSize * gridSize + (gridSize - 1); // Include gaps in board size

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 overflow-x-hidden">
      <Card className="w-full max-w-2xl mb-4">
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
        </CardContent>
      </Card>

      <div className="relative border-2 border-black" style={{ width: `${boardSize + 2}px`, height: `${boardSize + 2}px` }}>
        {isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Progress value={generationProgress} className="w-full mb-4" />
            <p className="text-center">Generating valid board...</p>
          </div>
        ) : (
          <div 
            ref={boardRef}
            className="absolute inset-0 grid touch-none select-none"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
              gap: '1px',
              backgroundColor: '#000', // Black color for grid lines
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    flex items-center justify-center cursor-pointer
                    ${getRegionColor(colorRegions[rowIndex]?.[colIndex] ?? 0)}
                    ${getBorderClasses(rowIndex, colIndex)}
                    ${hintCells.some(h => h.row === rowIndex && h.col === colIndex) ? 'ring-2 ring-inset ring-red-500' : ''}
                    ${queenHint && queenHint.row === rowIndex && queenHint.col === colIndex ? 'ring-4 ring-inset ring-black' : ''}
                    border-black transition-all duration-200
                  `}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                  }}
                >
                  {cell === 'Q' && <Crown className="w-3/4 h-3/4 text-black" />}
                  {cell === 'X' && <X className="w-3/4 h-3/4 text-black" />}
                </div>
              ))
            )}
          </div>
        )}
      </div>


      <Card className="w-full max-w-2xl mt-4">
        <CardContent>
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
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
          {message && (
            <Alert>
              <AlertTitle>Game Status</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <VictorySplashScreen 
        isVisible={showVictoryScreen} 
        onClose={handleVictoryScreenClose}
        time={formatTime(timer)}
      />
    </div>
  );
};

export default AdvancedQueensGame;