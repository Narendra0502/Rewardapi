import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Reward } from '../schemas/reward.schema';
import { Transaction } from '../schemas/transaction.schema';
import { Redemption } from '../schemas/redemption.schema';
import { RedeemRewardDto } from '../dto/redeem-reward.dto';
import { RewardsGateway } from '../gateways/rewards.gateway';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<Reward>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Redemption.name) private redemptionModel: Model<Redemption>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private rewardsGateway: RewardsGateway,
  ) {}

  async getUserPoints(userId: string) {
    const reward = await this.rewardModel.findOne({ userId: new Types.ObjectId(userId) });
    return { totalPoints: reward?.totalPoints || 0 };
  }

  async getUserTransactions(userId: string, page: number = 1, limit: number = 5) {
    const skip = (page - 1) * limit;
    const transactions = await this.transactionModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
    
    return transactions;
  }

  async redeemReward(redeemDto: RedeemRewardDto) {
    const { userId, points, rewardType } = redeemDto;
    
    const reward = await this.rewardModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!reward) {
      throw new NotFoundException('User reward account not found');
    }

    if (reward.totalPoints < points) {
      throw new BadRequestException('Insufficient points');
    }

    // Deduct points
    reward.totalPoints -= points;
    reward.updatedAt = new Date();
    await reward.save();

    // Create redemption record
    const redemption = new this.redemptionModel({
      userId: new Types.ObjectId(userId),
      pointsRedeemed: points,
      rewardType,
    });
    await redemption.save();

    // Notify via WebSocket
    this.rewardsGateway.notifyRedemption(userId, points, reward.totalPoints);

    return { message: 'Reward redeemed successfully', remainingPoints: reward.totalPoints };
  }

  async getRewardOptions() {
    const cacheKey = 'reward-options';
    let options = await this.cacheManager.get(cacheKey);
    
    if (!options) {
      options = [
        { type: 'cashback', pointsRequired: 100, description: '$10 Cashback' },
        { type: 'voucher', pointsRequired: 50, description: '$5 Shopping Voucher' },
        { type: 'discount', pointsRequired: 25, description: '10% Discount Coupon' },
      ];
      await this.cacheManager.set(cacheKey, options, 3600000); // Cache for 1 hour
    }
    
    return options;
  }
}