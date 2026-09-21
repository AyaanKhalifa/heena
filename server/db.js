const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = new Database('henna.db');

// Enable foreign keys
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    reset_token TEXT,
    reset_token_expires INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    date TEXT NOT NULL,
    service TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS portfolio_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert default portfolio items if none exist
const portfolioCount = db.prepare('SELECT COUNT(*) as count FROM portfolio_items').get();
if (portfolioCount.count === 0) {
  const insertPortfolio = db.prepare('INSERT INTO portfolio_items (image_url, title, description) VALUES (?, ?, ?)');
  insertPortfolio.run('/assets/bridal_mehndi_1789986953993.jpg', 'Bridal Elegance', 'Intricate traditional designs for your big day.');
  insertPortfolio.run('/assets/hero_mehndi_1789986932139.jpg', 'Modern & Party', 'Elegant contemporary patterns for guests.');
  insertPortfolio.run('/arabic1.jpg', 'Modern Arabic', 'Clean and elegant contemporary styles.');
  insertPortfolio.run('/bridal2.jpg', 'Bridal Details', 'Breathtaking intricacy for the perfect bride.');
  console.log('Default portfolio items seeded.');
}

// Create default admin user if not exists
const checkAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@hennaamira.com');
if (!checkAdmin) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
    'Amira Admin', 'admin@hennaamira.com', hash, 'admin'
  );
  console.log('Default admin created: admin@hennaamira.com / admin123');
}

module.exports = db;
