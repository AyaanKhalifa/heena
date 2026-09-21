const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'super-secret-henna-key-for-local-dev';

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// --- AUTH ROUTES ---
app.post('/api/auth/signup', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const checkUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (checkUser) return res.status(400).json({ error: 'Email already in use' });

    const hash = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)');
    const info = stmt.run(name, email, phone, hash);

    const token = jwt.sign({ id: info.lastInsertRowid, email, role: 'user' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token, user: { id: info.lastInsertRowid, name, email, role: 'user' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ? OR phone = ?').get(email, email);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPass = bcrypt.compareSync(password, user.password);
    if (!validPass) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenExpires = Date.now() + 3600000; // 1 hour

  db.prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?')
    .run(resetToken, tokenExpires, user.id);

  const resetLink = `http://localhost:5174/reset-password?token=${resetToken}`;
  console.log(`\n\n--- PASSWORD RESET LINK FOR ${email} ---\n${resetLink}\n---------------------------------------\n\n`);

  res.json({ success: true, message: 'Password reset link generated. Check console.' });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { token, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?')
    .get(token, Date.now());

  if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

  const hash = bcrypt.hashSync(password, 10);
  db.prepare('UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?')
    .run(hash, user.id);

  res.json({ success: true, message: 'Password has been reset' });
});

app.post('/api/auth/update-password', authenticate, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });

  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const validPass = bcrypt.compareSync(oldPassword, user.password);
    if (!validPass) return res.status(400).json({ error: 'Incorrect current password' });

    const hash = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hash, req.user.id);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// --- BOOKING ROUTES ---
app.post('/api/contact', (req, res) => {
  const { name, email, phone, date, services, message, user_id } = req.body;
  if (!name || !phone || !date || !services) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const stmt = db.prepare('INSERT INTO bookings (user_id, name, email, phone, date, service, message) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(user_id || null, name, email || null, phone, date, services, message);

    if (user_id) {
      db.prepare('INSERT INTO notifications (user_id, message) VALUES (?, ?)').run(user_id, `Your booking for ${services} on ${date} has been submitted.`);
    }

    res.status(200).json({ success: true, message: 'Thank you! Your inquiry has been received.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error saving booking' });
  }
});

app.get('/api/bookings', authenticate, (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
      res.json(bookings);
    } else {
      const bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
      res.json(bookings);
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
});

app.patch('/api/bookings/:id/status', authenticate, isAdmin, (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);

    if (booking.user_id) {
      db.prepare('INSERT INTO notifications (user_id, message) VALUES (?, ?)').run(
        booking.user_id,
        `Your booking for ${booking.service} on ${booking.date} has been marked as ${status}.`
      );
    }

    res.json({ success: true, message: 'Booking status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating booking' });
  }
});

app.delete('/api/bookings/:id', authenticate, isAdmin, (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting booking' });
  }
});

// --- NOTIFICATION ROUTES ---
app.get('/api/notifications', authenticate, (req, res) => {
  try {
    const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching notifications' });
  }
});

app.patch('/api/notifications/:id/read', authenticate, (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating notification' });
  }
});


// --- ADMIN: USERS ---
app.get('/api/users', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const users = db.prepare('SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC').all();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- PORTFOLIO ---
app.get('/api/portfolio', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM portfolio_items ORDER BY created_at DESC').all();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/portfolio', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  const { image_url, title, description } = req.body;
  try {
    const result = db.prepare('INSERT INTO portfolio_items (image_url, title, description) VALUES (?, ?, ?)').run(image_url, title, description);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/portfolio/:id', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    db.prepare('DELETE FROM portfolio_items WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
