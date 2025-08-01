# Rewards API - NestJS + MongoDB

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB running on `localhost:27017`

### Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Seed database with mock data
npm run seed

# 3. Start development server
npm run start:dev
```

**API**: http://localhost:3000  
**Swagger Docs**: http://localhost:3000/api

## API Endpoints

### Get User Points
```bash
GET /rewards/points/{userId}
```

### Get User Transactions (Paginated)
```bash
GET /rewards/transactions/{userId}?page=1&limit=5
```

### Redeem Rewards
```bash
POST /rewards/redeem
{
  "userId": "USER_ID",
  "points": 50,
  "rewardType": "cashback"
}
```

### Get Reward Options
```bash
GET /rewards/options
```

### Analytics - Rewards Distribution (Bonus)
```bash
GET /analytics/rewards-distribution
```

### WebSocket Events (Bonus)
- `pointsUpdated`: Real-time point updates
- `rewardRedeemed`: Real-time redemption notifications

## Test the API

After seeding, use these sample User IDs (displayed in console):
```bash
# Example requests
curl http://localhost:3000/rewards/points/USER_ID_FROM_SEED
curl http://localhost:3000/rewards/options
```

## Testing
```bash
npm test
```

## Project Structure
```
src/
├── controllers/     # API endpoints
├── services/        # Business logic
├── schemas/         # MongoDB models
├── dto/            # Validation classes
└── main.ts         # App bootstrap
```

## Features Verified
✅ User points management  
✅ Transaction history with pagination  
✅ Reward redemption with validation  
✅ Error handling (insufficient points, invalid users)  
✅ Swagger documentation  
✅ Unit tests (5 passing)  
✅ MongoDB integration  
✅ Input validation

## Bonus Features
✅ Analytics endpoint (`/analytics/rewards-distribution`)  
✅ WebSocket real-time updates on redemptions  
✅ Caching for reward options (in-memory)#   R e w a r d a p i 
 
 
