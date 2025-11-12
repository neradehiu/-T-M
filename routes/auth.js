const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // db.js của bạn

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'supersecret';

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Missing username or password' });

    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashed]
    );

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0]; // pg trả về rows array

    if (!user) return res.status(401).json({ error: 'Invalid username' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Wrong password' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
