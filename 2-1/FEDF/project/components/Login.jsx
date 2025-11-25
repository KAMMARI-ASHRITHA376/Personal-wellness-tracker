import { useState, useEffect } from 'react';

const Login = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  // Check Local Storage on mount to see if a user has ever signed up
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    // If there are no users stored, the first visit should default to sign up
    if (storedUsers.length === 0) {
      setIsLogin(false);
      setMessage('Welcome! Please Sign Up to begin.');
    } else {
      // If users exist, default to login
      setIsLogin(true);
      setMessage('');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    if (!formData.username || !formData.password) {
      setMessage('Please fill in both fields.');
      return;
    }

    let storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const userExists = storedUsers.includes(formData.username);

    if (isLogin) {
      // --- LOGIN ATTEMPT ---
      if (userExists) {
        const userData = { username: formData.username };
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      } else {
        setMessage('Error: Username not found. Please Sign Up first.');
      }
    } else {
      // --- SIGN UP ATTEMPT ---
      if (userExists) {
        setMessage('Username already exists. Please Log In.');
        setIsLogin(true); // Switch to login screen
      } else {
        // Successful Sign Up
        storedUsers.push(formData.username);
        localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
        
        const userData = { username: formData.username };
        setUser(userData); // Log in immediately
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setMessage('Sign Up successful!');
      }
    }
  };
  
  // This useEffect handles the auto-login on page load (if the user closed the tab)
  useEffect(() => {
      const loggedInUser = localStorage.getItem('currentUser');
      if (loggedInUser) {
          const user = JSON.parse(loggedInUser);
          setUser(user);
      }
  }, [setUser]);


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-peachDark mb-6">{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        {message && <p className={`mb-4 text-sm font-bold ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-peachDark"
            type="text" placeholder="Username" required
            onChange={e => setFormData({...formData, username: e.target.value})} 
            value={formData.username}
          />
          <input 
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-peachDark"
            type="password" placeholder="Password" required
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />
          <button className="btn-primary bg-gradient-to-r from-peachDark to-peachLight w-full">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-gray-500 cursor-pointer hover:text-peachDark" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Login;
