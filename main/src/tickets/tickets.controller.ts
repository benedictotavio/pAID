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
import { UpdateTicketDto } from './dto/update-ticket.dto';

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

  @Post('edit/:id')
  @UsePipes(new ValidationPipe())
  updateTicket(
    @Body() updateTicketDto: UpdateTicketDto,
    @Param('id') id: string
  ) {
    return this.ticketsService.updateTicket(id, updateTicketDto);
  }

  @Get(':id')
  getTicketsByUser(@Param('id') id: string) {
    return this.ticketsService.getTicketsByUser(id);
  }

  @Post('trade')
  @UsePipes(new ValidationPipe())
  tradeTicket(@Body() tradeTicketDto: TradeTicketDto) {
    return this.ticketsService.tradeTicket(tradeTicketDto);
  }
}
