import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Settings, Cpu, Zap, RotateCcw } from 'lucide-react';

const PuzzleGame = () => {
  const { addXP, setGameMode } = useGameStore();
  const [items, setItems] = useState([
    { id: 1, label: 'PWR_CORE', color: 'text-neon-cyan' },
    { id: 2, label: 'ANT_RELAY', color: 'text-neon-purple' },
    { id: 3, label: 'NAV_CHIP', color: 'text-neon-pink' },
    { id: 4, label: 'ENC_UNIT', color: 'text-white' },
  ]);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    // Correct order is 1, 2, 3, 4
    if (items[0].id === 1 && items[1].id === 2 && items[2].id === 3 && items[3].id === 4) {
      const { addXP, addResources } = useGameStore.getState();
      setIsSolved(true);
      addXP(400);
      addResources(300);
    }
  }, [items]);

  const shuffle = () => {
    setItems([...items].sort(() => Math.random() - 0.5));
    setIsSolved(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="max-w-md w-full glass-panel p-10 text-center">
        <Settings className="w-12 h-12 text-neon-cyan mx-auto mb-6 animate-spin-slow" />
        <h2 className="text-2xl font-black mb-2 italic">SATELLITE REPAIR</h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-10">Reorder components for data flow</p>

        <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-4 mb-10">
          {items.map((item) => (
            <Reorder.Item 
              key={item.id} 
              value={item}
              className="bg-white/5 border border-white/10 p-4 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-between group hover:border-neon-cyan/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Cpu className={`w-5 h-5 ${item.color}`} />
                <span className="font-mono text-sm tracking-widest">{item.label}</span>
              </div>
              <div className="flex space-x-1 opacity-20 group-hover:opacity-100 italic text-[8px]">
                <span>///</span><span>///</span>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <AnimatePresence>
          {isSolved ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-neon-cyan"
            >
              <Zap className="w-10 h-10 mx-auto mb-4 fill-neon-cyan shadow-neon-cyan" />
              <div className="text-lg font-black uppercase mb-6 tracking-widest">Circuit Stabilized</div>
              <button 
                onClick={() => setGameMode(null)}
                className="w-full interactive-button bg-neon-cyan py-4 text-black text-xs font-black uppercase tracking-[0.3em]"
              >
                Sync Complete
              </button>
            </motion.div>
          ) : (
            <button 
              onClick={shuffle}
              className="flex items-center justify-center space-x-2 mx-auto text-gray-500 hover:text-white transition-colors uppercase text-[10px] font-bold"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Randomize Array</span>
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PuzzleGame;
