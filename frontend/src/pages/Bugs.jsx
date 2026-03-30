import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function Bugs() {
  const [bugs, setBugs] = useState([]);
  const [selectedBug, setSelectedBug] = useState(null);
  const [logs, setLogs] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  // ================= LOAD =================
  const loadBugs = async () => {
    const res = await fetch('http://localhost:5000/bugs');
    const data = await res.json();
    setBugs(data);
  };

  const loadLogs = async (id) => {
    const res = await fetch(`http://localhost:5000/bugs/${id}/logs`);
    const data = await res.json();
    setLogs(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect       
    loadBugs();
  }, []);

  // ================= CREATE =================
  const addBug = async () => {
    if (!form.title) return;

    await fetch('http://localhost:5000/bugs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, status: 'open', solution: '' })
    });

    setForm({ title: '', description: '', priority: 'medium' });
    loadBugs();
  };

  // ================= UPDATE =================
  const updateStatus = async (bug, status) => {
    await fetch(`http://localhost:5000/bugs/${bug.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...bug, status })
    });

    loadBugs();
  };

  const updateBug = async () => {
    await fetch(`http://localhost:5000/bugs/${selectedBug.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedBug)
    });

    loadBugs();
    loadLogs(selectedBug.id);
    setSelectedBug(null);
  };

  // ================= DELETE =================
  const deleteBug = async (id) => {
    await fetch(`http://localhost:5000/bugs/${id}`, {
      method: 'DELETE'
    });
    loadBugs();
  };

  // ================= KANBAN =================
  const columns = {
    open: bugs.filter(b => b.status === 'open'),
    in_progress: bugs.filter(b => b.status === 'in_progress'),
    fixed: bugs.filter(b => b.status === 'fixed')
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const id = result.draggableId;
    const newStatus = result.destination.droppableId;

    const bug = bugs.find(b => b.id == id);
    await updateStatus(bug, newStatus);
  };

  const getPriorityColor = (p) => {
    if (p === 'high') return 'text-pink-500';
    if (p === 'medium') return 'text-blue-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">

      {/* FORM */}
      <div className="relative p-5 rounded-3xl backdrop-blur-2xl bg-white/30 border border-white/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl pointer-events-none"></div>
          <div className="relative flex flex-wrap gap-2">
            <input
              className="p-2 rounded-xl 
                bg-white/60 dark:bg-gray-800/60 
                text-gray-800 dark:text-white
                backdrop-blur border border-gray/30 dark:border-gray-700"
              placeholder="Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />

            <input
              className="p-2 rounded-xl 
                bg-white/60 dark:bg-gray-800/60 
                text-gray-800 dark:text-white
                backdrop-blur border border-gray/30 dark:border-gray-700"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />

            <select
              className="p-2 rounded-xl 
                bg-white/60 dark:bg-gray-800/60 
                text-gray-800 dark:text-white
                backdrop-blur border border-gray/30 dark:border-gray-700"
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <button
              onClick={addBug}
              className="px-4 rounded-xl bg-gradient-to-r from-pink-400 to-blue-400 text-white"
            >
              Add Bug
            </button>
          </div>
      </div>

      {/* BOARD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-5">

          {Object.entries(columns).map(([key, items]) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="p-4 rounded-3xl bg-white/20 shadow-xl min-h-[300px]"
                >
                  <h2 className="font-bold mb-3 capitalize text-lg">
                    {key}
                  </h2>

                  {items.map((bug, index) => (
                    <Draggable
                      key={bug.id}
                      draggableId={bug.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                          className={`mb-3 p-4 rounded-2xl shadow-lg transition
                            ${snapshot.isDragging
                              ? 'bg-white'
                              : 'bg-white/40 backdrop-blur-xl hover:scale-105'}
                          `}
                        >
                          <div className="font-semibold">
                            {bug.title}
                          </div>

                          <div className="text-sm text-gray-600">
                            {bug.description}
                          </div>

                          <div className={`text-xs mt-1 ${getPriorityColor(bug.priority)}`}>
                            {bug.priority}
                          </div>

                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => {
                                setSelectedBug(bug);
                                loadLogs(bug.id);
                              }}
                              className="text-xs px-2 py-1 rounded bg-blue-400 text-white"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteBug(bug.id)}
                              className="text-xs px-2 py-1 rounded bg-pink-400 text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* MODAL */}
      {selectedBug && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="p-6 rounded-3xl bg-white/40 backdrop-blur w-[400px]">

            <h2 className="font-bold mb-4">Bug Detail</h2>

            {/* TITLE */}
            <input
              className="w-full mb-2 p-2 rounded-xl 
                bg-white/60 dark:bg-gray-800/60 
                text-gray-800 dark:text-white
                backdrop-blur border border-white/30 dark:border-gray-700"
              value={selectedBug.title}
              onChange={e =>
                setSelectedBug({ ...selectedBug, title: e.target.value })
              }
            />

            {/* DESCRIPTION */}
            <input
              className="w-full mb-2 p-2 rounded-xl 
                bg-white/60 dark:bg-gray-800/60 
                text-gray-800 dark:text-white
                backdrop-blur border border-white/30 dark:border-gray-700"
              value={selectedBug.description || ''}
              onChange={e =>
                setSelectedBug({ ...selectedBug, description: e.target.value })
              }
            />
          <div className="flex gap-2 mb-2">
            {/* PRIORITY */}
            <select
              className="w-1/2 px-3 py-2 rounded-xl 
                bg-white/60 dark:bg-gray-800/60 
                text-gray-800 dark:text-white
                backdrop-blur border border-white/30 dark:border-gray-700"
              value={selectedBug.priority}
              onChange={e =>
                setSelectedBug({ ...selectedBug, priority: e.target.value })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            {/* STATUS */}
            <select
              className="w-1/2 px-3 py-2 rounded-xl 
                bg-white/60 dark:bg-gray-800/60 
                text-gray-800 dark:text-white
                border border-white/30 dark:border-gray-700"
              value={selectedBug.status}
              onChange={e =>
                setSelectedBug({ ...selectedBug, status: e.target.value })
              }
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
            {/* SOLUTION */}
            <h4 className="mt-3">Solution</h4>
            <input
              className="w-full p-2 rounded-xl 
                bg-white/60 dark:bg-gray-800/60 
                text-gray-800 dark:text-white
                backdrop-blur border border-white/30 dark:border-gray-700"
              value={selectedBug.solution || ''}
              onChange={e =>
                setSelectedBug({ ...selectedBug, solution: e.target.value })
              }
            />

            {/* BUTTONS */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSelectedBug(null)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={updateBug}
                className="px-3 py-1 bg-blue-400 text-white rounded"
              >
                Save
              </button>
            </div>

            {/* LOGS */}
            <h4 className="mt-4">Logs</h4>
            <ul className="text-sm">
              {logs.map(l => (
                <li key={l.id}>
                  {l.action} - {l.note}
                </li>
              ))}
            </ul>

          </div>
        </div>
      )}
    </div>
  );
}