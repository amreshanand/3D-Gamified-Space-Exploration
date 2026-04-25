import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Award, Star, Zap, HardDrive, X } from 'lucide-react';

const ACHIEVEMENTS = [
  { id: 'first_contact', name: 'First Contact', desc: 'Visit the Moon Base', icon: Star, xp: 100 },
  { id: 'master_pilot', name: 'Elite Pilot', desc: 'Complete 5 rocket launches', icon: Zap, xp: 500 },
  { id: 'galaxy_traveler', name: 'Deep Space Key', desc: 'Unlock Mars Frontier', icon: HardDrive, xp: 1000 },
];

const RewardVault = ({ onClose }) => {
  const { xp, rank, level } = useGameStore();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
    >
      <div className="max-w-4xl w-full glass-panel p-10 relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Left: Profile Summary */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-white/10 flex items-center justify-center relative group">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neon-cyan/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Award className="w-24 h-24 text-neon-cyan drop-shadow-neon-cyan" />
            </div>
            
            <div>
              <div className="text-xs text-neon-cyan font-black tracking-widest uppercase mb-1">{rank}</div>
              <h2 className="text-3xl font-black italic">COMMANDER ARIS</h2>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400">
                <span>Total Experience</span>
                <span>{xp} XP</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-neon-cyan w-3/4 shadow-neon-cyan" />
              </div>
            </div>
          </div>

          {/* Right: Achievements Grid */}
          <div className="w-full md:w-2/3">
            <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
              <Star className="w-5 h-5 text-neon-pink fill-neon-pink" />
              <span>COLLECTED ARTIFACTS</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map((ach) => (
                <div key={ach.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center space-x-4 grayscale hover:grayscale-0 transition-all hover:bg-white/10 cursor-help">
                  <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center">
                    <ach.icon className="w-6 h-6 text-neon-cyan" />
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase">{ach.name}</div>
                    <div className="text-[10px] text-gray-500">{ach.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RewardVault;
