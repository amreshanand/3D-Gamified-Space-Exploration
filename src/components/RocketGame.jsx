import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Rocket, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

const RocketGame = () => {
  const { addXP, setGameMode } = useGameStore();
  const [gameState, setGameState] = useState('aiming'); // aiming, launching, landed, failed
  const [power, setPower] = useState(0);
  const [goingUp, setGoingUp] = useState(true);
  const [score, setScore] = useState(0);
  
  const powerRef = useRef(null);

  useEffect(() => {
    if (gameState !== 'aiming') return;

    const interval = setInterval(() => {
      setPower(p => {
        if (p >= 100) { setGoingUp(false); return 100; }
        if (p <= 0) { setGoingUp(true); return 0; }
        return goingUp ? p + 5 : p - 5;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [gameState, goingUp]);

  const handleLaunch = () => {
    if (gameState !== 'aiming') return;
    
    setGameState('launching');
    
    // Success zone is 80-95
    setTimeout(() => {
      const { addXP, addResources } = useGameStore.getState();
      if (power >= 80 && power <= 95) {
        setGameState('landed');
        setScore(Math.floor(power * 10));
        addXP(500);
        addResources(200);
      } else {
        setGameState('failed');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="max-w-md w-full glass-panel p-8 text-center relative overflow-hidden">
        {/* Animated Background Pulse */}
        <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/5 to-transparent pointer-events-none" />

        <h2 className="text-3xl font-black mb-2 italic">PRECISION LAUNCH</h2>
        <p className="text-gray-400 text-xs mb-10 uppercase tracking-[0.2em]">Synchronize thrust for orbital insertion</p>

        <div className="relative h-64 mb-10 flex items-end justify-center px-10">
          {/* Power Meter */}
          <div className="absolute left-0 h-full w-4 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="absolute bottom-0 w-full bg-gradient-to-t from-neon-cyan to-neon-blue transition-all duration-75"
              style={{ height: `${power}%` }}
            />
            {/* Target Zone */}
            <div className="absolute bottom-[80%] h-[15%] w-full bg-neon-pink/40 border-y border-neon-pink animate-pulse" />
          </div>

          <AnimatePresence mode="wait">
            {gameState === 'aiming' && (
              <motion.div 
                key="rocket-aim"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <Rocket className="w-20 h-20 text-white mb-4" />
                <div className="text-[10px] font-bold text-neon-cyan animate-pulse">READY FOR IGNITION</div>
              </motion.div>
            )}

            {gameState === 'launching' && (
              <motion.div 
                key="rocket-launch"
                initial={{ y: 0 }}
                animate={{ y: -300, opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeIn" }}
                className="flex flex-col items-center"
              >
                <Rocket className="w-20 h-20 text-neon-cyan shadow-neon-cyan" />
                <div className="mt-4 flex space-x-1">
                  {[1,2,3].map(i => <div key={i} className="w-1 h-8 bg-orange-500 animate-bounce" style={{animationDelay: `${i*0.1}s`}} />)}
                </div>
              </motion.div>
            )}

            {gameState === 'landed' && (
              <motion.div 
                key="rocket-success"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center text-neon-cyan"
              >
                <CheckCircle className="w-16 h-16 mb-4" />
                <div className="text-2xl font-black">ORBIT ACHIEVED</div>
                <div className="text-sm font-mono mt-2">+500 XP // DATA SYNCED</div>
              </motion.div>
            )}

            {gameState === 'failed' && (
              <motion.div 
                key="rocket-fail"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center text-red-500"
              >
                <AlertTriangle className="w-16 h-16 mb-4" />
                <div className="text-2xl font-black">CRITICAL FAILURE</div>
                <div className="text-xs uppercase mt-2">Inconsistent Thrust Profile</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          {gameState === 'aiming' && (
            <button 
              onClick={handleLaunch}
              className="w-full interactive-button bg-neon-cyan py-4 text-black font-black uppercase tracking-widest shadow-neon-cyan"
            >
              ENGINE IGNITION
            </button>
          )}

          {(gameState === 'landed' || gameState === 'failed') && (
            <button 
              onClick={() => setGameMode(null)}
              className="w-full interactive-button border border-white/20 py-4 text-white font-black uppercase tracking-widest hover:bg-white/5"
            >
              RETURN TO CONTROL
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RocketGame;
