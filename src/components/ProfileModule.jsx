import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { User, Shield, Zap, Target, Star, X, Box, Activity } from 'lucide-react';

const SKILLS = [
  { id: 'nav', name: 'Neural Nav', desc: 'Increases mission success rate', icon: Zap },
  { id: 'phys', name: 'Heavy Plating', desc: 'Reduces fuel consumption', icon: Shield },
  { id: 'scan', name: 'Deep Scanner', desc: 'Unlocks rare mission rewards', icon: Target },
];

const ProfileModule = ({ onClose }) => {
  const { xp, rank, level, resources, shipUpgrades } = useGameStore();
  const [activeTab, setActiveTab] = useState('profile'); // profile, skills, log

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-10"
    >
      <div className="max-w-5xl w-full glass-panel p-10 relative border-t-4 border-t-neon-cyan overflow-hidden">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
          <X className="w-8 h-8" />
        </button>

        <div className="flex space-x-8 mb-12 border-b border-white/5 pb-4">
          {['profile', 'skills', 'log'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] font-black uppercase tracking-[0.5em] transition-all ${activeTab === tab ? 'text-neon-cyan' : 'text-gray-600 hover:text-gray-400'}`}
            >
              {tab}_0{tab === 'profile' ? 1 : tab === 'skills' ? 2 : 3}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex gap-12">
              <div className="w-1/3 space-y-6">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-white/10 flex items-center justify-center group overflow-hidden relative">
                   <User className="w-32 h-32 text-neon-cyan drop-shadow-neon-cyan" />
                   <div className="absolute inset-x-0 bottom-0 py-3 bg-neon-cyan text-black text-[8px] font-black uppercase text-center tracking-widest translate-y-full group-hover:translate-y-0 transition-transform">Customize Avatar</div>
                </div>
                <div className="text-center">
                  <div className="text-neon-cyan text-xs font-black tracking-widest uppercase mb-1">{rank}</div>
                  <h2 className="text-4xl font-bold italic">ARIS-7</h2>
                </div>
              </div>

              <div className="w-2/3 grid grid-cols-2 gap-6">
                {[
                  { label: 'Pilot Level', val: level, icon: Star },
                  { label: 'Exp. Earned', val: xp, icon: Zap },
                  { label: 'Resources', val: resources, icon: Box },
                  { label: 'Neural Sync', val: '98.2%', icon: Activity },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl">
                    <stat.icon className="w-5 h-5 text-neon-cyan mb-3 opacity-50" />
                    <div className="text-[10px] text-gray-500 uppercase font-black mb-1 tracking-widest">{stat.label}</div>
                    <div className="text-3xl font-black font-orbitron">{stat.val}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="grid grid-cols-3 gap-8">
              {SKILLS.map(skill => (
                <div key={skill.id} className="glass-panel p-8 flex flex-col items-center text-center group hover:bg-neon-cyan/5 transition-all">
                  <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center mb-6 group-hover:border-neon-cyan transition-colors">
                    <skill.icon className="w-8 h-8 text-neon-cyan" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{skill.name}</h3>
                  <p className="text-gray-500 text-xs mb-8">{skill.desc}</p>
                  <div className="w-full bg-white/5 h-1 rounded-full mb-6 overflow-hidden">
                    <div className="h-full bg-neon-cyan w-1/3" />
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest text-neon-cyan border border-neon-cyan/30 px-6 py-2 rounded-full hover:bg-neon-cyan hover:text-black transition-all">Level Up</button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'log' && (
             <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-4 max-h-96 overflow-y-auto pr-4 scrollbar-thin">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-xl flex justify-between items-center opacity-40">
                     <div className="flex items-center space-x-6">
                        <span className="text-gray-600 font-mono text-[10px]">#00{i}</span>
                        <div>
                           <div className="font-bold uppercase text-xs tracking-widest italic">Expedition Alpha-{i}</div>
                           <div className="text-[9px] text-gray-500">Mission Stabilized // Sector-7 // Level 01 Access</div>
                        </div>
                     </div>
                     <span className="text-[10px] font-bold text-neon-cyan">ARCHIVED</span>
                  </div>
                ))}
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProfileModule;
