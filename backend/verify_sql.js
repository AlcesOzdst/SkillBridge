require('dotenv').config();
const { sequelize } = require('./src/config/db');
const { User, Review } = require('./src/models');

async function testSQL() {
  try {
    await sequelize.authenticate();
    console.log('Connected.');
    
    // Test 1: Get an existing user
    const user = await User.findOne({ where: { email: 'mark@skillbridge.edu' } });
    if (!user) {
        console.log('Mark not found.');
        process.exit(1);
    }
    console.log('Mark ID:', user._id);
    console.log('Initial Reputation:', user.reputationPoints);

    // Test 2: Trigger test
    console.log('\n--- Testing Trigger ---');
    const { Request } = require('./src/models');
    const existingReq = await Request.findOne({ where: { providerId: user._id }}) || { _id: randomUUID() };

    await Review.create({
      requestId: existingReq._id,
      reviewedUserId: user._id,
      reviewerId: user._id, // normally you can't review yourself, but testing trigger
      rating: 5,
      feedback: 'Trigger test review'
    });
    console.log('Inserted 5-star review. Checking if reputation updated...');
    
    // Repull user to see if Trigger worked
    const userAfterStr = await User.findByPk(user._id);
    console.log('Reputation After Review Trigger (Should be +10):', userAfterStr.reputationPoints);

    // Test 3: Function test
    console.log('\n--- Testing Function ---');
    const [[{ avg }]] = await sequelize.query(`SELECT GetAverageRating('${user._id}') as avg;`);
    console.log('GetAverageRating() returned:', avg);

    // Test 4: Cursor and Procedure Test
    console.log('\n--- Testing Stored Procedure (Cursor) ---');
    await sequelize.query('CALL RecomputeAllReputations();');
    console.log('Executed RecomputeAllReputations.');
    
    const userFinal = await User.findByPk(user._id);
    console.log('Reputation After Recomputation Cursor:', userFinal.reputationPoints);
    
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
testSQL();
