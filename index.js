// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const initDb = require('./scripts/init-db'); // we'll call programmatically
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API
app.use('/api/products', productsRouter);

// serve static frontend
app.use('/', express.static(path.join(__dirname, 'public')));

// health
app.get('/health', (req, res) => res.send({ ok: true }));

// Start server after ensuring DB init
(async () => {
  try {
    // init DB once on startup (safe: CREATE IF NOT EXISTS)
    await require('./db').query(require('fs').readFileSync(require('path').join(__dirname,'migrations','init.sql')).toString());
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to startup', err);
    process.exit(1);
  }
})();
