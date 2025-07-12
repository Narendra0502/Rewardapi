import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { Reward } from '../schemas/reward.schema';
import { Transaction } from '../schemas/transaction.schema';
import { Redemption } from '../schemas/redemption.schema';

describe('RewardsService', () => {
  let service: RewardsService;
  let mockRewardModel: any;
  let mockTransactionModel: any;
  let mockRedemptionModel: any;

  beforeEach(async () => {
    mockRewardModel = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    mockTransactionModel = {
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };
    mockRedemptionModel = jest.fn().mockImplementation(() => ({
      save: jest.fn(),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        { provide: getModelToken(Reward.name), useValue: mockRewardModel },
        { provide: getModelToken(Transaction.name), useValue: mockTransactionModel },
        { provide: getModelToken(Redemption.name), useValue: mockRedemptionModel },
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
  });

  describe('getUserPoints', () => {
    it('should return user points', async () => {
      mockRewardModel.findOne.mockResolvedValue({ totalPoints: 100 });
      const result = await service.getUserPoints('507f1f77bcf86cd799439011');
      expect(result).toEqual({ totalPoints: 100 });
    });

    it('should return 0 points if user not found', async () => {
      mockRewardModel.findOne.mockResolvedValue(null);
      const result = await service.getUserPoints('507f1f77bcf86cd799439011');
      expect(result).toEqual({ totalPoints: 0 });
    });
  });

  describe('redeemReward', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockRewardModel.findOne.mockResolvedValue(null);
      await expect(service.redeemReward({ userId: '507f1f77bcf86cd799439011', points: 50, rewardType: 'cashback' }))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if insufficient points', async () => {
      mockRewardModel.findOne.mockResolvedValue({ totalPoints: 25 });
      await expect(service.redeemReward({ userId: '507f1f77bcf86cd799439011', points: 50, rewardType: 'cashback' }))
        .rejects.toThrow(BadRequestException);
    });

    it('should successfully redeem reward', async () => {
      const mockReward = { totalPoints: 100, save: jest.fn() };
      mockRewardModel.findOne.mockResolvedValue(mockReward);
      
      const result = await service.redeemReward({ userId: '507f1f77bcf86cd799439011', points: 50, rewardType: 'cashback' });
      
      expect(mockReward.totalPoints).toBe(50);
      expect(result.remainingPoints).toBe(50);
    });
  });
});