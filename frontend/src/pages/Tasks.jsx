import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { formatDate } from '../help/formatDate';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  // form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const loadTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks');
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect    
    loadTasks();
  }, []);

  // ✅ CREATE
  const addTask = async () => {
    try {
      if (!title) return;

      const res = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          priority,
          due_date: dueDate
        })
      });

      console.log(await res.text());
      await loadTasks();
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    } catch (err) {
      console.error('FETCH ERROR:', err);
    }
  };

  const updateTask = async () => {
    const { title, description, status, priority, due_date } = selectedTask;

    await fetch(`http://localhost:5000/tasks/${selectedTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        status,
        priority,
        due_date: formatDate(due_date)
      })
    });

    setSelectedTask(null);
    loadTasks();
  };

  // ✅ UPDATE STATUS (Kanban)
  const updateStatus = async (id, status) => {
    const task = tasks.find(t => t.id == id);

    const payload = {
      title: task.title,
      description: task.description,
      status: status,
      priority: task.priority,
      due_date: formatDate(task.due_date)
    };

    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    loadTasks();
  };

  // ✅ DELETE
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    });
    loadTasks();
  };

  const columns = {
    todo: tasks.filter(t => t.status === 'todo'),
    doing: tasks.filter(t => t.status === 'doing'),
    done: tasks.filter(t => t.status === 'done')
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const id = result.draggableId;
    const newStatus = result.destination.droppableId;

    await updateStatus(id, newStatus);
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

        {/* highlight layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl pointer-events-none"></div>

        <div className="relative flex flex-wrap gap-2">
          <input
            className="px-3 py-2 rounded-xl bg-white/60 backdrop-blur border border-white/30"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <input
            className="px-3 py-2 rounded-xl bg-white/60 backdrop-blur border border-white/30"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <select
            className="px-3 py-2 rounded-xl bg-white/60 border border-white/30"
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium"> Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            className="px-3 py-2 rounded-xl bg-white/60 border border-white/30"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />

          <button
            onClick={addTask}
            className="px-4 rounded-xl bg-gradient-to-r from-pink-400 to-blue-400 text-white shadow hover:scale-105 transition"
          >
            Add
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
                  className="p-4 rounded-3xl bg-white/20 border border-white/20 shadow-xl min-h-[300px]"
                >
                  <h2 className="font-bold mb-3 capitalize text-lg">
                    {key}
                  </h2>

                  {items.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                          className={`relative mb-3 p-4 rounded-2xl border border-white/20 shadow-lg transition
                            ${snapshot.isDragging
                              ? 'bg-white z-50 scale-100'
                              : 'backdrop-blur-xl bg-white/40 hover:scale-105'}
                          `}>
                          {/* shine */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl pointer-events-none"></div>

                          <div className="relative">
                            <div className="font-semibold">
                              {task.title}
                            </div>

                            <div className="text-sm text-gray-600">
                              {task.description}
                            </div>

                            <div className={`text-xs mt-1 ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </div>

                            {task.due_date && (
                              <div className="text-xs mt-1 bg-white/50 px-2 py-1 rounded-full inline-block">
                                {new Date(task.due_date).toLocaleDateString()}
                              </div>
                            )}

                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => setSelectedTask(task)}
                                className="text-xs px-2 py-1 rounded bg-blue-400 text-white"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => deleteTask(task.id)}
                                className="text-xs px-2 py-1 rounded bg-pink-400 text-white"
                              >
                                Delete
                              </button>
                            </div>
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
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="p-6 rounded-3xl backdrop-blur-2xl bg-white/40 border border-white/20 shadow-xl w-[400px]">

            <h2 className="font-bold mb-4 text-lg">Edit Task</h2>

            <input
              className="w-full mb-2 p-2 rounded-xl bg-white/70"
              value={selectedTask.title}
              onChange={e =>
                setSelectedTask({ ...selectedTask, title: e.target.value })
              }
            />

            <input
              className="w-full mb-2 p-2 rounded-xl bg-white/70"
              value={selectedTask.description || ''}
              onChange={e =>
                setSelectedTask({ ...selectedTask, description: e.target.value })
              }
            />

            <div className="flex gap-2 mb-2">
              <select
                className="w-1/2 p-2 rounded-xl bg-white/60 border border-white/30"
                value={selectedTask.priority}
                onChange={e =>
                  setSelectedTask({ ...selectedTask, priority: e.target.value })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <input
                type="date"
                className="w-1/2 p-2 rounded-xl bg-white/60 border border-white/30"
                value={selectedTask.due_date || ''}
                onChange={e =>
                  setSelectedTask({ ...selectedTask, due_date: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-3 py-1 rounded bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={updateTask}
                className="px-3 py-1 rounded bg-gradient-to-r from-pink-400 to-blue-400 text-white"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}