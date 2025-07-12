import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class RewardsGateway {
  @WebSocketServer()
  server: Server;

  notifyPointsUpdate(userId: string, newPoints: number) {
    this.server.emit('pointsUpdated', { userId, newPoints });
  }

  notifyRedemption(userId: string, pointsRedeemed: number, remainingPoints: number) {
    this.server.emit('rewardRedeemed', { userId, pointsRedeemed, remainingPoints });
  }
}