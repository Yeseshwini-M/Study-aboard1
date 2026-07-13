const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    req.session.adminId = admin.id;
    req.session.adminUsername = admin.username;

    return res.json({ success: true, message: 'Login successful.' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error logging out.' });
    }
    res.clearCookie('connect.sid');
    return res.json({ success: true, message: 'Logged out successfully.' });
  });
});

router.get('/status', (req, res) => {
  if (req.session && req.session.adminId) {
    return res.json({ loggedIn: true, username: req.session.adminUsername });
  }
  return res.json({ loggedIn: false });
});

module.exports = router;
