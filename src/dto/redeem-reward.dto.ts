import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RedeemRewardDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 100, minimum: 1 })
  @IsNumber()
  @Min(1)
  points: number;

  @ApiProperty({ example: 'cashback' })
  @IsString()
  rewardType: string;
}