import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Target, Activity, Lock, Trophy, Zap, 
  Settings, Users, LayoutDashboard, Rocket, Shield, Navigation,
  AlertTriangle, Radio, HelpCircle, HardDrive, User, Radar
} from 'lucide-react';

import HUD from './components/HUD';
import SpaceCanvas from './components/SpaceCanvas';
import RocketGame from './components/RocketGame';
import AsteroidGame from './components/AsteroidGame';
import PuzzleGame from './components/PuzzleGame';
import MazeGame from './components/MazeGame';
import QuizGame from './components/QuizGame';
import RewardVault from './components/RewardVault';
import ProfileModule from './components/ProfileModule';
import LeaderboardPanel from './components/LeaderboardPanel';
import LaunchSequence from './components/LaunchSequence';
import { useGameStore } from './store/useGameStore';

const PLANETS_DATA = [
  { 
    id: 'hub', 
    name: 'Hub Alpha', 
    description: 'Central Command Center',
    missions: []
  },
  { 
    id: 'moon', 
    name: 'Moon Base', 
    description: 'Resource extraction and training',
    missions: [
      { id: 'm1', title: 'Repair Satellite', difficulty: 'Easy', xp: 400, rewards: '150 Materials', status: 'Available', type: 'puzzle' },
      { id: 'm2', title: 'Restore Oxygen Grid', difficulty: 'Medium', xp: 700, rewards: 'Artifact #10', status: 'Available', type: 'maze' }
    ]
  },
  { 
    id: 'mars', 
    name: 'Mars Frontier', 
    description: 'Advanced combat testing terrain',
    missions: [
      { id: 'mar1', title: 'Survive Dust Storm', difficulty: 'Hard', xp: 1200, rewards: '500 Materials', status: 'Available', type: 'asteroid' },
      { id: 'mar2', title: 'Resource Sampling', difficulty: 'Medium', xp: 800, rewards: 'Fuel Cell', status: 'Available', type: 'rocket' }
    ]
  },
  { 
    id: 'saturn', 
    name: 'Saturn Rings', 
    description: 'Precision piloting in high gravity',
    missions: [
      { id: 'sat1', title: 'Asteroid Navigation', difficulty: 'Elite', xp: 2000, rewards: 'Ring Chip', status: 'Available', type: 'asteroid' },
      { id: 'sat2', title: 'Ring Defense', difficulty: 'Hard', xp: 1400, rewards: '300 Materials', status: 'Available', type: 'rocket' }
    ]
  },
  { 
    id: 'blackhole', 
    name: 'Black Hole', 
    description: 'Singularity event horizon research',
    missions: [
      { id: 'bh1', title: 'Event Horizon Probe', difficulty: 'Galactic', xp: 5000, rewards: 'Dark Matter', status: 'Available', type: 'quiz' }
    ]
  },
];

const MissionCard = ({ planet, onStartMission }) => {
  const { isPlanetLocked, planetGates } = useGameStore();
  const locked = isPlanetLocked(planet?.id);

  if (!planet || planet.id === 'hub') return null;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed right-10 top-32 w-[26rem] z-20"
    >
      <div className="glass-panel p-10 relative overflow-hidden">
        <div className="tech-accent top-0 left-0" />
        <div className="tech-accent bottom-0 right-0 rotate-180" />
        
        {locked && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl z-[60] flex flex-col items-center justify-center text-center p-8 border border-red-500/20">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse border border-red-500/20">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-3xl font-black mb-2 leading-none italic uppercase text-red-500">Access Denied</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-[0.4em] px-4 mt-2 border-t border-white/5 pt-4">
              Clearance Level {planetGates[planet.id]} Required
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5 relative">
           <div className="flex flex-col">
              <span className="text-[9px] font-black tracking-[0.5em] text-neon-cyan/60 uppercase italic mb-2">Sector_Profile</span>
              <h2 className="text-5xl font-black italic tracking-tighter leading-none text-white">{planet.name}</h2>
           </div>
           <div className="w-12 h-12 bg-neon-cyan/5 rounded-xl flex items-center justify-center border border-neon-cyan/20">
              <Radar className="w-6 h-6 text-neon-cyan animate-pulse" />
           </div>
        </div>
        
        <div className="space-y-4 mb-10 overflow-y-auto max-h-[400px] pr-4 scrollbar-none">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-[1px] flex-1 bg-white/5" />
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.5em]">Expeditions</div>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>
          
          {planet.missions?.map((m) => (
            <motion.div 
              key={m.id}
              whileHover={{ x: 8 }}
              onClick={() => onStartMission(m)}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl group hover:bg-neon-cyan/10 hover:border-neon-cyan/40 cursor-pointer transition-all flex items-center justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan/0 group-hover:bg-neon-cyan transition-colors" />
              <div className="flex items-center space-x-5">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 group-hover:border-neon-cyan/30 transition-colors">
                  <Target className="w-6 h-6 text-neon-cyan group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="text-[12px] font-black uppercase tracking-wider text-white group-hover:text-neon-cyan transition-colors">{m.title}</div>
                  <div className="text-[9px] text-gray-500 flex items-center space-x-3 mt-1.5 uppercase font-bold tracking-widest">
                    <span className="text-neon-pink">{m.difficulty}</span>
                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                    <span>{m.xp} XP</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-neon-cyan transition-all" />
            </motion.div>
          ))}
        </div>

        <div className="bg-neon-cyan/5 border border-neon-cyan/10 rounded-2xl p-5 flex items-center justify-between pointer-events-none relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(0,243,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[scanning_10s_linear_infinite]" />
           <div className="flex items-center space-x-4 relative z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-ping" />
              <span className="text-[10px] font-mono text-neon-cyan/70 uppercase tracking-widest leading-none">Sync_Status: Optimal</span>
           </div>
           <Activity className="w-4 h-4 text-neon-cyan/40 relative z-10" />
        </div>
      </div>
    </motion.div>
  );
};

const TelemetryDashboard = () => {
  const { fuel, missionsCompleted, successRate, resources, shipUpgrades } = useGameStore();

  return (
    <div className="grid grid-cols-1 gap-4">
       <div className="glass-panel p-6 flex items-center justify-between border-l-4 border-neon-cyan relative group">
          <div className="tech-accent top-0 right-0 rotate-90" />
          <div className="flex items-center space-x-4">
             <div className="p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 group-hover:bg-neon-cyan/20 transition-all">
                <Settings className="w-5 h-5 text-neon-cyan animate-[spin_10s_linear_infinite]" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">Material_Inventory</span>
                <span className="text-[9px] font-bold text-neon-cyan/50 tracking-widest uppercase">Encryption_Enabled</span>
             </div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-3xl font-orbitron font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{resources}</span>
             <span className="text-[8px] font-mono text-gray-600">UNITS</span>
          </div>
       </div>

      {[
        { label: 'Neural Connection', val: `${fuel}%`, icon: Radio, color: 'text-neon-cyan', bg: 'bg-neon-cyan/5' },
        { label: 'Total Sorties', val: missionsCompleted, icon: Rocket, color: 'text-neon-purple', bg: 'bg-neon-purple/5' },
        { label: 'Shield Integrity', val: `${successRate}%`, icon: Shield, color: 'text-neon-pink', bg: 'bg-neon-pink/5' },
      ].map((s, i) => (
        <div key={i} className="glass-panel p-5 flex items-center justify-between border-l border-white/10 hover:bg-white/5 transition-all relative group cursor-default">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${s.bg} border border-white/5 group-hover:border-white/10 transition-colors`}>
               <s.icon className={`w-4 h-4 ${s.color} group-hover:scale-110 transition-transform`} />
            </div>
            <div>
              <div className="text-[8px] uppercase text-gray-500 font-bold tracking-[0.3em] mb-1 italic">{s.label}</div>
              <div className="text-xl font-black font-orbitron italic text-white/90">{s.val}</div>
            </div>
          </div>
          <Activity className="w-3 h-3 text-white/10 group-hover:text-white/20 transition-colors" />
        </div>
      ))}
    </div>
  );
};

function App() {
  const { selectedPlanet, setSelectedPlanet, gameMode, setGameMode, addXP, consumeFuel } = useGameStore();
  
  // App Visibility States
  const [showVault, setShowVault] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  
  // Mission Flow States
  const [isLaunching, setIsLaunching] = useState(false);
  const [activeMission, setActiveMission] = useState(null);
  
  // Live Feed
  const [eventLog, setEventLog] = useState(["Neural Array Primary Locked", "Establishing Satellite Relay..."]);
  
  const currentPlanet = PLANETS_DATA.find(p => p.id === selectedPlanet);

  useEffect(() => {
    const events = [
      "Meteor shower alert: Alpha-9 Sector",
      "Alien distress signal intercepted",
      "Solar flare interfering with telemetry",
      "Merchant ship passing Jupiter belt",
      "Atmospheric sync required on Mars",
      "Gravity fluctuation near Saturn Rings"
    ];
    const interval = setInterval(() => {
      const e = events[Math.floor(Math.random() * events.length)];
      setEventLog(prev => [e, ...prev].slice(0, 3));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleStartMission = (mission) => {
    setActiveMission(mission);
    consumeFuel(10);
    setIsLaunching(true);
  };

  const onLaunchComplete = () => {
    setIsLaunching(false);
    setGameMode(activeMission.type);
  };

  return (
    <div className="relative w-full min-h-screen text-white font-inter overflow-hidden select-none">
      {/* Cinematic Overlays */}
      <div className="scanline" />
      <div className="noise-overlay" />
      <div className="fixed inset-0 pointer-events-none border-[20px] border-white/5 z-[90]" />
      
      {/* Background 3D Layer */}
      <SpaceCanvas />

      {/* UI Overlay Layer */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div className="w-full h-full relative">
          <div className="pointer-events-auto">
            <HUD />
          </div>

          <AnimatePresence mode="wait">
            {isLaunching && <LaunchSequence onComplete={onLaunchComplete} planetName={currentPlanet?.name} />}
            {gameMode === 'rocket' && <div className="pointer-events-auto"><RocketGame /></div>}
            {gameMode === 'asteroid' && <div className="pointer-events-auto"><AsteroidGame /></div>}
            {gameMode === 'puzzle' && <div className="pointer-events-auto"><PuzzleGame /></div>}
            {gameMode === 'maze' && <div className="pointer-events-auto"><MazeGame /></div>}
            {gameMode === 'quiz' && <div className="pointer-events-auto"><QuizGame /></div>}
            
            {showVault && <div className="pointer-events-auto"><RewardVault onClose={() => setShowVault(false)} /></div>}
            {showProfile && <div className="pointer-events-auto"><ProfileModule onClose={() => setShowProfile(false)} /></div>}
            {showLeaderboard && <div className="pointer-events-auto"><LeaderboardPanel onClose={() => setShowLeaderboard(false)} /></div>}
          </AnimatePresence>

          {/* Sidebar Controls */}
          <div className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col space-y-4 pointer-events-auto">
            {[
              { icon: User, label: 'Profile', color: 'text-neon-cyan', action: () => setShowProfile(true) },
              { icon: Trophy, label: 'Vault', color: 'text-neon-pink', action: () => setShowVault(true) },
              { icon: Users, label: 'Rankings', color: 'text-neon-purple', action: () => setShowLeaderboard(true) },
              { icon: LayoutDashboard, label: 'Bridge', color: 'text-neon-cyan', action: () => setShowDashboard(!showDashboard) },
            ].map((btn, idx) => (
              <button 
                key={idx}
                onClick={btn.action} 
                className="glass-panel p-4 flex flex-col items-center hover:neon-border-cyan group transition-all relative"
              >
                <div className="tech-accent top-0 left-0" />
                <div className="tech-accent bottom-0 right-0 rotate-180" />
                <btn.icon className={`w-6 h-6 ${btn.color} group-hover:scale-110 transition-transform mb-1 shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">{btn.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {showDashboard && (
              <motion.div 
                initial={{ x: -100, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                exit={{ x: -100, opacity: 0 }} 
                className="fixed left-32 top-1/2 -translate-y-1/2 w-80 pointer-events-auto space-y-4"
              >
                <TelemetryDashboard />
                <div className="glass-panel p-6 space-y-4 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-pulse" />
                   <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="text-[10px] font-black tracking-widest text-neon-cyan uppercase flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-neon-cyan animate-ping rounded-full" />
                        <span>System Core Logs</span>
                      </div>
                      <Radar className="w-3 h-3 text-neon-cyan/50" />
                   </div>
                   <div className="space-y-3 overflow-y-auto max-h-40 pr-2 scrollbar-none">
                      {eventLog.map((log, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -5 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          className="text-[9px] font-mono text-gray-400 border-l border-white/10 pl-3 leading-tight"
                        >
                           <span className="text-neon-cyan/50 mr-2">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                           <span className="italic"> {log}</span>
                        </motion.div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedPlanet && !isLaunching && !gameMode && (
              <div className="pointer-events-auto">
                <MissionCard planet={currentPlanet} onStartMission={handleStartMission} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* World Background Title (Only Hub) */}
      {!selectedPlanet && !showVault && !showProfile && !showLeaderboard && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 w-full px-20"
        >
          <div className="relative inline-block">
            <h1 className="text-[14vw] font-black italic mb-0 bg-clip-text text-transparent bg-gradient-to-b from-white/20 via-white/5 to-transparent uppercase tracking-tighter leading-none select-none blur-[1px]">
              COSMIC
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
              <h1 className="text-[13vw] font-black italic mb-0 bg-clip-text text-transparent bg-gradient-to-b from-white/40 to-transparent uppercase tracking-tighter leading-none drop-shadow-2xl">
                COSMIC
              </h1>
            </div>
          </div>
          <div className="flex justify-center items-center space-x-16 text-[10px] font-black text-neon-cyan/40 tracking-[2em] uppercase mt-4">
             <div className="flex items-center space-x-4">
               <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-neon-cyan/30" />
               <span>Deep_Space_Network</span>
               <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-neon-cyan/30" />
             </div>
          </div>
        </motion.div>
      )}

      {selectedPlanet && !isLaunching && !gameMode && (
        <motion.button 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          whileHover={{ scale: 1.05, color: '#00f3ff' }}
          className="fixed left-1/2 -translate-x-1/2 bottom-12 z-[110] text-[10px] font-black uppercase tracking-[1em] text-white/30 transition-all italic flex flex-col items-center group" 
          onClick={() => setSelectedPlanet(null)}
        >
          <span className="mb-2 group-hover:animate-bounce">▼</span>
          [ TERMINATE_NEURAL_LINK ]
        </motion.button>
      )}
    </div>
  );
}

export default App;
 
 
