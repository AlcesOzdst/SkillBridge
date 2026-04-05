require('dotenv').config();
const { sequelize } = require('./config/db');
const { User, Skill } = require('./models');

const seedDatabase = async () => {
  try {
    // Authenticate and sync
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // CARE: Drops existing tables
    console.log('Database synced for seeding...');

    // 1. Create Admin
    await User.create({
      name: 'System Admin',
      email: 'admin@skillbridge.edu',
      passwordHash: 'admin123',
      role: 'admin',
      department: 'Admin',
      year: 'Staff'
    });

    // 2. Create Students
    const axel = await User.create({
      name: 'Axel Blaze',
      email: 'axel@skillbridge.edu',
      prn: 'PRN1001',
      passwordHash: 'student123',
      department: 'Computer Science',
      year: '3rd Year',
      bio: 'Enthusiastic front-end developer looking to learn ML.',
      preferredMode: 'Hybrid',
      reputationPoints: 120 // Should get 'Skill Hero' and others via hooks
    });

    const mark = await User.create({
      name: 'Mark Evans',
      email: 'mark@skillbridge.edu',
      prn: 'PRN1002',
      passwordHash: 'student123',
      department: 'Information Technology',
      year: '2nd Year',
      bio: 'ML researcher offering Python help in exchange for React basics.',
      preferredMode: 'Online',
      reputationPoints: 55 // 'Campus Guide'
    });

    // 3. Create Skills
    await Skill.create({
      userId: axel._id,
      skillName: 'React & Tailwind',
      category: 'Web Development',
      type: 'offered',
      level: 'Intermediate',
      mode: 'Hybrid',
      description: 'I can teach you how to build beautiful modern UIs with React and TailwindCSS.'
    });

    await Skill.create({
      userId: axel._id,
      skillName: 'Machine Learning',
      category: 'Data Science',
      type: 'wanted',
      level: 'Beginner',
      mode: 'Online',
      description: 'Looking for someone to explain Neural Networks.'
    });

    await Skill.create({
      userId: mark._id,
      skillName: 'Python for ML',
      category: 'Data Science',
      type: 'offered',
      level: 'Advanced',
      mode: 'Online',
      description: 'I will teach you pandas, scikit-learn, and basic neural networks.'
    });

    console.log('🎉 Database Successfully Seeded!');
    process.exit(0);

  } catch (error) {
    console.error('Failed to seed DB:', error);
    process.exit(1);
  }
};

seedDatabase();
