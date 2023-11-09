import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { UsersModule } from 'src/users/users.module';
import { TradesModule } from 'src/trades/trades.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'TICKETS_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'tickets',
        queueOptions: {
          durable: false
        },
      },
    },
  ]), UsersModule, TradesModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule { }
