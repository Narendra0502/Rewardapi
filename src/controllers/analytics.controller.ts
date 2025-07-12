import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from '../services/analytics.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('rewards-distribution')
  @ApiOperation({ summary: 'Get rewards distribution by category' })
  @ApiResponse({ status: 200, description: 'Rewards distribution retrieved successfully' })
  async getRewardsDistribution() {
    return this.analyticsService.getRewardsDistribution();
  }
}