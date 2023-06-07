import { Test, TestingModule } from '@nestjs/testing';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';
import { randomUUID } from 'crypto';

describe('Trades Controller', () => {
  let controller: TradesController;

  const mockUserService = {
    buyer: {
      _id: 1,
      email: 'luis@outlook.com',
      firstName: 'Otavio',
      lastName: 'Benedicto',
      password: 'Otaxx@12',
      passwordConfirmation: 'Otaxx@12',
    },
    saler: {
      _id: 2,
      email: 'otavio.bene@outlook.com',
      firstName: 'Otavio',
      lastName: 'Benedicto',
      password: 'Otaxx@12',
      passwordConfirmation: 'Otaxx@12',
    },
  };

  const mockTicketsService = {
    _id: '1bc95490-d5e4-4edf-8923-d03ad68bf105',
    category: 'event',
    title: 'Tusca 2024',
    price: 125,
    plataform: 'INGRESSE',
    dateEvent: '2023-07-22T03:00:00.000Z',
    dateBuy: '2023-06-07T01:26:33.247Z',
    description: 'Ingresso 2 dias do tusca 2023: DJ GBR, Matheus e Kauan.',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradesController],
      providers: [TradesService],
    })
      .overrideProvider(TradesService)
      .useValue(mockUserService)
      .compile();
    controller = module.get<TradesController>(TradesController);
  });
  it('should create a trade', () => {
    expect(
      controller.createTrade({
        ticketId: randomUUID(),
        buyerId: '2',
        payment: {
          installment: 1,
          method: 'Pix',
          price: 125,
        },
        emailBuyer: mockUserService.buyer.email,
        emailSaller: mockUserService.saler.email,
      })
    ).toEqual('Finish trade between Otavio and Luis.');
  });
});
