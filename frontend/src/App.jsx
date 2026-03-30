import { useEffect, useState } from 'react';
import Tasks from './pages/Tasks';
import Bugs from './pages/Bugs';
import NotesSidebar from './component/Note';
import { ArrowBigRightDash, Menu, NotebookText } from 'lucide-react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [page, setPage] = useState('tasks');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  // dashboard data
  const [stats, setStats] = useState({
    tasks: 0,
    todo: 0,
    doing: 0,
    done: 0,
    bugs: 0,
    open: 0,
    progress: 0,
    fixed: 0
  });
  const taskData = [
    { name: 'To Do', value: stats.todo, fill: '#facc15' },
    { name: 'In Progress', value: stats.doing, fill: '#3b82f6' },
    { name: 'Done', value: stats.done, fill: '#22c55e' }
  ];

  const bugData = [
    { name: 'Open', value: stats.open, fill: '#ef4444' },
    { name: 'Progress', value: stats.progress, fill: '#3b82f6' },
    { name: 'Fixed', value: stats.fixed, fill: '#22c55e' }
  ];

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
        todo: tasks.filter(t => t.status === 'todo').length,
        doing: tasks.filter(t => t.status === 'doing').length,
        done: tasks.filter(t => t.status === 'done').length,
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
    <div className="flex h-screen 
      bg-gradient-to-br from-slate-100 via-purple-100 to-blue-100 
      dark:from-gray-900 dark:via-gray-900 dark:to-gray-800
      text-gray-800 dark:text-white transition-all duration-500">
      <button
        data-testid="toggle-sidebar"
        onClick={() => setShowSidebar(prev => !prev)}
        className="md:hidden fixed left-0 top-12 -translate-y-1/2 z-50 
             bg-gradient-to-r from-pink-400 to-blue-400 text-white px-3 py-2 rounded-r-xl shadow-lg 
             hover:scale-105 transition"
      >
        <Menu size={20} />
      </button>
      {/* SIDEBAR */}
      <div
        data-testid="sidebar"
        className={`
          fixed md:static z-40 top-0 left-0 h-full
          transform transition-transform duration-300
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0

          w-64 m-4 p-5 rounded-3xl
          backdrop-blur-lg bg-white/40 dark:bg-gray-900/40
          shadow-xl border border-white/20 dark:border-white/10 flex flex-col justify-between
        `}
      >

        <div>
          <h1 className="text-xl font-bold mb-6 tracking-wide pl-3">
            Sainam Life
          </h1>

          {/* MENU */}
          <div className="space-y-2">
            <button
              data-testid="nav-tasks"
              onClick={() => setPage('tasks')}
              className={`w-full text-left px-4 py-2 rounded-xl transition-all
              ${page === 'tasks'
                  ? 'bg-gradient-to-r from-pink-400 to-blue-400 text-white px-3 py-2 rounded-xl shadow-md hover:scale-105 transition'
                  : 'hover:bg-white/50 dark:hover:bg-gray-700'
                }`}
            >
              📋 Tasks
            </button>

            <button
              data-testid="nav-bugs"
              onClick={() => setPage('bugs')}
              className={`w-full text-left px-4 py-2 rounded-xl transition-all
              ${page === 'bugs'
                  ? 'bg-gradient-to-r from-pink-400 to-blue-400 text-white px-3 py-2 rounded-xl shadow-md hover:scale-105 transition'
                  : 'hover:bg-white/50 dark:hover:bg-gray-700'
                }`}
            >
              🐞 Bugs
            </button>
          </div>

          {/* DASHBOARD */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold mb-3 opacity-70">
              📊 Overview
            </h2>

            <div className="mt-6 space-y-4">

              {/* TASK CHART */}
              <div data-testid="task-chart" className="p-4 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur shadow">

                {/* <div className="relative w-28 h-28 mx-auto"> */}
                <div style={{ width: 120, height: 120 }} className="relative mx-auto z-10">

                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskData}
                        dataKey="value"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={3}
                        activeOuterRadius={70}
                        isAnimationActive
                      />
                      <Tooltip
                        position={{ x: 100, y: 35 }}
                        formatter={(value, name) => [`${value}`, name]}
                        contentStyle={{
                          background: 'rgba(255,255,255,255)',
                          borderRadius: '12px',
                          border: 'none',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* 🔥 TOTAL ตรงกลาง */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span data-testid="total-tasks" className="text-lg font-bold">{stats.tasks}</span>
                    <span className="text-[10px] opacity-60">Tasks</span>
                  </div>

                </div>
              </div>

              {/* BUG CHART */}
              <div data-testid="bug-chart" className="p-4 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur shadow">

                <div style={{ width: 120, height: 120 }} className="relative mx-auto">

                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bugData}
                        dataKey="value"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={3}
                        activeOuterRadius={70}
                        isAnimationActive
                      />
                      <Tooltip 
                        position={{ x: 100, y: 35 }}
                        formatter={(value, name) => [`${value}`, name]}
                        contentStyle={{
                          background: 'rgba(255,255,255,255)',
                          borderRadius: '12px',
                          border: 'none',
                        }} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* TOTAL */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span data-testid="total-bugs" className="text-lg font-bold">{stats.bugs}</span>
                    <span className="text-[10px] opacity-60">Bugs</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* DARK MODE SWITCH */}
        <div className="flex items-center justify-between mt-6 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50">
          <span className="text-sm">Dark Mode</span>

          <button
            data-testid="toggle-dark"
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
      <div className="flex-1 md:m-4 p-4 md:p-6 rounded-3xl backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 shadow-xl border border-white/30 overflow-auto">

        {/* HEADER */}
        <div className="mb-4 flex justify-center md:justify-between items-center ">
          <h2 data-testid="page-title" className="text-lg font-semibold capitalize">
            {page}
          </h2>
        </div>

        {/* PAGE */}
        {page === 'tasks' && <Tasks />}
        {page === 'bugs' && <Bugs />}
      </div>
      <button
        data-testid="toggle-notes"
        onClick={() => setShowNotes(prev => !prev)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 
             bg-yellow-400 text-white px-3 py-2 rounded-l-xl shadow-lg 
             hover:scale-105 transition"
      >
        {showNotes ? <ArrowBigRightDash /> : <NotebookText />}
      </button>
      {/* RIGHT SIDEBAR (NOTES) */}
      <div
        data-testid="notes-sidebar"
        className={`
          fixed top-0 right-0 h-full z-20
          transform transition-transform duration-300
          ${showNotes ? 'translate-x-0 md:static' : 'translate-x-full'}
        `}
      >
        <NotesSidebar />
      </div>
      {showNotes && (
        <div
          onClick={() => setShowNotes(false)}
          className="fixed inset-0 bg-black/20 z-10 md:hidden"
        />
      )}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
        />
      )}
    </div>
  );
}