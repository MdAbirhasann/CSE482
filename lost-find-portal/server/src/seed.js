import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Item from './models/Item.js';

const runSeed = async () => {
  await connectDB();

  await User.deleteMany({ email: 'demo@student.com' });
  const user = await User.create({
    name: 'Demo Student',
    email: 'demo@student.com',
    password: 'password123',
    phone: '+8801700000000'
  });

  await Item.deleteMany({ owner: user._id });

  await Item.create([
    {
      title: 'Lost black wallet near campus gate',
      description: 'A black leather wallet containing student ID and some cards was lost near the main gate.',
      itemType: 'lost',
      category: 'Wallet',
      city: 'Dhaka',
      area: 'Dhanmondi',
      locationText: 'Main campus gate, Dhanmondi, Dhaka',
      contactPhone: '+8801700000000',
      dateHappened: new Date(),
      reward: 500,
      owner: user._id
    },
    {
      title: 'Found student ID card',
      description: 'Found a university student ID card near the library stairs. Owner can verify name and department.',
      itemType: 'found',
      category: 'ID Card',
      city: 'Dhaka',
      area: 'Dhanmondi',
      locationText: 'Library stairs, Dhanmondi, Dhaka',
      contactPhone: '+8801700000000',
      dateHappened: new Date(),
      owner: user._id
    }
  ]);

  console.log('Seed completed. Demo email: demo@student.com | password: password123');
  await mongoose.disconnect();
};

runSeed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
