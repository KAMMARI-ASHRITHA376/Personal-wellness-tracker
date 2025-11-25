import { useState, useRef, useEffect } from 'react';
// IMPORT LOCAL AUDIO FILES HERE
import EarthSound from './Earth.mp3';
import PeaceSound from './Peace.mp3';
import PositiveSound from './Positive.mp3';

const Meditation = () => {
  const [minutes, setMinutes] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const audioRef = useRef(null);

  // --- 1. NEW AUDIO TRACK LIST USING LOCAL IMPORTS ---
  const audioTracks = [
    { name: "Earth Resonance", src: EarthSound },
    { name: "Peaceful Garden", src: PeaceSound },
    { name: "Deep Om", src: PositiveSound } // Using Positive.mp3 for Deep Om
  ];
  // --- END NEW LIST ---

  // ... (Timer Logic: useEffect, startTimer, togglePause, formatTime functions remain the same) ...
  // [Code Omitted for brevity - Use your existing working timer functions here]
  
  // Timer Logic (Re-pasting for context, ensure you use your latest version)
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsSessionStarted(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      alert("Meditation session finished!");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    const minsStr = minutes.toString();
    if (!minsStr || isNaN(minsStr) || parseInt(minsStr) <= 0) {
      alert("Please enter a valid number of minutes.");
      return;
    }
    setTimeLeft(parseInt(minsStr) * 60);
    setIsActive(true);
    setIsSessionStarted(true);
    audioRef.current.play().catch(e => console.log("Audio play error:", e));
  };

  const togglePause = () => {
    if (isActive) {
      setIsActive(false);
      audioRef.current.pause();
    } else {
      if (timeLeft > 0) {
        setIsActive(true);
        audioRef.current.play();
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  // --- END Timer Logic ---


  return (
    <div className="animate-fade-in w-full flex flex-col items-center">
      
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2 text-gray-800">🧘 Meditation Timer</h2>
        <p className="text-lg text-gray-700 font-medium">Set your desired meditation time and relax.</p>
      </div>

      <div className="glass-panel text-center w-full max-w-md p-6">
        
        {/* Input & Start Button */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <input 
            type="number" 
            value={minutes} 
            onChange={(e) => setMinutes(e.target.value)}
            disabled={isSessionStarted}
            className="p-2 border border-gray-300 rounded w-24 text-center text-lg focus:border-peachDark outline-none bg-white shadow-sm disabled:bg-gray-100" 
            placeholder="Minutes" 
            min="1"
          />
          
          {!isSessionStarted ? (
            <button 
              onClick={startTimer} 
              className="px-6 py-2 rounded font-bold text-lg text-white shadow-sm transition-transform active:scale-95 bg-peachDark hover:bg-orange-600"
            >
              Start
            </button>
          ) : (
             <button 
              onClick={() => {
                setIsActive(false); 
                setIsSessionStarted(false); 
                setTimeLeft(0); 
                audioRef.current.pause(); 
                audioRef.current.currentTime = 0;
              }}
              className="px-6 py-2 rounded font-bold text-lg text-white shadow-sm bg-gray-400 hover:bg-gray-500"
            >
              Reset
            </button>
          )}
        </div>

        {/* Timer Display */}
        <div className="text-6xl font-bold text-[#333] mb-6 font-mono tracking-wider">
          {formatTime(timeLeft)}
        </div>

        {/* Audio Controls */}
        <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-100 w-full">
          <h3 className="font-bold text-base text-gray-700 flex items-center gap-2">
            🎶 Soothing Sounds
          </h3>
          
          <select 
            // 2. Map options using the local audioTracks array
            onChange={(e) => { 
              audioRef.current.src = e.target.value; 
              if(isActive) audioRef.current.play(); 
            }} 
            className="p-1 px-2 border border-gray-300 rounded text-sm bg-white text-gray-700 outline-none focus:border-peachDark cursor-pointer"
            defaultValue={audioTracks[0].src} // Set default selected option
          >
            {audioTracks.map((track) => (
                <option key={track.name} value={track.src}>
                    {track.name}
                </option>
            ))}
          </select>

          {/* Pause/Resume Button Logic */}
          <button 
            onClick={togglePause} 
            disabled={!isSessionStarted}
            className={`text-xs font-bold border border-gray-300 px-3 py-1 rounded transition-colors
              ${isSessionStarted ? 'text-gray-700 hover:bg-gray-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
          >
            {isActive ? "⏸ Pause " : "▶ Resume "}
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 w-full max-w-[200px] mt-1">
             <span className="text-gray-400 text-xs">Vol:</span>
             <input 
               type="range" min="0" max="1" step="0.1" defaultValue="0.5" 
               onChange={(e) => audioRef.current.volume = e.target.value} 
               className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5f9ea0]" 
             />
          </div>

          {/* Audio Element - Set initial source */}
          <audio ref={audioRef} loop className="hidden" src={audioTracks[0].src} />
        </div>
      </div>
    </div>
  );
};

export default Meditation;
