require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');
const SQLiteStore = require('connect-sqlite3')(session);

const sequelize = require('./config/database');
const Admin = require('./models/admin');
require('./models/submission');

const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/form');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: './' }),
  secret: process.env.SESSION_SECRET || 'fallback_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/auth', authRoutes);
app.use('/api', formRoutes);
app.use('/api/admin', adminRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

async function initializeApp() {
  try {
    await sequelize.sync({ alter: false });
    console.log('✅ Database synchronized.');

    const adminCount = await Admin.count();
    if (adminCount === 0) {
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'admin123';
      const password_hash = await bcrypt.hash(password, 12);
      await Admin.create({ username, password_hash });
      console.log(`✅ Default admin created: ${username} / ${password}`);
      console.log('⚠️  IMPORTANT: Change your admin password in production!');
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 Edmissions World App running at http://localhost:${PORT}`);
      console.log(`   Form (Root): http://localhost:${PORT}/`);
      console.log(`   Portal:      http://localhost:${PORT}/portal.html`);
      console.log(`   Admin:       http://localhost:${PORT}/admin-login.html`);
      console.log(`   Dashboard:   http://localhost:${PORT}/admin-dashboard.html\n`);
    });
  } catch (err) {
    console.error('❌ Failed to start application:', err);
    process.exit(1);
  }
}

initializeApp();
