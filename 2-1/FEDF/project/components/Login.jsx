import { useState } from 'react';

const Login = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate Login - Accept any input
    if(formData.username && formData.password) {
      const userData = { username: formData.username };
      setUser(userData);
      // Save session so they stay logged in on refresh
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } else {
      alert("Please enter details");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-peachDark mb-6">{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-peachDark"
            type="text" placeholder="Username" required
            onChange={e => setFormData({...formData, username: e.target.value})} 
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