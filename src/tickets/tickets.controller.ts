import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}
  @Post('new')
  addNewTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.addNewTicket(createTicketDto);
  }

  @Get(':id')
  getTicketsByUser(@Param('id') id: string) {
    return this.ticketsService.getTicketsByUser(id);
  }
}
