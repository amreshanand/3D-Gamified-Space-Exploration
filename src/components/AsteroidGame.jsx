import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Shield, AlertTriangle, Crosshair, X } from 'lucide-react';

const AsteroidGame = () => {
  const { addXP, setGameMode } = useGameStore();
  const [isPlaying, setIsPlaying] = useState(true);
  const [shipPos, setShipPos] = useState(50); // percentage
  const [asteroids, setAsteroids] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const spawnAsteroid = useCallback(() => {
    const newAsteroid = {
      id: Math.random(),
      left: Math.random() * 90 + 5,
      top: -10,
      size: Math.random() * 20 + 20,
    };
    setAsteroids(prev => [...prev, newAsteroid]);
  }, []);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      setAsteroids(prev => {
        const next = prev.map(a => ({ ...a, top: a.top + 2 }));
        
        // Collision Detection
        const hit = next.find(a => 
          a.top > 80 && a.top < 95 && 
          Math.abs(a.left - shipPos) < 10
        );
        
        if (hit) {
          const { addXP, addResources } = useGameStore.getState();
          setGameOver(true);
          setScore(s => {
            addXP(Math.floor(s / 10));
            addResources(Math.floor(s / 5));
            return s;
          });
          return next;
        }

        return next.filter(a => a.top < 110);
      });
      
      setScore(s => s + 1);
    }, 20);

    const spawnInterval = setInterval(spawnAsteroid, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(spawnInterval);
    };
  }, [isPlaying, gameOver, shipPos, spawnAsteroid]);

  const handleMouseMove = (e) => {
    if (gameOver) return;
    const container = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - container.left) / container.width) * 100;
    setShipPos(Math.min(95, Math.max(5, x)));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div 
        className="relative w-[500px] h-[700px] glass-panel overflow-hidden cursor-none"
        onMouseMove={handleMouseMove}
      >
        <div className="absolute top-4 left-4 font-mono text-neon-cyan text-xs">
          TELEMETRY: SECTOR_7 // SCORE: {score}
        </div>
        
        {/* Game Area */}
        <AnimatePresence>
          {asteroids.map(a => (
            <motion.div
              key={a.id}
              className="absolute bg-white/10 border border-white/20 rounded-full flex items-center justify-center"
              style={{
                left: `${a.left}%`,
                top: `${a.top}%`,
                width: a.size,
                height: a.size,
              }}
            >
              <AlertTriangle className="w-1/2 h-1/2 text-gray-700" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Ship */}
        <motion.div
          animate={{ x: `${shipPos}%` }}
          className="absolute bottom-10 left-0 -translate-x-1/2 flex flex-col items-center"
        >
          <div className="w-10 h-10 border-2 border-neon-cyan rounded-lg rotate-45 flex items-center justify-center bg-neon-cyan/20">
            <Shield className="w-6 h-6 text-white -rotate-45" />
          </div>
          <div className="w-1 h-10 bg-gradient-to-t from-transparent to-neon-cyan mt-1 blur-[1px]" />
        </motion.div>

        {/* Scanlines Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

        <AnimatePresence>
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-red-950/80 backdrop-blur-sm flex items-center justify-center p-10 text-center"
            >
              <div>
                <Crosshair className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h2 className="text-3xl font-black mb-2 italic">HUL INTEGRITY BREACH</h2>
                <p className="text-xs text-gray-400 uppercase tracking-[0.3em] mb-10">Data recovery: {Math.floor(score / 10)} XP</p>
                <button 
                  onClick={() => setGameMode(null)}
                  className="interactive-button border border-red-500 px-10 py-3 text-red-500 font-bold uppercase tracking-widest hover:bg-red-500/20"
                >
                  Return to Hub
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AsteroidGame;
