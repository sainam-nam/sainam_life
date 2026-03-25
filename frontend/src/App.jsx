import { useEffect, useState } from 'react';
import Tasks from './pages/Tasks';
import Bugs from './pages/Bugs';

export default function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [page, setPage] = useState('tasks');

  useEffect(() => {
    const root = window.document.documentElement;

    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <div>
      <div className="flex h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white transition-all duration-500">

        {/* Sidebar */}
        {/* <div className="w-64 m-4 p-5 rounded-3xl backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 shadow-lg border border-white/30"> */}
        <div className="w-64 m-4 p-5 rounded-3xl shadow-lg border border-white/30">


          <h1 className="text-xl font-bold mb-6">Sainam Life</h1>

          <button
            onClick={() => setPage('tasks')}
            className={`w-full text-left px-4 py-2 rounded-xl mb-2 transition-all
            ${page === 'tasks'
                ? 'bg-gradient-to-r from-pink-400 to-blue-400 text-white shadow'
                : 'hover:bg-white/50 dark:hover:bg-gray-700'
              }`}
          >
            📋 Tasks
          </button>

          <button
            onClick={() => setPage('bugs')}
            className={`w-full text-left px-4 py-2 rounded-xl mb-2 transition-all
            ${page === 'bugs'
                ? 'bg-gradient-to-r from-pink-400 to-blue-400 text-white shadow'
                : 'hover:bg-white/50 dark:hover:bg-gray-700'
              }`}
          >
            🐞 Bugs
          </button>

          <button
            onClick={() => setDark(!dark)}
            className="mt-6 w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-700 hover:scale-105 transition"
          >
            {dark ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Content */}
        {/* <div className="flex-1 m-4 p-6 rounded-3xl backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 shadow-lg border border-white/30 overflow-auto"> */}
        <div className='flex-1 m-4 p-6'>
          {page === 'tasks' && <Tasks />}
          {page === 'bugs' && <Bugs />}

        </div>
      </div>
    </div>
  );
}