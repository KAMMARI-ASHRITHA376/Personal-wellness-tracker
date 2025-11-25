import { useState, useEffect } from 'react';

// Game suggestions based on mood
const gamesByMood = {
    'Happy': [{ id: 'reaction', title: '⚡ Quick Tap', description: 'Test your reflexes and channel that energy!' }],
    'Calm': [{ id: 'breathing', title: '🌬️ Mindful Breathing', description: 'Center yourself with a guided exercise.' }],
    'Sad': [{ id: 'breathing', title: '🌬️ Mindful Breathing', description: 'Find a moment of peace and calm.' }],
    'Anxious': [{ id: 'breathing', title: '🌬️ Mindful Breathing', description: 'Soothe your anxiety with deep breaths.' }],
    'Angry': [{ id: 'reaction', title: '⚡ Quick Tap', description: 'Channel your energy into this fast-paced game.' }]
};

const Games = () => {
  const [activeGame, setActiveGame] = useState(null);
  const [currentMood, setCurrentMood] = useState(null);
  const [breathingText, setBreathingText] = useState("Get Ready...");
  const [scale, setScale] = useState(1);
  const [reactionScore, setReactionScore] = useState(0);

  // --- Logic to Fetch Latest Mood ---
  useEffect(() => {
    // Read wellness_data from local storage
    const history = JSON.parse(localStorage.getItem('wellness_data')) || [];
    
    // Find the latest entry that has a non-empty mood value
    const latestEntry = history.slice().reverse().find(entry => entry.mood && entry.mood !== "Neutral");

    if (latestEntry) {
        setCurrentMood(latestEntry.mood);
    } else {
        // Default mood if no mood has ever been tracked
        setCurrentMood('Calm'); 
    }
  }, []);

  // --- Breathing Game Logic (Timer independent) ---
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
  
  // Get suggestions based on the fetched mood
  const suggestedGames = gamesByMood[currentMood] || gamesByMood['Calm'];

  return (
    <div className="animate-fade-in max-w-3xl mx-auto text-center">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-3 text-gray-800">🎮 Stress-Relief Games</h2>
        <p className="text-xl text-gray-700 font-medium">Engage in fun activities designed to alleviate tension.</p>
      </div>

      {/* Content Box */}
      <div className="glass-panel min-h-[400px] flex flex-col justify-center items-center relative">
        
        {!activeGame && currentMood && (
          <div className="w-full">
             <div className="bg-white p-8 rounded-xl shadow-md mb-8">
                <h3 className="font-bold text-gray-700 text-xl mb-4">
                    Suggestions for when you feel <span className="text-peachDark">{currentMood}</span>
                </h3>
                <div className="flex flex-wrap justify-center gap-6">
                    {suggestedGames.map(game => (
                        <button 
                            key={game.id}
                            onClick={() => setActiveGame(game.id)} 
                            className={`w-48 h-48 rounded-2xl hover:scale-105 transition shadow-lg flex flex-col items-center justify-center p-4 text-white
                                ${game.id === 'breathing' ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-orange-400 to-red-600'}`}
                        >
                            <span className="text-3xl mb-2">{game.title.includes('Quick Tap') ? '⚡' : '🌬️'}</span>
                            <span className="font-bold text-lg">{game.title}</span>
                            <span className="text-xs opacity-80 mt-1">{game.description}</span>
                        </button>
                    ))}
                </div>
            </div>
          </div>
        )}
        
        {/* Breathing Game Interface */}
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

        {/* Reaction Game Interface (Placeholder for brevity) */}
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
                 <p className="mt-4 text-sm text-gray-500">Tap to release energy!</p>
              </div>
           </div>
        )}

        {!currentMood && !activeGame && <p className="text-gray-500">Loading mood suggestions...</p>}
      </div>
    </div>
  );
};

export default Games;
