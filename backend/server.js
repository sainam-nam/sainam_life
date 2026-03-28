const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ===== DB CONNECT =====
const db = mysql.createConnection({
  // host: 'mysql',
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'root',
  database: 'life_tracker'
});

db.connect(err => {
  if (err) {
    console.log('DB Error:', err);
  } else {
    console.log('MySQL Connected');
  }
});

// =======================
// ===== TASK API ========
// =======================

// GET ALL TASKS
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY created_at DESC', (err, result) => {
    if (err) {
      console.error(err); // 👈 ดูตรงนี้ใน terminal
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// GET TASK BY ID
app.get('/tasks/:id', (req, res) => {
  db.query('SELECT * FROM tasks WHERE id=?', [req.params.id], (err, result) => {
    if (err) {
      console.log('DB ERROR:', err);
      return res.status(500).json(err); // 👈 สำคัญ
    }
    res.json(result[0]);
  });
});

// CREATE TASK
app.post('/tasks', (req, res) => {
  const { title, description, priority, due_date } = req.body;

  db.query(
    `INSERT INTO tasks (title, description, priority, due_date, status)
     VALUES (?, ?, ?, ?, 'todo')`,
    [title, description || null, priority || 'medium', due_date || null],
    (err) => {
      if (err) {
        console.log('DB ERROR:', err);
        return res.status(500).json(err); // 👈 สำคัญ
      }
      res.json({ message: 'Task created' });
    }
  );
});

// UPDATE TASK
app.put('/tasks/:id', (req, res) => {
  const { title, description, status, priority, due_date } = req.body;

  db.query(
    `UPDATE tasks 
     SET title=?, description=?, status=?, priority=?, due_date=? 
     WHERE id=?`,
    [title, description, status, priority, due_date, req.params.id],
    (err) => {
      if (err) {
        console.error(err); // 👈 ดูตรงนี้ใน terminal
        return res.status(500).json(err);
      }
      res.json({ message: 'Task updated' });
    }
  );
});

// DELETE TASK
app.delete('/tasks/:id', (req, res) => {
  db.query('DELETE FROM tasks WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Task deleted' });
  });
});


// =======================
// ===== BUG API =========
// =======================

// GET ALL BUGS
app.get('/bugs', (req, res) => {
  db.query('SELECT * FROM bugs ORDER BY created_at DESC', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET BUG BY ID
app.get('/bugs/:id', (req, res) => {
  db.query('SELECT * FROM bugs WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});

// GET LOGS
app.get('/bugs/:id/logs', (req, res) => {
  const bugId = req.params.id;

  db.query(
    `SELECT * FROM bug_logs WHERE bug_id = ? ORDER BY created_at DESC`,
    [bugId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

// CREATE BUG
app.post('/bugs', (req, res) => {
  const { title, description, status, priority, solution } = req.body;

  const sql = `
    INSERT INTO bugs (title, description, status, priority, solution)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, description, status, priority, solution], (err, result) => {
    if (err) return res.status(500).json(err);

    const bugId = result.insertId;

    // log
    db.query(
      `INSERT INTO bug_logs (bug_id, action, note)
       VALUES (?, 'create', 'Bug created')`,
      [bugId]
    );

    res.json({ message: 'Bug added' });
  });
});

// UPDATE BUG
app.put('/bugs/:id', (req, res) => {
  const { title, description, status, priority, solution } = req.body;

  db.query(
    `UPDATE bugs 
     SET title=?, description=?, status=?, priority=?, solution=? 
     WHERE id=?`,
    [title, description, status, priority, solution, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      db.query(
        `INSERT INTO bug_logs (bug_id, action, note)
         VALUES (?, ?, ?)`,
        [req.params.id, `${status}`, solution]
      );
      res.json({ message: 'Bug updated' });
    }
  );
});

// DELETE BUG
app.delete('/bugs/:id', (req, res) => {
  db.query('DELETE FROM bugs WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Bug deleted' });
  });
});


// =======================
// ===== NOTES API =======
// =======================

// GET NOTES
app.get('/notes', (req, res) => {
  db.query('SELECT * FROM notes ORDER BY is_pinned DESC, position ASC, created_at DESC', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// CREATE NOTE
app.post('/notes', (req, res) => {
  const { title, content } = req.body;

  db.query(
    'INSERT INTO notes (title, content) VALUES (?, ?)',
    [title, content],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Note created' });
    }
  );
});

// UPDATE NOTE
app.put('/note/:id', (req, res) => {
  const { title, content, is_pinned } = req.body;

  db.query(
    'UPDATE notes SET title=?, content=?, is_pinned=? WHERE id=?',
    [title, content, is_pinned, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Note updated' });
    }
  );
});

//UPDATE POSITION
app.put('/notes/reorder', (req, res) => {
  const { notes } = req.body;
  if (!notes || !Array.isArray(notes)) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  let count = 0;
  let hasError = false;

  notes.forEach(n => {
    db.query(
      'UPDATE notes SET `position`=? WHERE id=?',
      [n.position, n.id],
      (err) => {
        if (hasError) return; // 🛑 กันยิงซ้ำ

        if (err) {
          hasError = true;
          return res.status(500).json(err);
        }

        count++;

        if (count === notes.length) {
          res.json({ message: 'reordered' });
        }
      }
    );
  });
});

// DELETE NOTE
app.delete('/notes/:id', (req, res) => {
  db.query('DELETE FROM notes WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Note deleted' });
  });
});


// =======================
// ===== LINKS API =======
// =======================

// GET LINKS
app.get('/links', (req, res) => {
  db.query('SELECT * FROM links ORDER BY created_at DESC', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// CREATE LINK
app.post('/links', (req, res) => {
  const { name, url } = req.body;

  db.query(
    'INSERT INTO links (name, url) VALUES (?, ?)',
    [name, url],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Link added' });
    }
  );
});

// DELETE LINK
app.delete('/links/:id', (req, res) => {
  db.query('DELETE FROM links WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Link deleted' });
  });
});


// =======================

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});