import { Test, TestingModule } from '@nestjs/testing';
import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { Trade, TradeSchema } from './entities/trade.entity';
import { UsersModule } from '../users/users.module';

describe('TradesService', () => {
  let service: TradesService;

  const body: CreateTradeDto = {
    buyerId: '6479023bd9705d376fb2ebdc',
    salerId: '64790241d9705d376fb2ebdf',
    ticketId: 'd161e252-d096-4f3b-b6cd-34beaaa833f2',
    payment: {
      installment: 3,
      method: 'Brand',
      price: 130,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: Trade.name, schema: TradeSchema, collection: 'trades' },
        ]),
        UsersModule,
      ],
      providers: [TradesService],
    }).compile();

    service = module.get<TradesService>(TradesService);
  });

  it('should be defined', () => {
    expect(service.createTrade(body)).toBeDefined();
  });
});
