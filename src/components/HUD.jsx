import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';
import { Trophy, Zap, Shield, Rocket } from 'lucide-react';

const HUD = () => {
  const { xp, level, rank } = useGameStore();
  const xpProgress = (xp % (level * 1000)) / (level * 1000) * 100;

  return (
    <div className="fixed top-0 left-0 w-full p-8 z-50 pointer-events-none">
      <div className="flex justify-between items-start max-w-[1800px] mx-auto">
        {/* Left Side: Profile & Rank */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="glass-panel p-5 flex items-center space-x-5 pointer-events-auto relative group"
        >
          <div className="tech-accent top-0 left-0" />
          <div className="tech-accent bottom-0 right-0 rotate-180" />
          
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-cyan via-neon-blue to-neon-purple p-[2px] animate-pulse">
               <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                 <Shield className="text-neon-cyan w-6 h-6 drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]" />
               </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-neon-cyan rounded-full border-2 border-black flex items-center justify-center">
               <Activity className="w-3 h-3 text-black" />
            </div>
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
              <div className="text-[10px] text-neon-cyan font-black uppercase tracking-[0.3em]">{rank}</div>
            </div>
            <div className="text-2xl font-black font-orbitron italic tracking-tighter text-white drop-shadow-md">COMMANDER ARIS</div>
          </div>
        </motion.div>

        {/* Center: Level & XP Bar */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel p-6 w-[450px] pointer-events-auto relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-end mb-3">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1 italic">PILOT PROGRESSION</span>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-neon-cyan animate-pulse" />
                <span className="text-lg font-black uppercase tracking-widest font-orbitron">LVL {level}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-neon-cyan/70">{xp} <span className="text-gray-600">/</span> {level * 1000} XP</span>
            </div>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              className="h-full bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple shadow-[0_0_15px_rgba(0,243,255,0.5)] relative"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[scanning_2s_linear_infinite]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side: Quick Stats */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex space-x-5 pointer-events-auto"
        >
          {[
            { icon: Trophy, label: 'Badges', val: '04', color: 'text-neon-pink' },
            { icon: Rocket, label: 'Fuel', val: '88%', color: 'text-neon-cyan' }
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-5 flex flex-col items-center justify-center min-w-[100px] relative group hover:neon-border-cyan transition-all">
              <div className="tech-accent top-0 right-0 rotate-90" />
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2 group-hover:scale-110 transition-transform`} />
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">{stat.label}</span>
              <span className="text-xl font-black font-orbitron italic">{stat.val}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HUD;
