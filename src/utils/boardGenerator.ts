// utils/boardGenerator.ts

export type CellValue = 'Q' | 'X' | null;
export type Board = CellValue[][];

function generateColorRegions(gridSize: number): number[][] {
  const regions: number[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
  const regionSizes: number[] = Array(gridSize).fill(1);
  let remainingCells = gridSize * gridSize - gridSize;

  // Initialize each region with one cell
  for (let i = 0; i < gridSize; i++) {
    let placed = false;
    while (!placed) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      if (regions[row][col] === 0) {
        regions[row][col] = i + 1;
        placed = true;
      }
    }
  }

  // Expand regions
  while (remainingCells > 0) {
    const regionToExpand = Math.floor(Math.random() * gridSize) + 1;
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    let expanded = false;
    for (let row = 0; row < gridSize && !expanded; row++) {
      for (let col = 0; col < gridSize && !expanded; col++) {
        if (regions[row][col] === regionToExpand) {
          for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize && regions[newRow][newCol] === 0) {
              regions[newRow][newCol] = regionToExpand;
              regionSizes[regionToExpand - 1]++;
              remainingCells--;
              expanded = true;
              break;
            }
          }
        }
      }
    }
  }

  return regions;
}

function findSolution(regions: number[][], gridSize: number): Board | null {
  const board: Board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
  const usedRegions = new Set<number>();

  function isValid(row: number, col: number): boolean {
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

    // Check region
    return !usedRegions.has(regions[row][col]);
  }

  function solve(row: number): boolean {
    if (row === gridSize) return true;
    const cols = Array.from({length: gridSize}, (_, i) => i).sort(() => Math.random() - 0.5);
    for (const col of cols) {
      if (isValid(row, col)) {
        board[row][col] = 'Q';
        usedRegions.add(regions[row][col]);
        if (solve(row + 1)) return true;
        board[row][col] = null;
        usedRegions.delete(regions[row][col]);
      }
    }
    return false;
  }

  return solve(0) ? board : null;
}

export function generateBoard(gridSize: number): { regions: number[][], solution: Board } | null {
  let attempts = 0;
  const maxAttempts = 1000;

  while (attempts < maxAttempts) {
    attempts++;
    const regions = generateColorRegions(gridSize);
    const solution = findSolution(regions, gridSize);
    if (solution) {
      return { regions, solution };
    }
  }

  return null;
}