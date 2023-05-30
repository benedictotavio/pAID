import { Injectable, Logger } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UsersService } from '../users/users.service';
import { Ticket } from './entities/ticket.entity';
import { TradeTicketDto } from './dto/trade-ticket.dto';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { TradesService } from 'src/trades/trades.service';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger();
  constructor(
    private readonly tradeService: TradesService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService
  ) {}
  async addNewTicket(
    createTicketDto: CreateTicketDto,
    id: string
  ): Promise<string | Ticket> {
    const userSession = await this.userService.findUserById(id);
    if (!userSession) {
      return 'Usuario não encontrado!';
    }
    try {
      userSession.tickets.unshift({
        _id: randomUUID(),
        category: createTicketDto.category,
        title: createTicketDto.title,
        dateBuy: new Date(Date.now()),
        price: createTicketDto.price,
      });

      userSession.save();

      return userSession.tickets[0];
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  async getTicketsByUser(id: string): Promise<Ticket[] | string> {
    const userSession = await this.userService.findUserById(id);

    if (userSession) {
      return userSession.tickets;
    } else {
      return 'Usuario não encontrado!';
    }
  }

  async tradeTicket(
    id_seller: string,
    tradeTicketDto: TradeTicketDto
  ): Promise<string> {
    const userSeller = await this.userService.findUserById(id_seller);

    if (!userSeller) {
      return 'Vendedor não esta cadastrado!';
    }

    const userBuyer = await this.userService.findUserByEmail(
      tradeTicketDto.emailBuyer
    );

    if (!userBuyer) {
      return `Voce não esta cadastrado. Faça seu cadastro em ${this.configService.get(
        'web_url'
      )}`;
    }

    const ticketTrade = userSeller.tickets.find(
      (item) => item._id === tradeTicketDto.ticketId
    );

    if (!ticketTrade) {
      return `Ticket ${tradeTicketDto.ticketId}, não foi encontrado no cadastro de ${userSeller.firstName} ${userSeller.lastName}`;
    }

    // Trade alagorithm section
    const tradeConfirmUsers = await this.tradeService.createTrade({
      ticketId: tradeTicketDto.ticketId,
      buyerId: userBuyer._id,
      salerId: userSeller._id,
      payment: {
        price: ticketTrade.price,
        installment: 1,
        method: 'PIX',
      },
    });

    if (tradeConfirmUsers) {
      this.logger.debug(tradeConfirmUsers);
      try {
        userBuyer.tickets.unshift(ticketTrade);
        const index = userSeller.tickets.findIndex(
          (item) => item._id == ticketTrade._id
        );

        index >= 0 && userSeller.tickets.splice(index, 1);

        userSeller.trades.sales.unshift(tradeConfirmUsers._id);
        userBuyer.trades.shop.unshift(tradeConfirmUsers._id);

        console.log(userSeller.trades);
        console.log(userBuyer.trades);
        console.debug('Vendedor: ', userSeller);
        
        userBuyer.save();
        userSeller.save();

        return `Finish trade between ${userSeller.firstName} and ${userBuyer.firstName}.`;
      } catch (error) {
        throw new Error(error.toString());
      }
    }
  }
}
