import { HttpCode, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UsersService } from '../users/users.service';
import { Ticket } from './entities/ticket.entity';
import { Response } from 'express';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger();
  constructor(private readonly userService: UsersService) {}
  async addNewTicket(createTicketDto: CreateTicketDto) {
    const userSession = await this.userService.findUserById(
      createTicketDto.user
    );

    if (!userSession) {
      return 'Usuario não encontrado!';
    }

    try {
      userSession.tickets.unshift({
        title: createTicketDto.title,
        category: createTicketDto.category,
      });

      userSession.save();

      return userSession.tickets[0];
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async getTicketsByUser(id: string): Promise<Ticket[]> {
    const userSession = await this.userService.findUserById(id);

    return userSession.tickets;
  }
}
