const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false, // set to console.log to see SQL queries
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`MySQL Connected via Sequelize on host: ${process.env.DB_HOST}`);
    
    // We require the index so models define associations, then sync
    require('../models');
    await sequelize.sync({ alter: true });
    console.log('Database schema synchronized');
  } catch (error) {
    console.error(`Error connecting to MySQL: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
