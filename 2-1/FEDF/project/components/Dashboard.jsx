import { useState, useEffect } from 'react';

// Import all feature components
import Meditation from './Meditation';
import TodoList from './TodoList';
import HerCycle from './HerCycle';
import Games from './Games';
import MoodTracker from './MoodTracker'; 
import WeeklyInsights from './WeeklyInsights'; 

// Reusable Card Component
const FeatureCard = ({ title, desc, gradient, onClick }) => (
  <div onClick={onClick} className={`${gradient} w-[260px] h-[160px] rounded-xl shadow-lg p-6 flex flex-col justify-center items-center cursor-pointer hover:-translate-y-2 transition-transform text-white text-center select-none`}>
    <h3 className="text-xl font-bold mb-2 drop-shadow-sm">{title}</h3>
    <p className="text-sm font-medium opacity-95">{desc}</p>
  </div>
);

// Journal Component - SAVES TO LOCALSTORAGE
const Journal = ({ user }) => {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  
  const saveEntry = () => {
    // 1. Get existing data
    const existingData = JSON.parse(localStorage.getItem('wellness_data')) || [];
    
    // 2. Add new entry
    const newEntry = {
      username: user.username,
      entry: text,
      date: new Date().toLocaleDateString(),
      mood: "Neutral"
    };
    
    // 3. Save back to LocalStorage
    localStorage.setItem('wellness_data', JSON.stringify([...existingData, newEntry]));
    
    setStatus("Saved to Browser! ✍️"); 
    setText(""); 
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-3 text-gray-800">📖 Daily Journal</h2>
        <p className="text-xl text-gray-700 font-medium">"The unexamined life is not worth living." - Socrates</p>
      </div>
      <div className="glass-panel text-center">
        <textarea 
          className="w-full h-64 p-5 border border-gray-200 rounded-xl mb-6 focus:outline-none focus:border-peachDark resize-none text-lg bg-gray-50" 
          placeholder="Write about your day, your thoughts, your feelings..." 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
        />
        <button onClick={saveEntry} className="btn-primary w-full md:w-auto">Save Entry</button>
        {status && <p className="mt-4 text-green-600 font-bold text-lg">{status}</p>}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('home');
  
  const cards = [
    { id: 'insights', title: '🧠 Weekly Insights', desc: 'See your mood trends & get tips.', gradient: 'bg-gradient-to-br from-[#fc6767] to-[#ec008c]' },
    { id: 'meditation', title: '🧘 Meditation', desc: 'Find peace and relaxation.', gradient: 'bg-gradient-to-br from-[#1e3c72] to-[#2a5298]' },
    { id: 'mood', title: '😊 Mood Tracker', desc: 'Track emotions daily.', gradient: 'bg-gradient-to-br from-[#ff4e50] to-[#f9d423]' },
    { id: 'journal', title: '📖 Daily Journal', desc: 'Reflect on your day.', gradient: 'bg-gradient-to-br from-[#6a11cb] to-[#2575fc]' },
    { id: 'todo', title: '✅ To-Do List', desc: 'Stay productive.', gradient: 'bg-gradient-to-br from-[#ff512f] to-[#dd2476]' },
    { id: 'hercycle', title: '💧 Cycle Tracker', desc: 'Understand your body.', gradient: 'bg-gradient-to-br from-[#fc466b] to-[#3f5efb]' },
    { id: 'games', title: '🎮 Stress-Relief', desc: 'Play to relax.', gradient: 'bg-gradient-to-br from-[#00b09b] to-[#96c93d]' },
  ];

  return (
    <div className="w-full">
      <nav className="sticky top-0 z-50 bg-[#fff5e6]/95 backdrop-blur-sm shadow-sm py-5 w-full">
        <div className="max-w-7xl mx-auto flex justify-center items-center flex-wrap gap-6 md:gap-10 font-bold text-peachDark text-lg px-4">
          {['Home', 'Meditation', 'Mood', 'Journal', 'To-Do', 'HerCycle', 'Games', 'Insights'].map((item) => (
            <button 
              key={item}
              onClick={() => setActiveTab(item.toLowerCase() === 'to-do' ? 'todo' : item.toLowerCase())}
              className={`hover:text-red-500 border-b-2 transition-colors duration-200 ${activeTab === (item.toLowerCase() === 'to-do' ? 'todo' : item.toLowerCase()) ? 'border-red-500 text-red-500' : 'border-transparent'}`}
            >
              {item === 'Mood' ? 'Mood Tracker' : item}
            </button>
          ))}
          <button onClick={() => window.location.reload()} className="text-red-600 hover:text-red-800 ml-4">Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-5 mt-4">
        {activeTab === 'home' && (
          <div className="text-center animate-fade-in flex flex-col items-center">
            <h1 className="text-5xl font-bold text-[#333] mb-4 mt-8 tracking-tight">Welcome to Wellness Hub</h1>
            <p className="text-xl text-[#555] mb-12 font-medium">Your personal space for relaxation, self-care, and productivity.</p>
            <div className="flex flex-wrap justify-center gap-6 max-w-[1200px]">
              {cards.map(card => (
                <FeatureCard key={card.id} {...card} onClick={() => setActiveTab(card.id)} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'meditation' && <Meditation />}
        {activeTab === 'journal' && <Journal user={user} />}
        {activeTab === 'todo' && <TodoList />}
        {activeTab === 'hercycle' && <HerCycle />}
        {activeTab === 'games' && <Games />}
        {activeTab === 'mood' && <MoodTracker user={user} />}
        {activeTab === 'insights' && <WeeklyInsights user={user} changeTab={setActiveTab} />}
      </div>
    </div>
  );
};

export default Dashboard;