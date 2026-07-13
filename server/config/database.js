const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './database.sqlite';
const absoluteDbPath = path.resolve(dbPath);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: absoluteDbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

module.exports = sequelize;
