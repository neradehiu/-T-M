require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// routers
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth'); // file auth.js bạn đã viết

// db init
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);

// Serve static frontend
app.use('/', express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => res.send({ ok: true }));

// Start server after DB init
(async () => {
  try {
    console.log('🚀 Starting database initialization...');
    const initSQL = fs.readFileSync(path.join(__dirname, 'migrations', 'init.sql')).toString();
    await db.query(initSQL);
    console.log('🎉 Database initialization complete!');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to startup', err);
    process.exit(1);
  }
})();
