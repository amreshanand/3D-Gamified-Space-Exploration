import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const RANKS = [
  'Cadet',
  'Pilot',
  'Commander',
  'Admiral',
  'Galactic Legend'
];

export const useGameStore = create(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      rank: 'Cadet',
      inventory: [],
      unlockedPlanets: ['moon'],
      completedMissions: [],
      selectedPlanet: null,
      gameMode: null, // null, 'rocket', 'asteroid', 'puzzle'
      
      planetGates: {
        'moon': 0,
        'mars': 3,
        'saturn': 5,
        'blackhole': 10
      },

      // Ship & Inventory Stats
      fuel: 100,
      resources: 0,
      shipUpgrades: {
        navigation: 1,
        shield: 1,
        engine: 1
      },
      
      // Analytics
      missionsCompleted: 0,
      successRate: 100,

      // Leaderboard Mock Data
      leaderboard: [
        { name: 'X-Ray 1', xp: 15000, rank: 'Galactic Legend' },
        { name: 'Nova', xp: 12000, rank: 'Admiral' },
        { name: 'Zenith', xp: 9500, rank: 'Commander' },
        { name: 'Echo', xp: 7200, rank: 'Commander' },
      ],

      addXP: (amount) => {
        const currentXP = get().xp + amount;
        const nextLevelThreshold = get().level * 1000;
        
        let newLevel = get().level;
        if (currentXP >= nextLevelThreshold) {
          newLevel += 1;
        }

        const rankIndex = Math.min(Math.floor(newLevel / 5), RANKS.length - 1);
        const newRank = RANKS[rankIndex];

        set({ 
          xp: currentXP, 
          level: newLevel,
          rank: newRank 
        });
      },

      unlockPlanet: (planetId) => {
        const currentPlanets = get().unlockedPlanets;
        if (!currentPlanets.includes(planetId)) {
          set({ unlockedPlanets: [...currentPlanets, planetId] });
        }
      },

      addToInventory: (item) => {
        set({ inventory: [...get().inventory, item] });
      },

      completeMission: (missionId) => {
        const currentCompleted = get().completedMissions;
        if (!currentCompleted.includes(missionId)) {
          set({ completedMissions: [...currentCompleted, missionId] });
        }
      },

      setSelectedPlanet: (planet) => {
        set({ selectedPlanet: planet });
      },

      setGameMode: (mode) => {
        set({ gameMode: mode });
      },

      isPlanetLocked: (planetId) => {
        const level = get().level;
        const gate = get().planetGates[planetId] || 0;
        return level < gate;
      },

      consumeFuel: (amount) => {
        set({ fuel: Math.max(0, get().fuel - amount) });
      },

      upgradeShip: (module) => {
        const currentUpgrades = get().shipUpgrades;
        const resources = get().resources;
        const cost = currentUpgrades[module] * 100;
        
        if (resources >= cost) {
          set({ 
            resources: resources - cost,
            shipUpgrades: { ...currentUpgrades, [module]: currentUpgrades[module] + 1 }
          });
          return true;
        }
        return false;
      },

      addResources: (amount) => {
        set({ resources: get().resources + amount });
      }
    }),
    {
      name: 'cosmic-quest-storage',
      partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        rank: state.rank,
        resources: state.resources,
        shipUpgrades: state.shipUpgrades,
        inventory: state.inventory,
        completedMissions: state.completedMissions,
        missionsCompleted: state.missionsCompleted,
        successRate: state.successRate,
      }),
    }
  )
);
