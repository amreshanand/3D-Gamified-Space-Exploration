import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Rocket, Target, AlertCircle, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const GRID_SIZE = 6;
const HAZARDS = [[1,1], [2,3], [4,1], [3,4], [0,5], [5,0]];

const MazeGame = () => {
  const { addXP, addResources, setGameMode } = useGameStore();
  const [pos, setPos] = useState([0, 0]);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);

  const move = (dx, dy) => {
    if (isGameOver || isWin) return;
    
    const newX = Math.min(Math.max(0, pos[0] + dx), GRID_SIZE - 1);
    const newY = Math.min(Math.max(0, pos[1] + dy), GRID_SIZE - 1);
    
    setPos([newX, newY]);
    setMoves(m => m + 1);

    if (HAZARDS.some(([hx, hy]) => hx === newX && hy === newY)) {
      setIsGameOver(true);
    }
    
    if (newX === GRID_SIZE - 1 && newY === GRID_SIZE - 1) {
      setIsWin(true);
      addXP(800);
      addResources(400);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') move(0, -1);
      if (e.key === 'ArrowDown') move(0, 1);
      if (e.key === 'ArrowLeft') move(-1, 0);
      if (e.key === 'ArrowRight') move(1, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pos, isGameOver, isWin]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <div className="glass-panel p-8 max-w-xl w-full text-center">
        <h2 className="text-3xl font-black mb-2 italic">WORMHOLE MAZE</h2>
        <p className="text-[10px] text-neon-cyan font-bold tracking-[0.4em] mb-10 uppercase">Navigation Sync Required</p>

        <div className="flex flex-col items-center">
          <div className="grid grid-cols-6 gap-2 bg-white/5 p-4 rounded-xl border border-white/10 relative">
            {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              const isHazard = HAZARDS.some(([hx, hy]) => hx === x && hy === y);
              const isPlayer = pos[0] === x && pos[1] === y;
              const isGoal = x === GRID_SIZE -1 && y === GRID_SIZE -1;

              return (
                <div 
                  key={i} 
                  className={`w-12 h-12 rounded border flex items-center justify-center transition-all ${
                    isPlayer ? 'bg-neon-cyan shadow-neon-cyan border-white' : 
                    isHazard ? 'bg-red-950/20 border-red-950' : 
                    isGoal ? 'bg-neon-purple/40 border-neon-purple animate-pulse' : 
                    'bg-white/5 border-white/5'
                  }`}
                >
                  {isPlayer && <Rocket className="w-6 h-6 text-black rotate-[-45deg]" />}
                  {isGoal && !isPlayer && <Target className="w-5 h-5 text-neon-purple" />}
                  {isHazard && <div className="w-1 h-1 bg-red-500 rounded-full opacity-20" />}
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 w-48">
            <div />
            <button onClick={() => move(0, -1)} className="glass-panel p-3 flex justify-center"><ChevronUp /></button>
            <div />
            <button onClick={() => move(-1, 0)} className="glass-panel p-3 flex justify-center"><ChevronLeft /></button>
            <button onClick={() => move(0, 1)} className="glass-panel p-3 flex justify-center"><ChevronDown /></button>
            <button onClick={() => move(1, 0)} className="glass-panel p-3 flex justify-center"><ChevronRight /></button>
          </div>
        </div>

        <AnimatePresence>
          {(isWin || isGameOver) && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-10">
              <div className={`text-xl font-black mb-4 ${isWin ? 'text-neon-cyan' : 'text-red-500'}`}>
                {isWin ? 'STABLE TRANSIT ACHIEVED' : 'HULL COLLAPSE DETECTED'}
              </div>
              <button 
                onClick={() => setGameMode(null)}
                className="w-full interactive-button bg-white text-black py-4 font-black uppercase text-xs tracking-widest"
              >
                Return to Bridge
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MazeGame;
