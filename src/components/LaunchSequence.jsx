import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, Radio, Terminal } from 'lucide-react';

const LaunchSequence = ({ onComplete, planetName }) => {
  const [phase, setPhase] = useState('countdown'); // countdown, ignition, ascent, orbit, transition
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (phase === 'countdown') {
      if (count > 0) {
        const timer = setTimeout(() => setCount(count - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase('ignition');
      }
    }

    if (phase === 'ignition') {
      setTimeout(() => setPhase('ascent'), 2000);
    }

    if (phase === 'ascent') {
      setTimeout(() => setPhase('orbit'), 3000);
    }

    if (phase === 'orbit') {
      setTimeout(() => onComplete(), 2000);
    }
  }, [phase, count]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden">
      {/* Background Starfield Motion */}
      <div className={`absolute inset-0 transition-all duration-[3000ms] ${phase === 'ascent' ? 'scale-[3] opacity-30' : 'scale-1 opacity-10'}`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50" />
      </div>

      <AnimatePresence mode="wait">
        {phase === 'countdown' && (
          <motion.div 
            key="countdown"
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-center"
          >
            <div className="text-neon-cyan text-xs font-black tracking-[1em] mb-4 uppercase italic">T-Minus</div>
            <div className="text-[15rem] font-black font-orbitron leading-none text-white drop-shadow-neon-cyan">
              {count}
            </div>
            <div className="mt-8 flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-1 w-8 rounded-full transition-colors ${i < 5 - count ? 'bg-neon-cyan' : 'bg-white/10'}`} />
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'ignition' && (
          <motion.div 
            key="ignition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -2, 2, -1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.1 }}
            >
              <Rocket className="w-32 h-32 text-white" />
            </motion.div>
            <div className="mt-10 text-orange-500 font-black tracking-widest animate-pulse">IGNITION DETECTED</div>
            <div className="text-[10px] text-gray-500 mt-2 font-mono">THRUST: 104% // FUEL: NOMINAL</div>
          </motion.div>
        )}

        {phase === 'ascent' && (
          <motion.div 
            key="ascent"
            initial={{ y: 500, opacity: 0 }}
            animate={{ y: -500, opacity: 1 }}
            transition={{ duration: 3, ease: "easeIn" }}
            className="flex flex-col items-center"
          >
            <Rocket className="w-24 h-24 text-neon-cyan drop-shadow-neon-cyan rotate-[-45deg]" />
            <div className="mt-40 w-1 bg-gradient-to-t from-transparent via-neon-cyan to-white h-96 blur-sm" />
          </motion.div>
        )}
        
        {phase === 'orbit' && (
          <motion.div 
            key="orbit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Radio className="w-16 h-16 text-neon-cyan mx-auto mb-6 animate-pulse" />
            <div className="text-2xl font-black italic mb-2">ORBITAL INSERTION SUCCESS</div>
            <div className="text-xs text-gray-400 uppercase tracking-widest">Approaching {planetName} Sector...</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sci-Fi HUD Overlays */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5 m-10 flex flex-col justify-between p-10 font-mono text-[10px] text-neon-cyan/40">
        <div className="flex justify-between uppercase">
          <div>Mission: Deep_Space_Scan</div>
          <div>Vibe: Cinematic_Launch_v1.0</div>
        </div>
        <div className="flex justify-between items-end italic uppercase">
          <div className="flex items-center space-x-2">
            <Terminal className="w-3 h-3" />
            <span>Streaming Telemetry Data [88.2kbps]</span>
          </div>
          <div>Coord: 12.44 // 99.02 // 03.11</div>
        </div>
      </div>
    </div>
  );
};

export default LaunchSequence;
