// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node_auth',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    connection.release();
    res.send('Registration successful!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Registration failed. Please try again.');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    connection.release();

    if (rows.length > 0) {
      res.send('Login successful!');
    } else {
      res.status(401).send('Invalid credentials. Please try again.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Login failed. Please try again.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
