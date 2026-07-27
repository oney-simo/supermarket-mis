const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function seedAdmin() {
  const mongoUri = process.env.MONGO_URI;
  const adminUsername = process.env.SEED_ADMIN_USERNAME || 'super_admin';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!mongoUri) {
    console.error('MONGO_URI is not defined.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);

    const existingAdmin = await User.findOne({ username: adminUsername });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      await mongoose.disconnect();
      return;
    }

    if (!adminPassword) {
      throw new Error('SEED_ADMIN_PASSWORD is not defined. Set it in your environment before running this script.');
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = await User.create({
      username: adminUsername,
      password: hashedPassword,
      role: 'admin',
      fullName: 'Super Admin',
      isActive: true
    });

    console.log(`Admin user created successfully: ${adminUser.username}`);
  } catch (error) {
    console.error('Failed to seed admin user:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
