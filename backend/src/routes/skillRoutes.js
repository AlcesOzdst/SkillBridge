const express = require('express');
const { createSkill, getSkills, getUserSkills, updateSkill, deleteSkill } = require('../controllers/skillController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createSkill)
  .get(getSkills);

router.route('/user/:userId').get(getUserSkills);

router.route('/:id')
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

module.exports = router;
