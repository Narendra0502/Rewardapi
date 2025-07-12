import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RewardsService } from '../services/rewards.service';
import { RedeemRewardDto } from '../dto/redeem-reward.dto';

@ApiTags('rewards')
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('points/:userId')
  @ApiOperation({ summary: 'Get user reward points' })
  @ApiResponse({ status: 200, description: 'User points retrieved successfully' })
  async getUserPoints(@Param('userId') userId: string) {
    return this.rewardsService.getUserPoints(userId);
  }

  @Get('transactions/:userId')
  @ApiOperation({ summary: 'Get user transactions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  async getUserTransactions(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.rewardsService.getUserTransactions(userId, page, limit);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Redeem reward points' })
  @ApiResponse({ status: 200, description: 'Reward redeemed successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient points' })
  async redeemReward(@Body() redeemDto: RedeemRewardDto) {
    return this.rewardsService.redeemReward(redeemDto);
  }

  @Get('options')
  @ApiOperation({ summary: 'Get available reward options' })
  @ApiResponse({ status: 200, description: 'Reward options retrieved successfully' })
  async getRewardOptions() {
    return this.rewardsService.getRewardOptions();
  }
}