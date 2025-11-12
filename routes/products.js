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
router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const result = q
      ? await db.query(
          `SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1 ORDER BY created_at DESC LIMIT 100`,
          [`%${q}%`]
        )
      : await db.query('SELECT * FROM products ORDER BY created_at DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ Update product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  try {
    const result = await db.query(
      'UPDATE products SET name=$1, description=$2, price=$3 WHERE id=$4 RETURNING *',
      [name, description, price, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ Delete product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM products WHERE id=$1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
