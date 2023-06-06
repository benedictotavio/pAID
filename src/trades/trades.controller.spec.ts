// import { Test } from '@nestjs/testing';
// import { TradesService } from './trades.service';
// import { TradesController } from './trades.controller';
// import { randomUUID } from 'crypto';
// import { CreateTradeDto } from './dto/create-trade.dto';
// import { CreateTicketDto } from 'src/tickets/dto/create-ticket.dto';
// import { TicketsService } from 'src/tickets/tickets.service';

// describe('CatsController', () => {
//   let catsController: TradesController;
//   let tradesService: TradesService;
//   let ticketService: TicketsService;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       controllers: [TradesController],
//       providers: [TradesService, TicketsService],
//     }).compile();

//     tradesService = moduleRef.get<TradesService>(TradesService);
//     catsController = moduleRef.get<TradesController>(TradesController);
//   });

//   describe('findAll', () => {
//     it('should return an array of cats', async () => {
//       const result: CreateTicketDto = {
//         title: 'Tusca 2024',
//         category: 'event',
//         price: 125,
//         plataform: 'INGRESSE',
//         description: 'Ingresso 2 dias do tusca 2023: DJ GBR, Matheus e Kauan.',
//         dateEvent: new Date('07/22/2023'),
//       };
//       jest.spyOn(tradesService, 'createTrade').mockImplementation(() => result);

//       expect(await catsController.createTrade()).toBe(result);
//     });
//   });
// });
