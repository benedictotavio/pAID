import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { UsersModule } from 'src/users/users.module';
import { TradesModule } from 'src/trades/trades.module';

@Module({
  imports: [UsersModule, TradesModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
