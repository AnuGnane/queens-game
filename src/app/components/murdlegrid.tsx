'use client';

import React, { useState, useCallback } from 'react';
import { ChevronUp, ChevronDown, Check, X, Trash2, Copy, Link, Unlink, Undo, ToggleLeft, ToggleRight } from 'lucide-react';

type CellState = 'empty' | 'cross' | 'check';
type GridState = Record<string, CellState>;

interface Grid {
  id: number;
  state: GridState;
  history: GridState[];
}

const MurdleGrid: React.FC = () => {
  const [itemCount, setItemCount] = useState<number>(3);
  const [grids, setGrids] = useState<Grid[]>([{id: 1, state: {}, history: [{}]}]);
  const [syncMode, setSyncMode] = useState<boolean>(false);
  const [autoFillEnabled, setAutoFillEnabled] = useState<boolean>(true);
  
  const increaseItemCount = () => setItemCount(prev => Math.min(prev + 1, 6));
  const decreaseItemCount = () => setItemCount(prev => Math.max(prev - 1, 2));

  const applyLogic = useCallback((gridState: GridState, itemCount: number): GridState => {
    if (!autoFillEnabled) return gridState;
    const newState = { ...gridState };
    const sections = [
      { startRow: 0, startCol: 0, endRow: itemCount - 1, endCol: itemCount - 1 },
      { startRow: 0, startCol: itemCount, endRow: itemCount - 1, endCol: itemCount * 2 - 1 },
      { startRow: itemCount, startCol: 0, endRow: itemCount * 2 - 1, endCol: itemCount - 1 }
    ];

    sections.forEach(section => {
      for (let i = section.startRow; i <= section.endRow; i++) {
        for (let j = section.startCol; j <= section.endCol; j++) {
          if (newState[`${i}-${j}`] === 'check') {
            // Mark row
            for (let col = section.startCol; col <= section.endCol; col++) {
              if (col !== j && newState[`${i}-${col}`] !== 'check') {
                newState[`${i}-${col}`] = 'cross';
              }
            }
            // Mark column
            for (let row = section.startRow; row <= section.endRow; row++) {
              if (row !== i && newState[`${row}-${j}`] !== 'check') {
                newState[`${row}-${j}`] = 'cross';
              }
            }
          }
        }
      }
    });

    return newState;
  }, [autoFillEnabled]);

  const toggleCell = useCallback((gridId: number, i: number, j: number) => {
    setGrids(prevGrids => 
      prevGrids.map(grid => {
        if (!syncMode && grid.id !== gridId) return grid;
        const key = `${i}-${j}`;
        const currentState = grid.state[key] || 'empty';
        let newState: CellState;
        if (currentState === 'empty') {
          newState = 'cross';
        } else if (currentState === 'cross') {
          newState = 'check';
        } else {
          newState = 'empty';
        }
        const updatedState = { ...grid.state, [key]: newState };
        const finalState = newState === 'check' ? applyLogic(updatedState, itemCount) : updatedState;
        return { 
          ...grid, 
          state: finalState, 
          history: [...grid.history, finalState]
        };
      })
    );
  }, [syncMode, applyLogic, itemCount]);

  const undoGrid = (gridId: number) => {
    setGrids(prevGrids =>
      prevGrids.map(grid => {
        if (!syncMode && grid.id !== gridId) return grid;
        if (grid.history.length > 1) {
          const newHistory = grid.history.slice(0, -1);
          return {
            ...grid,
            state: newHistory[newHistory.length - 1],
            history: newHistory
          };
        }
        return grid;
      })
    );
  };

  const clearGrid = (gridId: number) => {
    setGrids(prevGrids => 
      prevGrids.map(grid => 
        (!syncMode && grid.id !== gridId) ? grid : { ...grid, state: {}, history: [{}] }
      )
    );
  };

  const addGrid = () => {
    if (grids.length < 5) {
      setGrids(prev => [...prev, { id: Date.now(), state: {}, history: [{}] }]);
    }
  };

  const renderGrid = (gridId: number, gridState: GridState) => {
    const cells = [];
    
    // Add labels
    cells.push(
      <div key={`${gridId}-label-suspects`} className="absolute -top-6 left-0 w-full text-center font-bold">Suspects</div>,
      <div key={`${gridId}-label-locations`} className="absolute -right-6 top-0 h-full flex items-center justify-center font-bold" style={{writingMode: 'vertical-rl', transform: 'rotate(180deg)'}}>Locations</div>,
      <div key={`${gridId}-label-weapons`} className="absolute -left-6 top-0 h-full flex items-center justify-center font-bold" style={{writingMode: 'vertical-rl', transform: 'rotate(180deg)'}}>Weapons</div>
    );

    for (let i = 0; i < itemCount * 2; i++) {
      for (let j = 0; j < itemCount * 2; j++) {
        if (i >= itemCount && j >= itemCount) continue;
        
        const cellState = gridState[`${i}-${j}`] || 'empty';
        
        cells.push(
          <div 
            key={`${gridId}-${i}-${j}`} 
            className={`w-8 h-8 flex items-center justify-center cursor-pointer
                        border border-black
                        ${cellState === 'empty' ? 'bg-white hover:bg-gray-100' : 
                          cellState === 'check' ? 'bg-green-100' : 'bg-red-100'}`}
            onClick={() => toggleCell(gridId, i, j)}
            style={{
              gridColumn: j + 1,
              gridRow: i + 1,
            }}
          >
            {cellState === 'check' ? (
              <Check className="text-green-500" size={16} />
            ) : cellState === 'cross' ? (
              <X className="text-red-500" size={16} />
            ) : null}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 overflow-auto">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Murdle-style Grid Solver</h2>
        <div className="flex flex-wrap items-center mb-6 space-x-4">
          <div className="flex items-center mb-2 sm:mb-0">
            <span className="mr-2 text-gray-700">Items per category:</span>
            <button onClick={decreaseItemCount} className="p-1 bg-gray-200 rounded-l hover:bg-gray-300"><ChevronDown size={16} /></button>
            <span className="px-2 bg-gray-100 text-gray-800">{itemCount}</span>
            <button onClick={increaseItemCount} className="p-1 bg-gray-200 rounded-r hover:bg-gray-300"><ChevronUp size={16} /></button>
          </div>
          <button onClick={addGrid} className="p-2 bg-blue-500 text-white rounded flex items-center hover:bg-blue-600" disabled={grids.length >= 5}>
            <Copy size={16} className="mr-1" /> Add Grid
          </button>
          <button onClick={() => setSyncMode(!syncMode)} className="p-2 bg-purple-500 text-white rounded flex items-center hover:bg-purple-600">
            {syncMode ? <Link size={16} className="mr-1" /> : <Unlink size={16} className="mr-1" />}
            {syncMode ? "Sync On" : "Sync Off"}
          </button>
          <button onClick={() => setAutoFillEnabled(!autoFillEnabled)} className="p-2 bg-yellow-500 text-white rounded flex items-center hover:bg-yellow-600">
            {autoFillEnabled ? <ToggleRight size={16} className="mr-1" /> : <ToggleLeft size={16} className="mr-1" />}
            Auto-fill {autoFillEnabled ? "On" : "Off"}
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {grids.map(grid => (
            <div key={grid.id} className="relative mb-8">
              <div className="relative" style={{
                width: `${itemCount * 4 + 1}rem`,
                height: `${itemCount * 4 + 1}rem`,
                padding: '1rem'
              }}>
                <div className="grid" style={{ 
                  gridTemplateColumns: `repeat(${itemCount * 2}, 2rem)`,
                  gridTemplateRows: `repeat(${itemCount * 2}, 2rem)`,
                }}>
                  {renderGrid(grid.id, grid.state)}
                </div>
              </div>
              <div className="mt-2 flex space-x-2">
                <button 
                  onClick={() => clearGrid(grid.id)} 
                  className="p-2 bg-red-500 text-white rounded flex items-center hover:bg-red-600"
                >
                  <Trash2 size={16} className="mr-1" /> Clear
                </button>
                <button 
                  onClick={() => undoGrid(grid.id)} 
                  className="p-2 bg-gray-500 text-white rounded flex items-center hover:bg-gray-600"
                  disabled={grid.history.length <= 1}
                >
                  <Undo size={16} className="mr-1" /> Undo
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-700">
          {"Click cells to toggle: X (impossible) -> ✓ (confirmed) -> empty. Add up to 5 grids."}
          {syncMode ? " Sync mode ON: changes apply to all grids." : " Sync mode OFF: changes apply to individual grids."}
          {autoFillEnabled ? " Auto-fill is ON." : " Auto-fill is OFF."}
        </p>
      </div>
    </div>
  );
};

export default MurdleGrid;