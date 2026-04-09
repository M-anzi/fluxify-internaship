const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

// Get all users
app.get('/api/customer', (req, res) => {
  const sql = 'SELECT * FROM customer';

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

// Create user
app.post('/customer', (req, res) => {
  const { name, email } = req.body;

  const sql = 'INSERT INTO customer (name, email) VALUES (?, ?)';

  db.query(sql, [name, email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: 'User created successfully',
      userId: result.insertId
    });
  });
});

// Delete user
app.delete('/customer/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM customer WHERE id = ?';

  // Pass userId as the second argument to inject it into the '?'
  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Check if a row was actually deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User deleted successfully',
      affectedRows: result.affectedRows
    });
  });
});

// Get single user
app.get('/customer/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT * FROM customer WHERE id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // result is an array; check if it has at least one item
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result[0]); // Return only the single user object
  });
});

// Update user
app.put('/customer/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body; // Destructure the fields you want to update
  
  // Syntax: UPDATE table SET column1 = ?, column2 = ? WHERE id = ?
  const sql = 'UPDATE customer SET name = ?, email = ? WHERE id = ?';

  // The order in the array must match the order of '?' in the SQL string
  db.query(sql, [name, email, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      updatedId: userId
    });
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});