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
      className="fixed right-10 top-32 w-96 z-20"
    >
      <div className="glass-panel p-8 border-r-4 border-r-neon-cyan relative overflow-hidden">
        {locked && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl z-[60] flex flex-col items-center justify-center text-center p-6">
            <Lock className="w-12 h-12 text-neon-pink mb-4" />
            <div className="text-2xl font-black mb-1 leading-none italic uppercase">Sector Restricted</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest px-4 mt-2">
              Deep Space Clearance LVL {planetGates[planet.id]} Required
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
           <div className="flex flex-col">
              <span className="text-[9px] font-black tracking-[0.4em] text-neon-cyan/50 uppercase italic">Planet Profile</span>
              <h2 className="text-4xl font-black italic tracking-tighter leading-none">{planet.name}</h2>
           </div>
           <Radar className="w-6 h-6 text-neon-cyan animate-pulse" />
        </div>
        
        <div className="space-y-3 mb-10 overflow-y-auto max-h-[400px] pr-2 scrollbar-hide">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-4">Tactical Expeditions</div>
          {planet.missions?.map((m) => (
            <motion.div 
              key={m.id}
              whileHover={{ x: 4 }}
              onClick={() => onStartMission(m)}
              className="bg-white/5 border border-white/10 p-5 rounded-2xl group hover:bg-neon-cyan/5 hover:border-neon-cyan/30 cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-black/60 border border-white/5">
                  <Target className="w-5 h-5 text-neon-cyan" />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider">{m.title}</div>
                  <div className="text-[9px] text-gray-500 flex items-center space-x-2 mt-1">
                    <span className="text-neon-pink font-bold">{m.difficulty}</span>
                    <span className="opacity-10">|</span>
                    <span>{m.xp} XP DATA</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-800 group-hover:text-neon-cyan transition-colors" />
            </motion.div>
          ))}
        </div>

        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between pointer-events-none">
           <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              <span className="text-[9px] font-mono text-gray-500 uppercase">Atmospheric Sync: Optimal</span>
           </div>
           <Activity className="w-3 h-3 text-neon-cyan/30" />
        </div>
      </div>
    </motion.div>
  );
};

const TelemetryDashboard = () => {
  const { fuel, missionsCompleted, successRate, resources, shipUpgrades } = useGameStore();

  return (
    <div className="grid grid-cols-1 gap-3">
       <div className="glass-panel p-5 flex items-center justify-between border-l-2 border-neon-cyan">
          <div className="flex items-center space-x-3">
             <div className="p-2 rounded bg-neon-cyan/10">
                <Settings className="w-4 h-4 text-neon-cyan" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest">Resources</span>
          </div>
          <span className="text-2xl font-orbitron font-black text-white">{resources}</span>
       </div>

      {[
        { label: 'Neural Connection', val: `${fuel}%`, icon: Radio, color: 'text-neon-cyan' },
        { label: 'Total Sorties', val: missionsCompleted, icon: Rocket, color: 'text-neon-purple' },
        { label: 'Shield Integrity', val: `${successRate}%`, icon: Shield, color: 'text-neon-pink' },
      ].map((s, i) => (
        <div key={i} className="glass-panel p-4 flex items-center space-x-4 border-l border-white/5 hover:bg-white/5 transition-all">
          <s.icon className={`w-4 h-4 ${s.color}`} />
          <div>
            <div className="text-[8px] uppercase text-gray-500 font-bold tracking-widest">{s.label}</div>
            <div className="text-lg font-bold font-orbitron">{s.val}</div>
          </div>
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
          <div className="fixed left-10 top-1/2 -translate-y-1/2 flex flex-col space-y-4 pointer-events-auto">
            <button onClick={() => setShowProfile(true)} className="glass-panel p-5 flex flex-col items-center hover:neon-border-cyan group transition-all">
               <User className="w-6 h-6 text-neon-cyan group-hover:scale-110 transition-transform mb-1" />
               <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Profile</span>
            </button>
            <button onClick={() => setShowVault(true)} className="glass-panel p-5 flex flex-col items-center hover:neon-border-cyan group transition-all">
               <Trophy className="w-6 h-6 text-neon-pink group-hover:scale-110 transition-transform mb-1" />
               <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Vault</span>
            </button>
            <button onClick={() => setShowLeaderboard(true)} className="glass-panel p-5 flex flex-col items-center hover:neon-border-cyan group transition-all">
               <Users className="w-6 h-6 text-neon-purple group-hover:scale-110 transition-transform mb-1" />
               <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Rankings</span>
            </button>
            <button onClick={() => setShowDashboard(!showDashboard)} className="glass-panel p-5 flex flex-col items-center hover:neon-border-cyan group transition-all">
               <LayoutDashboard className="w-6 h-6 text-neon-cyan group-hover:scale-110 transition-transform mb-1" />
               <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Bridge</span>
            </button>
          </div>

          <AnimatePresence>
            {showDashboard && (
              <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="fixed left-32 top-1/2 -translate-y-1/2 w-80 pointer-events-auto space-y-4">
                <TelemetryDashboard />
                <div className="glass-panel p-8 space-y-6">
                   <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="text-[10px] font-black tracking-widest text-neon-cyan uppercase">System Logs</div>
                      <Target className="w-3 h-3 text-neon-cyan animate-pulse" />
                   </div>
                   <div className="space-y-4 overflow-y-auto max-h-40 pr-2 scrollbar-hide">
                      {eventLog.map((log, i) => (
                        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] font-mono text-gray-500 lowercase flex items-center space-x-3 leading-tight">
                           <div className="w-1 h-1 bg-neon-cyan rounded-full opacity-30" />
                           <span className="flex-1 italic leading-none">&gt; {log}</span>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 w-full px-20">
          <h1 className="text-[12vw] font-black italic mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/0 uppercase tracking-tighter leading-none opacity-40">
            COSMIC
          </h1>
          <div className="flex justify-center items-center space-x-20 text-[11px] font-black text-neon-cyan/30 tracking-[1.5em] uppercase">
             <span>Navigation_Active</span>
             <span>Sector_Sync_7</span>
          </div>
        </motion.div>
      )}

      {selectedPlanet && !isLaunching && !gameMode && (
        <motion.button 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="fixed left-1/2 -translate-x-1/2 bottom-12 z-[110] text-[12px] font-black uppercase tracking-[0.8em] text-white/20 hover:text-neon-cyan transition-all italic" 
          onClick={() => setSelectedPlanet(null)}
        >
          [ DISCONNECT_NEURAL_LINK ]
        </motion.button>
      )}
    </div>
  );
}

export default App;
 
 
