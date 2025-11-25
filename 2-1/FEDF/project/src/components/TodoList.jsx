import { useState } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTask = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos([...todos, { text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTask = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const deleteTask = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* --- UPPER PART: Transparent Header --- */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-3 text-gray-800">✅ To-Do List</h2>
        <p className="text-xl text-gray-700 font-medium">Organize your day and clear your mind. What's on your list?</p>
      </div>

      {/* --- DOWN PART: White Box --- */}
      <div className="glass-panel">
        <form onSubmit={addTask} className="flex gap-3 mb-6">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-peachDark"
            placeholder="e.g., Drink water"
          />
          <button type="submit" className="btn-primary">Add Task</button>
        </form>
        
        <ul className="space-y-3 text-left">
          {todos.length === 0 && <p className="text-center text-gray-400 italic">No tasks yet. Enjoy your day!</p>}
          
          {todos.map((todo, index) => (
            <li key={index} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleTask(index)}>
                <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  readOnly
                  className="w-5 h-5 accent-peachDark cursor-pointer" 
                />
                <span className={`text-lg ${todo.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                  {todo.text}
                </span>
              </div>
              <button 
                onClick={() => deleteTask(index)} 
                className="text-red-400 hover:text-red-600 font-bold text-xl px-2"
                title="Delete"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;