const { User, Skill } = require('../models');

/**
 * Safely seeds the database with the default Admin account and test student accounts.
 * Idempotent: Only inserts accounts/skills if they do not already exist.
 * Never drops existing tables or alters user-created accounts.
 */
const seedDefaults = async () => {
  try {
    console.log('Checking default Admin & test accounts...');

    // 1. Ensure System Admin exists
    const adminEmail = 'admin@skillbridge.edu';
    let admin = await User.findOne({ where: { email: adminEmail } });
    if (!admin) {
      admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        passwordHash: 'admin123',
        role: 'admin',
        department: 'Administration',
        year: 'Staff',
        bio: 'Platform administrator for the SkillBridge campus network.',
        reputationPoints: 500,
      });
      console.log(`✅ Created Admin account: ${adminEmail} (password: admin123)`);
    } else {
      // If admin already exists, make sure they have admin role
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
        console.log(`✅ Promoted existing user ${adminEmail} to admin`);
      }
    }

    // 2. Ensure Test Student 1 (Axel Blaze) exists
    const axelEmail = 'axel@skillbridge.edu';
    let axel = await User.findOne({ where: { email: axelEmail } });
    if (!axel) {
      axel = await User.create({
        name: 'Axel Blaze',
        email: axelEmail,
        prn: 'PRN1001',
        passwordHash: 'student123',
        role: 'student',
        department: 'Computer Science',
        year: '3rd Year',
        bio: 'Enthusiastic front-end developer looking to learn ML and cloud architectures.',
        preferredMode: 'Hybrid',
        reputationPoints: 120,
      });

      await Skill.create({
        userId: axel._id,
        skillName: 'React & Tailwind',
        category: 'Web Development',
        type: 'offered',
        level: 'Intermediate',
        mode: 'Hybrid',
        description: 'I can teach you how to build modern responsive UIs with React and Tailwind CSS.',
      });

      await Skill.create({
        userId: axel._id,
        skillName: 'Machine Learning',
        category: 'Data Science',
        type: 'wanted',
        level: 'Beginner',
        mode: 'Online',
        description: 'Looking for a mentor to explain Neural Networks and scikit-learn basics.',
      });

      console.log(`✅ Created test student: ${axelEmail} (password: student123)`);
    }

    // 3. Ensure Test Student 2 (Mark Evans) exists
    const markEmail = 'mark@skillbridge.edu';
    let mark = await User.findOne({ where: { email: markEmail } });
    if (!mark) {
      mark = await User.create({
        name: 'Mark Evans',
        email: markEmail,
        prn: 'PRN1002',
        passwordHash: 'student123',
        role: 'student',
        department: 'Information Technology',
        year: '2nd Year',
        bio: 'ML researcher offering Python help in exchange for React basics.',
        preferredMode: 'Online',
        reputationPoints: 55,
      });

      await Skill.create({
        userId: mark._id,
        skillName: 'Python for ML',
        category: 'Data Science',
        type: 'offered',
        level: 'Advanced',
        mode: 'Online',
        description: 'Offering sessions on Python, pandas, scikit-learn, and basic neural networks.',
      });

      console.log(`✅ Created test student: ${markEmail} (password: student123)`);
    }

    // 4. Ensure Test Student 3 (Sarah Connor) exists
    const sarahEmail = 'sarah@skillbridge.edu';
    let sarah = await User.findOne({ where: { email: sarahEmail } });
    if (!sarah) {
      sarah = await User.create({
        name: 'Sarah Connor',
        email: sarahEmail,
        prn: 'PRN1003',
        passwordHash: 'student123',
        role: 'student',
        department: 'Design',
        year: 'Final Year',
        bio: 'UI/UX designer with 3 years of Figma experience. Looking to learn backend basics.',
        preferredMode: 'Hybrid',
        reputationPoints: 80,
      });

      await Skill.create({
        userId: sarah._id,
        skillName: 'Figma & UI Design',
        category: 'Design',
        type: 'offered',
        level: 'Advanced',
        mode: 'Hybrid',
        description: 'Design systems, prototyping, and wireframing using Figma.',
      });

      console.log(`✅ Created test student: ${sarahEmail} (password: student123)`);
    }

    console.log('✅ Default accounts and skills verified in database.');
  } catch (err) {
    console.error('Warning: could not seed default accounts:', err.message);
  }
};

module.exports = seedDefaults;
