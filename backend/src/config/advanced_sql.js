const injectAdvancedSQL = async (sequelize) => {
  try {
    console.log('Injecting Advanced SQL Structures...');

    // 1. Trigger: Update Reputation on Review (AFTER INSERT)
    await sequelize.query(`DROP TRIGGER IF EXISTS UpdateReputationOnReview;`);
    await sequelize.query(`
      CREATE TRIGGER UpdateReputationOnReview
      AFTER INSERT ON Reviews
      FOR EACH ROW
      BEGIN
        IF NEW.rating >= 4 THEN
          UPDATE Users SET reputationPoints = reputationPoints + 10 WHERE _id = NEW.reviewedUserId;
        END IF;
      END;
    `);

    // 2. Function: Get Average Rating (DETERMINISTIC)
    await sequelize.query(`DROP FUNCTION IF EXISTS GetAverageRating;`);
    await sequelize.query(`
      CREATE FUNCTION GetAverageRating(user_uuid VARCHAR(36)) 
      RETURNS DECIMAL(3,1)
      DETERMINISTIC
      BEGIN
        DECLARE avg_rating DECIMAL(3,1);
        SELECT AVG(rating) INTO avg_rating FROM Reviews WHERE reviewedUserId = user_uuid;
        RETURN IFNULL(avg_rating, 0.0);
      END;
    `);

    // 3. Procedure: Archive Old Requests (Date Filtering)
    await sequelize.query(`DROP PROCEDURE IF EXISTS ArchiveOldRequests;`);
    await sequelize.query(`
      CREATE PROCEDURE ArchiveOldRequests(IN days_old INT)
      BEGIN
        UPDATE Requests 
        SET status = 'cancelled' 
        WHERE status = 'pending' AND createdAt < DATE_SUB(NOW(), INTERVAL days_old DAY);
      END;
    `);

    // 4. Procedure with Cursor: Iterate and Sync All Reputations
    await sequelize.query(`DROP PROCEDURE IF EXISTS RecomputeAllReputations;`);
    await sequelize.query(`
      CREATE PROCEDURE RecomputeAllReputations()
      BEGIN
        DECLARE done INT DEFAULT FALSE;
        DECLARE curr_user_id VARCHAR(36);
        DECLARE curr_avg DECIMAL(3,1);
        
        DECLARE user_cursor CURSOR FOR SELECT _id FROM Users;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

        OPEN user_cursor;

        read_loop: LOOP
          FETCH user_cursor INTO curr_user_id;
          IF done THEN
            LEAVE read_loop;
          END IF;
          
          -- Calculate using the Function
          SET curr_avg = GetAverageRating(curr_user_id);
          
          -- Sync formula: average rating * 10
          UPDATE Users SET reputationPoints = FLOOR(curr_avg * 10) WHERE _id = curr_user_id;
        END LOOP;

        CLOSE user_cursor;
      END;
    `);

    console.log('✅ Advanced SQL Structures Successfully Injected!');
  } catch (error) {
    console.error('❌ Error injecting advanced SQL:', error);
  }
};

module.exports = injectAdvancedSQL;
