import { useState, useEffect } from 'react';

const Games = () => {
  const [activeGame, setActiveGame] = useState(null);
  const [breathingText, setBreathingText] = useState("Get Ready...");
  const [scale, setScale] = useState(1);
  const [reactionScore, setReactionScore] = useState(0);

  // Breathing Game Logic
  useEffect(() => {
    if (activeGame !== 'breathing') return;
    const cycle = () => {
      setBreathingText("Breathe In..."); setScale(1.5);
      setTimeout(() => {
        setBreathingText("Hold...");
        setTimeout(() => {
          setBreathingText("Breathe Out..."); setScale(1);
        }, 4000);
      }, 4000);
    };
    cycle();
    const interval = setInterval(cycle, 12000);
    return () => clearInterval(interval);
  }, [activeGame]);

  return (
    <div className="animate-fade-in max-w-3xl mx-auto text-center">
      {/* --- UPPER PART: Transparent Header --- */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-3 text-gray-800">🎮 Stress-Relief Games</h2>
        <p className="text-xl text-gray-700 font-medium">Engage in fun activities designed to alleviate tension.</p>
      </div>

      {/* --- DOWN PART: White Box --- */}
      <div className="glass-panel min-h-[400px] flex flex-col justify-center items-center relative">
        
        {!activeGame && (
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => setActiveGame('breathing')} 
              className="w-48 h-48 bg-gradient-to-br from-sky-200 to-blue-200 rounded-2xl hover:scale-105 transition shadow-lg flex flex-col items-center justify-center p-4 text-blue-900"
            >
              <span className="text-6xl mb-4">🌬️</span>
              <span className="font-bold text-xl">Breathing</span>
              <span className="text-sm opacity-70 mt-2">Calm & Center</span>
            </button>
            
            <button 
              onClick={() => setActiveGame('reaction')} 
              className="w-48 h-48 bg-gradient-to-br from-orange-200 to-red-200 rounded-2xl hover:scale-105 transition shadow-lg flex flex-col items-center justify-center p-4 text-red-900"
            >
              <span className="text-6xl mb-4">⚡</span>
              <span className="font-bold text-xl">Quick Tap</span>
              <span className="text-sm opacity-70 mt-2">Focus & Energy</span>
            </button>
          </div>
        )}

        {activeGame === 'breathing' && (
          <div className="w-full">
            <button onClick={() => setActiveGame(null)} className="absolute top-6 left-6 text-gray-500 hover:text-black font-bold">← Back</button>
            <div className="flex flex-col items-center gap-10">
              <h3 className="text-3xl font-bold text-gray-600 transition-all">{breathingText}</h3>
              <div 
                className="w-56 h-56 bg-gradient-to-br from-green-300 to-blue-300 rounded-full shadow-2xl transition-all duration-[4000ms] ease-in-out flex items-center justify-center text-white font-bold text-lg opacity-80"
                style={{ transform: `scale(${scale})` }}
              >
              </div>
            </div>
          </div>
        )}

        {activeGame === 'reaction' && (
           <div className="w-full">
              <button onClick={() => setActiveGame(null)} className="absolute top-6 left-6 text-gray-500 hover:text-black font-bold">← Back</button>
              <h3 className="text-2xl font-bold mb-4">Quick Tap Game</h3>
              <div className="p-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                 <p className="text-xl mb-4">Score: <span className="text-peachDark font-bold">{reactionScore}</span></p>
                 <button 
                   onClick={() => setReactionScore(s => s + 1)}
                   className="bg-peachDark text-white w-20 h-20 rounded-full font-bold shadow-lg active:scale-90 transition-transform"
                 >
                   TAP!
                 </button>
                 <p className="mt-4 text-sm text-gray-500">Tap as fast as you can!</p>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default Games;