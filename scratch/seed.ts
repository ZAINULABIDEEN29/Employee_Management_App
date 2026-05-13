import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../src/models/Admin';
import dbConnect from '../src/lib/mongodb';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seed() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    // Create a default Admin
    const email = 'admin@example.com';
    const password = 'password123';
    
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists');
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      await Admin.create({
        name: 'System Admin',
        email,
        passwordHash,
        role: 'SuperAdmin',
      });
      console.log('Admin created:');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
