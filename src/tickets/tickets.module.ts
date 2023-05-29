import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { UsersModule } from 'src/users/users.module';
import { Ticket } from './entities/ticket.entity';

@Module({
  imports: [UsersModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
