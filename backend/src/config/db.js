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
    
    require('../models');
    await sequelize.sync({ alter: true });
    console.log('Database schema synchronized');

    // Inject advanced configurations (Academic requirements)
    const injectAdvancedSQL = require('./advanced_sql');
    await injectAdvancedSQL(sequelize);
  } catch (error) {
    console.error(`Error connecting to MySQL: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
