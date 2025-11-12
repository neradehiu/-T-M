// scripts/init-db.js
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initDB() {
  console.log("🚀 Starting database initialization...");

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Table 'products' checked/created");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Table 'users' checked/created");

    const result = await pool.query(`SELECT COUNT(*) FROM users;`);
    const count = parseInt(result.rows[0].count, 10);

    if (count === 0) {
      const hashedPassword = await bcrypt.hash("123456", 10);
      await pool.query(
        `INSERT INTO users (username, password) VALUES ($1, $2);`,
        ["admin", hashedPassword]
      );
      console.log("👤 Default user 'admin' added (password: 123456)");
    } else {
      console.log(`ℹ️ Users table already has ${count} user(s)`);
    }

    console.log("🎉 Database initialization complete!");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  }

  // ❌ Không end pool ở đây
}

// Export pool và initDB
module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initDB,
};
