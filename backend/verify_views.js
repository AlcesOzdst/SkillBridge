require('dotenv').config();
const { sequelize } = require('./src/config/db');

async function testViews() {
  try {
    await sequelize.authenticate();
    console.log('--- Connected to Database ---');
    
    // Inject/Refresh views first to ensure they exist
    const injectAdvancedSQL = require('./src/config/advanced_sql');
    await injectAdvancedSQL(sequelize);

    // 1. Query v_UserSummary
    console.log('\n--- Testing v_UserSummary ---');
    const [userSummary] = await sequelize.query('SELECT * FROM v_UserSummary LIMIT 5;');
    console.table(userSummary);

    // 2. Query v_SkillCatalog
    console.log('\n--- Testing v_SkillCatalog ---');
    const [skillCatalog] = await sequelize.query('SELECT * FROM v_SkillCatalog LIMIT 5;');
    console.table(skillCatalog);

    // 3. Query v_PendingSkillRequests
    console.log('\n--- Testing v_PendingSkillRequests ---');
    const [pendingRequests] = await sequelize.query('SELECT * FROM v_PendingSkillRequests LIMIT 5;');
    console.table(pendingRequests);

    console.log('\n✅ All Database Views verified successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying views:', error);
    process.exit(1);
  }
}

testViews();
