import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../schemas/transaction.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async getRewardsDistribution() {
    const distribution = await this.transactionModel.aggregate([
      {
        $group: {
          _id: '$category',
          totalPoints: { $sum: '$pointsEarned' },
          transactionCount: { $sum: 1 },
          avgPointsPerTransaction: { $avg: '$pointsEarned' }
        }
      },
      {
        $project: {
          category: '$_id',
          totalPoints: 1,
          transactionCount: 1,
          avgPointsPerTransaction: { $round: ['$avgPointsPerTransaction', 2] },
          _id: 0
        }
      }
    ]);

    return { distribution };
  }
}