import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TradeTicketDto } from './dto/trade-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}
  @Post('new/:id')
  @UsePipes(new ValidationPipe())
  addNewTicket(
    @Body() createTicketDto: CreateTicketDto,
    @Param('id') id: string
  ) {
    return this.ticketsService.addNewTicket(createTicketDto, id);
  }

  @Get(':id')
  getTicketsByUser(@Param('id') id: string) {
    return this.ticketsService.getTicketsByUser(id);
  }

  @Get('expired')
  deleteAllTicketsExpired() {
    return this.ticketsService.deleteAllTicketsExpired();
  }

  @Post('trade')
  @UsePipes(new ValidationPipe())
  tradeTicket(@Body() tradeTicketDto: TradeTicketDto) {
    return this.ticketsService.tradeTicket(tradeTicketDto);
  }
}
