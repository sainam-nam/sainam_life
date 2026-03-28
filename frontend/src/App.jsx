import { useEffect, useState } from 'react';
import Tasks from './pages/Tasks';
import Bugs from './pages/Bugs';
import NotesSidebar from './component/Note';
import { ArrowBigRightDash, NotebookText } from 'lucide-react';

export default function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [page, setPage] = useState('tasks');
  const [showNotes, setShowNotes] = useState(false);

  // dashboard data
  const [stats, setStats] = useState({
    tasks: 0,
    bugs: 0,
    open: 0,
    progress: 0,
    fixed: 0
  });

  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  // 🔥 LOAD DASHBOARD
  const loadStats = async () => {
    try {
      const t = await fetch('http://localhost:5000/tasks');
      const b = await fetch('http://localhost:5000/bugs');

      const tasks = await t.json();
      const bugs = await b.json();

      setStats({
        tasks: tasks.length,
        bugs: bugs.length,
        open: bugs.filter(b => b.status === 'open').length,
        progress: bugs.filter(b => b.status === 'in_progress').length,
        fixed: bugs.filter(b => b.status === 'fixed').length
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect    
    loadStats();
  }, [page]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white transition-all duration-500">

      {/* SIDEBAR */}
      <div className="w-64 m-4 p-5 rounded-3xl backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 shadow-xl border border-white/30 flex flex-col justify-between">

        <div>
          <h1 className="text-xl font-bold mb-6 tracking-wide">
            ⚡ Sainam Life
          </h1>

          {/* MENU */}
          <div className="space-y-2">
            <button
              onClick={() => setPage('tasks')}
              className={`w-full text-left px-4 py-2 rounded-xl transition-all
              ${page === 'tasks'
                  ? 'bg-gradient-to-r from-pink-400 to-blue-400 text-white shadow'
                  : 'hover:bg-white/50 dark:hover:bg-gray-700'
                }`}
            >
              📋 Tasks
            </button>

            <button
              onClick={() => setPage('bugs')}
              className={`w-full text-left px-4 py-2 rounded-xl transition-all
              ${page === 'bugs'
                  ? 'bg-gradient-to-r from-pink-400 to-blue-400 text-white shadow'
                  : 'hover:bg-white/50 dark:hover:bg-gray-700'
                }`}
            >
              🐞 Bugs
            </button>
          </div>

          {/* DASHBOARD */}
          <div className="mt-6 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 shadow-inner">
            <h2 className="font-semibold mb-3 text-sm">📊 Dashboard</h2>

            <div className="text-xs space-y-1">
              <div>Tasks: <b>{stats.tasks}</b></div>
              <div>Bugs: <b>{stats.bugs}</b></div>

              <div className="mt-2">
                <span className="text-pink-500">Open:</span> {stats.open}
              </div>
              <div>
                <span className="text-blue-500">Progress:</span> {stats.progress}
              </div>
              <div>
                <span className="text-green-500">Fixed:</span> {stats.fixed}
              </div>
            </div>
          </div>
        </div>

        {/* DARK MODE SWITCH */}
        <div className="flex items-center justify-between mt-6 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50">
          <span className="text-sm">Dark Mode</span>

          <button
            onClick={() => setDark(!dark)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition
              ${dark ? 'bg-blue-500' : 'bg-gray-300'}
            `}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow transform transition
                ${dark ? 'translate-x-6' : ''}
              `}
            />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 m-4 p-6 rounded-3xl backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 shadow-xl border border-white/30 overflow-auto">

        {/* HEADER */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold capitalize">
            {page}
          </h2>
        </div>

        {/* PAGE */}
        {page === 'tasks' && <Tasks />}
        {page === 'bugs' && <Bugs />}
      </div>
      <button
        onClick={() => setShowNotes(!showNotes)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 
             bg-yellow-400 text-white px-3 py-2 rounded-l-xl shadow-lg 
             hover:scale-105 transition"
      >
        {showNotes ? <ArrowBigRightDash /> : <NotebookText />}
      </button>
      {/* RIGHT SIDEBAR (NOTES) */}
      <div
        className={`transition-all duration-300 overflow-hidden
        ${showNotes ? 'w-80 m-4 ml-0' : 'w-0'}
      `}
      >
        <NotesSidebar />
      </div>
      {/* {showNotes && (
        <div
          onClick={() => setShowNotes(false)}
          className="fixed inset-0 bg-black/20 z-30"
        />
      )} */}
    </div>
  );
}