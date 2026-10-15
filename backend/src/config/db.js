const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';
const useSSL = process.env.DB_SSL === 'true';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  logging: false, // set to console.log to see SQL queries
  dialectOptions: useSSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
        }
      }
    : {}
});

const connectDB = async () => {
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USER || '(unset)';
  const dbName = process.env.DB_NAME || '(unset)';

  console.log(`Attempting MySQL connection to ${user}@${host}:${port}/${dbName} (SSL: ${useSSL})...`);

  try {
    await sequelize.authenticate();
    console.log(`MySQL Connected via Sequelize on host: ${host}:${port}`);
    
    require('../models');

    // In production, avoid destructive automatic table alterations on every server boot.
    // Safe default in production: sync() creates missing tables without altering existing tables.
    // Set DB_SYNC_ALTER=true only if explicit table alteration is intended.
    const syncOptions = isProduction && process.env.DB_SYNC_ALTER !== 'true'
      ? {}
      : { alter: true };

    await sequelize.sync(syncOptions);
    console.log(`Database schema synchronized (alter: ${syncOptions.alter ? 'enabled' : 'disabled'})`);

    // Inject advanced configurations (Academic requirements: Triggers, Procedures, Cursors, Views)
    const injectAdvancedSQL = require('./advanced_sql');
    await injectAdvancedSQL(sequelize);

    // Seed default admin and test accounts if they do not exist
    const seedDefaults = require('./seedDefaults');
    await seedDefaults();
  } catch (error) {
    console.error(`Error connecting to MySQL: ${error.message}`);
    if (error.message && error.message.includes('ETIMEDOUT')) {
      console.error(`⚠️  ETIMEDOUT Check: Could not reach host '${host}' on port '${port}'.`);
      console.error(`   If using Railway MySQL: You must use the Public TCP Proxy (e.g. *.proxy.rlwy.net with its custom 5-digit port).`);
      console.error(`   Do NOT use 'mysql.railway.internal', 'localhost', or port 3306 from external hosts.`);
    }
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
