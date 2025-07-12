import { connect, disconnect } from 'mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { model } from 'mongoose';

async function seedData() {
  await connect('mongodb://localhost:27017/rewards-db');
  
  const UserModel = model(User.name, UserSchema);
  const RewardModel = model(Reward.name, RewardSchema);
  const TransactionModel = model(Transaction.name, TransactionSchema);
  
  // Clear existing data
  await UserModel.deleteMany({});
  await RewardModel.deleteMany({});
  await TransactionModel.deleteMany({});
  
  // Create mock users
  const users = await UserModel.insertMany([
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
  ]);
  
  // Create reward accounts
  const rewards = await RewardModel.insertMany([
    { userId: users[0]._id, totalPoints: 250 },
    { userId: users[1]._id, totalPoints: 150 },
  ]);
  
  // Create mock transactions
  await TransactionModel.insertMany([
    { userId: users[0]._id, amount: 100, category: 'shopping', pointsEarned: 50, timestamp: new Date('2024-01-15') },
    { userId: users[0]._id, amount: 200, category: 'dining', pointsEarned: 100, timestamp: new Date('2024-01-20') },
    { userId: users[0]._id, amount: 150, category: 'travel', pointsEarned: 75, timestamp: new Date('2024-01-25') },
    { userId: users[1]._id, amount: 80, category: 'shopping', pointsEarned: 40, timestamp: new Date('2024-01-18') },
    { userId: users[1]._id, amount: 120, category: 'dining', pointsEarned: 60, timestamp: new Date('2024-01-22') },
  ]);
  
  console.log('Mock data seeded successfully!');
  console.log('User IDs:', users.map(u => (u as any)._id.toString()));
  
  await disconnect();
}

seedData().catch(console.error);