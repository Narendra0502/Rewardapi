import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { RewardsController } from './controllers/rewards.controller';
import { AnalyticsController } from './controllers/analytics.controller';
import { RewardsService } from './services/rewards.service';
import { AnalyticsService } from './services/analytics.service';
import { RewardsGateway } from './gateways/rewards.gateway';
import { User, UserSchema } from './schemas/user.schema';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { Redemption, RedemptionSchema } from './schemas/redemption.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/rewards-db'),
    CacheModule.register({ isGlobal: true }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Redemption.name, schema: RedemptionSchema },
    ]),
  ],
  controllers: [RewardsController, AnalyticsController],
  providers: [RewardsService, AnalyticsService, RewardsGateway],
})
export class AppModule {}