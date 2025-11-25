import { useState } from 'react';

const MoodTracker = ({ user }) => {
  const [selectedMood, setSelectedMood] = useState(null);

  const moods = [
    { label: 'Happy', emoji: '😊' },
    { label: 'Calm', emoji: '😌' },
    { label: 'Sad', emoji: '😢' },
    { label: 'Anxious', emoji: '😟' },
    { label: 'Angry', emoji: '😠' }
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    
    // Save to LocalStorage
    const existingData = JSON.parse(localStorage.getItem('wellness_data')) || [];
    const newEntry = {
      username: user.username,
      entry: "", 
      date: new Date().toLocaleDateString(),
      mood: mood
    };
    localStorage.setItem('wellness_data', JSON.stringify([...existingData, newEntry]));
  };

  return (
    <div className="animate-fade-in text-center max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-3 text-gray-800">How are you feeling today?</h2>
        <p className="text-xl text-gray-700 font-medium">Select an emoji that best represents your current mood.</p>
      </div>
      <div className="glass-panel inline-block w-full">
        <div className="flex justify-center gap-4 md:gap-8 mb-6 flex-wrap">
          {moods.map((m) => (
            <button key={m.label} onClick={() => handleMoodSelect(m.label)} className="text-5xl hover:scale-125 transition-transform duration-200 p-2">
              {m.emoji}
            </button>
          ))}
        </div>
        {selectedMood && (
          <div className="text-green-600 font-bold text-xl animate-pulse mt-4">
            Mood logged: {selectedMood}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;