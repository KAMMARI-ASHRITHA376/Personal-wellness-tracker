import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  // Auto-login on page load if user data is in localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      const storedUser = JSON.parse(loggedInUser);
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    // Show a confirmation dialog to the user
    const confirmed = window.confirm("Are you sure you want to log out?");

    if (confirmed) {
      // If the user clicks YES (OK)
      setUser(null); // Clear React state
      localStorage.removeItem('currentUser'); // Clear browser memory
      
      // Optional: You can navigate to the login page state if your router supported it,
      // but since we are using simple state and reload, we just let the page reload:
      window.location.reload(); 
    }
    // If the user clicks NO (Cancel), the function returns, and the page stays on Home.
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      {user && (
        <header className="bg-gradient-to-r from-peachDark to-peachLight text-white py-8 text-center shadow-md z-50">
          <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-md">
            🌿 Wellness Hub
          </h1>
        </header>
      )}

      <main className="flex-1 bg-transparent">
        {!user ? (
          <Login setUser={setUser} />
        ) : (
          // Pass the logout handler down to the Dashboard
          <Dashboard user={user} handleLogout={handleLogout} /> 
        )}
      </main>

      <footer className="bg-gradient-to-r from-peachLight to-peachDark text-white text-center p-4 mt-auto shadow-inner">
        2025 Wellness Hub | Designed with ❤ for your well-being
      </footer>
    </div>
  );
}

export default App;
