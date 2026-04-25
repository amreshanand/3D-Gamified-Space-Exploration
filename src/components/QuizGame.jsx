import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Radio, Brain, HelpCircle, Trophy } from 'lucide-react';

const QUESTIONS = [
  {
    q: "Which element is most abundant in the Sun?",
    a: ["Helium", "Hydrogen", "Oxygen", "Iron"],
    correct: 1
  },
  {
    q: "What is the approximate speed of light?",
    a: ["150,000 km/s", "300,000 km/s", "1,000,000 km/s", "Speed of sound"],
    correct: 1
  },
  {
    q: "Which planet is known as the Morning Star?",
    a: ["Mars", "Jupiter", "Venus", "Mercury"],
    correct: 2
  }
];

const QuizGame = () => {
  const { addXP, addResources, setGameMode } = useGameStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (idx) => {
    if (idx === QUESTIONS[currentStep].correct) {
      setScore(s => s + 1);
    }
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setIsFinished(true);
      const finalScore = score + (idx === QUESTIONS[currentStep].correct ? 1 : 0);
      addXP(finalScore * 300);
      addResources(finalScore * 100);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-3xl">
      <div className="max-w-xl w-full glass-panel p-10 text-center relative overflow-hidden">
        <Radio className="w-12 h-12 text-neon-cyan mx-auto mb-6 animate-pulse" />
        <h2 className="text-2xl font-black mb-1 italic uppercase tracking-tighter">Alien Signal Decoder</h2>
        <p className="text-[10px] text-gray-500 font-bold tracking-[0.4em] mb-12 uppercase">Translate encrypted logic patterns</p>

        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div 
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-lg font-medium text-white px-6 leading-relaxed">
                {QUESTIONS[currentStep].q}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {QUESTIONS[currentStep].a.map((ans, i) => (
                  <button 
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-lg text-sm font-bold hover:bg-neon-cyan hover:text-black hover:border-white transition-all text-left flex justify-between group"
                  >
                    <span>{ans}</span>
                    <span className="opacity-0 group-hover:opacity-100 font-mono text-[10px]">SELECT_SIGNAL</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <Trophy className="w-16 h-16 text-neon-cyan mx-auto mb-6 drop-shadow-neon-cyan" />
              <div className="text-3xl font-black mb-2 uppercase">Decryption Complete</div>
              <p className="text-gray-400 mb-8 font-mono">Accuracy: {Math.round((score/QUESTIONS.length)*100)}% // Signals Stabilized</p>
              <button 
                onClick={() => setGameMode(null)}
                className="w-full interactive-button bg-neon-cyan py-4 text-black font-black uppercase text-xs tracking-[0.3em]"
              >
                Return to Bridge
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-center space-x-2">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`h-1 w-8 rounded-full ${i <= currentStep ? 'bg-neon-cyan' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
