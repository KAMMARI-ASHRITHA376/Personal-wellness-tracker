import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Made Text Bigger (text-5xl) and taller (py-8) */}
      {user && (
        <header className="bg-gradient-to-r from-peachDark to-peachLight text-white py-8 text-center shadow-md z-50">
          <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-md">
            🌿 Wellness Hub
          </h1>
        </header>
      )}

      {/* Removed 'p-5' here so the Nav touches the Header directly */}
      <main className="flex-1 bg-transparent">
        {!user ? (
          <Login setUser={setUser} />
        ) : (
          <Dashboard user={user} />
        )}
      </main>

      <footer className="bg-gradient-to-r from-peachLight to-peachDark text-white text-center p-4 mt-auto shadow-inner">
        2025 Wellness Hub | Designed with ❤ for your well-being
      </footer>
    </div>
  );
}

export default App;