// routes/products.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// Add product
router.post('/', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name) return res.status(400).json({ error: "Missing name" });

    const result = await db.query(
      'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *',
      [name, description || null, price || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Search / list products
// ?q=keyword
router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (q) {
      // Basic ILIKE search on name and description
      const result = await db.query(
        `SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1 ORDER BY created_at DESC LIMIT 100`,
        [`%${q}%`]
      );
      return res.json(result.rows);
    } else {
      const result = await db.query('SELECT * FROM products ORDER BY created_at DESC LIMIT 100');
      return res.json(result.rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
