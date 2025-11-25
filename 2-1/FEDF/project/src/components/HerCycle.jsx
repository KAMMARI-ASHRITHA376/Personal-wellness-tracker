import { useState } from 'react';

const HerCycle = () => {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [result, setResult] = useState(null);

  const calculateCycle = () => {
    if (!lastPeriod) return alert("Please select a date");
    const lastDate = new Date(lastPeriod);
    const nextPeriod = new Date(lastDate);
    nextPeriod.setDate(lastDate.getDate() + parseInt(cycleLength));
    
    const ovulation = new Date(nextPeriod);
    ovulation.setDate(nextPeriod.getDate() - 14);
    
    const fertileStart = new Date(ovulation);
    fertileStart.setDate(ovulation.getDate() - 5);
    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(ovulation.getDate() + 1);

    setResult({ nextPeriod, fertileStart, fertileEnd });
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* --- UPPER PART: Transparent Header --- */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-3 text-gray-800">💧 Cycle Tracker</h2>
        <p className="text-xl text-gray-700 font-medium">Log your cycle to understand your body's patterns.</p>
      </div>

      {/* --- DOWN PART: White Box --- */}
      <div className="glass-panel text-center">
        <div className="flex flex-col gap-4 max-w-sm mx-auto mb-8">
          <div className="text-left">
            <label className="font-bold text-gray-700 block mb-1">Last Period Start Date:</label>
            <input 
              type="date" 
              className="w-full p-2 border border-gray-300 rounded focus:border-peachDark outline-none" 
              onChange={(e) => setLastPeriod(e.target.value)} 
            />
          </div>
          
          <div className="text-left">
            <label className="font-bold text-gray-700 block mb-1">Average Cycle Length (days):</label>
            <input 
              type="number" 
              className="w-full p-2 border border-gray-300 rounded focus:border-peachDark outline-none" 
              value={cycleLength} 
              onChange={(e) => setCycleLength(e.target.value)} 
            />
          </div>
          
          <button onClick={calculateCycle} className="btn-primary mt-4 w-full">Save & Calculate</button>
        </div>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in border-t pt-6 border-gray-200">
            <div className="bg-peach/10 p-4 rounded-lg border border-peach/30">
              <h4 className="text-peachDark font-bold text-lg mb-1">Next Period</h4>
              <p className="text-xl font-bold text-gray-800">{result.nextPeriod.toDateString()}</p>
            </div>
            <div className="bg-sky-50 p-4 rounded-lg border border-sky-200">
              <h4 className="text-blue-600 font-bold text-lg mb-1">Fertile Window</h4>
              <p className="text-lg text-gray-800">
                {result.fertileStart.toLocaleDateString()} - {result.fertileEnd.toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HerCycle;