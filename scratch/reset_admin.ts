import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../src/models/Admin';
import dbConnect from '../src/lib/mongodb';

async function reset() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');
    
    const email = 'admin@ems.com';
    const password = 'password123';
    
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      const passwordHash = await bcrypt.hash(password, 10);
      await Admin.updateOne({ email }, { passwordHash });
      console.log(`Password for ${email} reset to ${password}`);
    } else {
      console.log(`Admin ${email} not found`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

reset();
