import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';
import { Trophy, Zap, Shield, Rocket } from 'lucide-react';

const HUD = () => {
  const { xp, level, rank } = useGameStore();
  const xpProgress = (xp % (level * 1000)) / (level * 1000) * 100;

  return (
    <div className="fixed top-0 left-0 w-full p-6 z-50 pointer-events-none">
      <div className="flex justify-between items-start">
        {/* Left Side: Profile & Rank */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="glass-panel p-4 flex items-center space-x-4 pointer-events-auto border-l-2 border-l-neon-cyan"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center shadow-neon-cyan">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-neon-cyan font-bold uppercase tracking-widest">{rank}</div>
            <div className="text-xl font-bold font-orbitron">COMMANDER ARIS</div>
          </div>
        </motion.div>

        {/* Center: Level & XP Bar */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel p-4 w-96 pointer-events-auto"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-widest">Level {level}</span>
            </div>
            <span className="text-xs text-gray-400">{xp} / {level * 1000} XP</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-blue shadow-neon-cyan"
            />
          </div>
        </motion.div>

        {/* Right Side: Quick Stats */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex space-x-4 pointer-events-auto"
        >
          <div className="glass-panel p-4 flex flex-col items-center justify-center min-w-[80px]">
            <Trophy className="w-5 h-5 text-neon-pink mb-1" />
            <span className="text-xs font-bold uppercase">Badges</span>
            <span className="text-lg font-orbitron">04</span>
          </div>
          <div className="glass-panel p-4 flex flex-col items-center justify-center min-w-[80px]">
            <Rocket className="w-5 h-5 text-neon-cyan mb-1" />
            <span className="text-xs font-bold uppercase">Fuel</span>
            <span className="text-lg font-orbitron text-neon-cyan">88%</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HUD;
