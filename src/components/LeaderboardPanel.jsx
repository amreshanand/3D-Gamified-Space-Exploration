import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Users, Star, Trophy, X, Shield, Medal } from 'lucide-react';

const LeaderboardPanel = ({ onClose }) => {
  const { leaderboard, rank, xp } = useGameStore();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-10"
    >
      <div className="max-w-4xl w-full glass-panel p-12 relative overflow-hidden border-t-2 border-neon-cyan">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
          <X className="w-8 h-8" />
        </button>

        <div className="flex items-center space-x-6 mb-12">
           <div className="p-4 bg-neon-cyan/20 rounded-2xl">
              <Trophy className="w-10 h-10 text-neon-cyan drop-shadow-neon-cyan" />
           </div>
           <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Galactic Standings</h2>
              <p className="text-[10px] text-gray-500 font-bold tracking-[0.5em] mt-2 uppercase">Deep Space Explorer Network</p>
           </div>
        </div>

        <div className="space-y-3">
          {leaderboard.map((u, i) => (
            <motion.div 
              key={u.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-2xl flex items-center justify-between transition-all ${i === 0 ? 'bg-neon-cyan/10 border border-neon-cyan/30' : 'bg-white/5 border border-white/5'}`}
            >
              <div className="flex items-center space-x-6">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black italic ${i === 0 ? 'bg-neon-cyan text-black' : 'bg-white/5 text-gray-500'}`}>
                    {i + 1}
                 </div>
                 <div>
                    <div className="text-sm font-black uppercase tracking-widest">{u.name}</div>
                    <div className="text-[9px] text-gray-500 uppercase">{u.rank}</div>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-xl font-black font-orbitron text-white">{u.xp.toLocaleString()}</div>
                 <div className="text-[8px] text-neon-cyan uppercase font-bold tracking-widest">EXP_DATA_STABLE</div>
              </div>
            </motion.div>
          ))}

          {/* Current User Row */}
          <div className="mt-12 p-6 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-between italic">
             <div className="flex items-center space-x-6">
                <Medal className="w-8 h-8 text-neon-pink" />
                <div>
                   <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Your Current Status</div>
                   <div className="text-[10px] text-neon-pink uppercase">Global Rank: #42 // Tracking...</div>
                </div>
             </div>
             <div className="text-right">
                <div className="text-2xl font-black font-orbitron text-neon-cyan">{xp.toLocaleString()}</div>
                <div className="text-[8px] text-gray-500 uppercase">Registered Rank: {rank}</div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeaderboardPanel;
