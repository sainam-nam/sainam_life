import { useEffect, useState } from 'react';

export default function Bugs() {
  const [bugs, setBugs] = useState([]);
  const [input, setInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadBugs = async () => {
    const res = await fetch('http://localhost:5000/bugs');
    const data = await res.json();
    setBugs(data);
  };

  const addBug = async () => {
    if (!input) return;

    await fetch('http://localhost:5000/bugs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input })
    });

    setInput('');
    loadBugs();
  };

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/bugs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadBugs();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBugs();
  }, []);

  const filtered = bugs.filter(b => {
    return !statusFilter || b.status === statusFilter;
  });

  return (
    <div>
      <h2>Bugs</h2>

      <input
        placeholder="New bug"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button onClick={addBug}>Add</button>

      <div>
        <select onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="fixed">Fixed</option>
        </select>
      </div>

      <ul>
        {filtered.map(b => (
          <li key={b.id}>
            {b.title} ({b.status})
            <button onClick={() => updateStatus(b.id, 'in_progress')}>Progress</button>
            <button onClick={() => updateStatus(b.id, 'fixed')}>Fixed</button>
          </li>
        ))}
      </ul>
    </div>
  );
}