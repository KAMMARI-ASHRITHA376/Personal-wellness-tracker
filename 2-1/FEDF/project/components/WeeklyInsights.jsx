import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Component to display the recommendation card
const RecommendationCard = ({ positiveDays, negativeDays, changeTab }) => {
    const isPositiveWeek = positiveDays >= negativeDays;

    if (isPositiveWeek) {
        return (
            <div className="recommendation-card good-week bg-green-50 border border-green-200 p-6 rounded-xl shadow-md text-left mb-10">
                <h3 className="text-xl font-bold text-green-800 mb-3">Keep the Momentum!</h3>
                <p className="text-green-700 mb-4">Your mood entries suggest a successful and positive week. Let's keep that energy up:</p>
                <ul>
                    <li className="mb-2">🎮 **Games:** Challenge yourself with "**Quick Tap**" to maintain focus.</li>
                    <li>✅ **To-Do:** Set a new, ambitious goal for tomorrow while you feel good.</li>
                </ul>
                <div className="text-center mt-4">
                    <button onClick={() => changeTab('games')} className="btn-primary bg-green-600 hover:bg-green-700">
                        Play Games
                    </button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="recommendation-card tough-week bg-red-50 border border-red-200 p-6 rounded-xl shadow-md text-left mb-10">
                <h3 className="text-xl font-bold text-red-800 mb-3">Focus on Relaxation</h3>
                <p className="text-red-700 mb-4">Your journal entries suggest a potentially challenging week. We recommend:</p>
                <ul>
                    <li className="mb-2">🧘‍♀️ **Meditation:** Take 10 minutes with the "**Peaceful Garden**" track.</li>
                    <li>🌬️ **Games:** Try the "**Mindful Breathing**" exercise to center yourself.</li>
                </ul>
                <div className="text-center mt-4">
                    <button onClick={() => changeTab('meditation')} className="btn-primary bg-red-600 hover:bg-red-700">
                        Go to Meditation
                    </button>
                </div>
            </div>
        );
    }
};


const WeeklyInsights = ({ user, changeTab }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('wellness_data')) || [];
    const userHistory = data.filter(item => item.username === user.username);
    userHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
    setHistory(userHistory);
    setLoading(false);
  }, [user]);

  // --- DATA PROCESSING FOR GRAPH ---
  const moodScores = { "Happy": 5, "Calm": 4, "Neutral": 3, "Sad": 2, "Anxious": 1, "Angry": 1 };
  let positiveDays = 0;
  let negativeDays = 0;

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); 
    const dateStr = d.toLocaleDateString('en-US');
    
    const entriesForDay = history.filter(h => h.date === dateStr);
    const latestEntry = entriesForDay.length > 0 ? entriesForDay[entriesForDay.length - 1] : null;
    
    const score = latestEntry ? (moodScores[latestEntry.mood] || 3) : 0;
    
    // 1. Sentiment Calculation Logic
    if (score >= 4) { // Happy or Calm
        positiveDays++;
    } else if (score <= 2 && score !== 0) { // Sad, Anxious, Angry (but not No Data)
        negativeDays++;
    }

    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: dateStr,
      score: score, 
      mood: latestEntry ? latestEntry.mood : "No Data"
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-peachDark/30 rounded-lg shadow-lg">
          <p className="font-bold text-gray-700">{label}</p>
          <p className="text-peachDark font-bold">{payload[0].payload.mood}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-3 text-gray-800">🧠 Your Weekly Insights</h2>
        <p className="text-xl text-gray-700 font-medium">A summary of your well-being based on your logs this week.</p>
      </div>
      
      {loading ? <p className="text-center">Loading insights...</p> : (
        <>
            
            {/* 1. RECOMMENDATION CARD (The new section) */}
            {history.length > 0 && 
                <RecommendationCard 
                    positiveDays={positiveDays} 
                    negativeDays={negativeDays} 
                    changeTab={changeTab}
                />
            }
            
            {history.length === 0 ? (
              <div className="glass-panel text-center py-8">
                 <h3 className="font-bold text-gray-700 text-xl mb-2">No entries yet.</h3>
                 <button onClick={() => changeTab('mood')} className="btn-primary">Track Mood Now</button>
              </div>
            ) : (
              <div className="glass-panel w-full">
                
                {/* 2. THE GRAPH SECTION */}
                <div className="mb-8 p-4 bg-white/50 rounded-xl border border-white">
                  <h3 className="text-left font-bold text-gray-700 mb-4 ml-2">Mood Trend </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff7e5f" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ff7e5f" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} dy={10} />
                        <YAxis hide domain={[0, 6]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="score" stroke="#ff7e5f" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. LIST HISTORY */}
                <h4 className="font-bold text-left mb-4 text-gray-700 border-b pb-2 text-lg">Your 7-Day Journal Log</h4>
                <div className="flex flex-col gap-3">
                  {/* List the entries based on the 7-day chart data (reversed to show today first) */}
                  {[...chartData].reverse().map((day) => (
                    <div key={day.fullDate} className={`flex justify-between items-center p-4 rounded-lg border-l-4 transition-all hover:bg-gray-50 ${day.score > 0 ? 'bg-white border-peachDark shadow-sm' : 'bg-white/50 border-gray-300'}`}>
                      <span className="font-bold text-gray-700">
                        {day.fullDate === chartData.slice(-1)[0].fullDate ? "Today" : day.name} 
                        <span className="text-xs font-normal text-gray-400 ml-1">({day.fullDate})</span>
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${day.score >= 4 ? "bg-green-100 text-green-700" : day.score <= 2 && day.score !== 0 ? "bg-red-100 text-red-700" : day.score === 3 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-400"}`}>
                        {day.mood}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            )}
        </>
      )}
    </div>
  );
};

export default WeeklyInsights;
