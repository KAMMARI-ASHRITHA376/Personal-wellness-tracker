import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeeklyInsights = ({ user, changeTab }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // READ FROM LOCALSTORAGE: Combines Moods and Journals
    const data = JSON.parse(localStorage.getItem('wellness_data')) || [];
    const userHistory = data.filter(item => item.username === user.username);
    
    // Sort the history by date (most recent first) for the list
    userHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setHistory(userHistory);
    setLoading(false);
  }, [user]);

  // --- DATA PROCESSING FOR GRAPH ---
  const moodScores = { "Happy": 5, "Calm": 4, "Neutral": 3, "Sad": 2, "Anxious": 1, "Angry": 1 };

  // Generate data points for the last 7 days (used for both graph and list)
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); 
    const dateStr = d.toLocaleDateString('en-US');
    
    // Find the entry for this specific day
    const entry = history.find(h => h.date === dateStr);
    
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: dateStr,
      score: entry ? (moodScores[entry.mood] || 3) : 0, 
      mood: entry ? entry.mood : "No Data"
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
        <p className="text-xl text-gray-700 font-medium">Visualizing your emotional journey over the past week.</p>
      </div>
      <div className="glass-panel w-full">
        {loading ? <p>Loading...</p> : (
          <>
            {history.length === 0 ? (
              <div className="text-center py-8">
                 <h3 className="font-bold text-gray-700 text-xl mb-2">No entries yet.</h3>
                 <button onClick={() => changeTab('mood')} className="btn-primary">Track Mood Now</button>
              </div>
            ) : (
              <div className="w-full">
                
                {/* --- THE GRAPH SECTION --- */}
                <div className="mb-8 p-4 bg-white/50 rounded-xl border border-white">
                  <h3 className="text-left font-bold text-gray-700 mb-4 ml-2">Mood Trend</h3>
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

                {/* --- LIST HISTORY (FIXED LOGIC) --- */}
                <h4 className="font-bold text-left mb-4 text-gray-700 border-b pb-2 text-lg">Detailed History</h4>
                <div className="flex flex-col gap-3">
                  
                  {/* List the entries based on the 7-day chart data */}
                  {[...chartData].reverse().map((day) => (
                    <div key={day.fullDate} className={`flex justify-between items-center p-4 rounded-lg border-l-4 transition-all hover:bg-gray-50 ${day.score > 0 ? 'bg-white border-peachDark shadow-sm' : 'bg-white/50 border-gray-300'}`}>
                      <span className="font-bold text-gray-700">
                        {/* Display "Today" for the current day */}
                        {day.fullDate === chartData.slice(-1)[0].fullDate ? "Today" : day.name} 
                        <span className="text-xs font-normal text-gray-400 ml-1">({day.fullDate})</span>
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${day.score > 0 ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-400"}`}>
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
    </div>
  );
};

export default WeeklyInsights;
