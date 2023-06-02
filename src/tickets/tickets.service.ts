import { Injectable, Logger } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UsersService } from '../users/users.service';
import { Ticket } from './entities/ticket.entity';
import { TradeTicketDto } from './dto/trade-ticket.dto';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { TradesService } from 'src/trades/trades.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger();
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly tradeService: TradesService
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
        price: createTicketDto.price,
        dateBuy: new Date(Date.now()),
      });

      await userSession.save();

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
    const usersSessionTranfer = await this.getUsersTranfers(
      id_seller,
      tradeTicketDto.emailBuyer
    );

    const ticketTrade = usersSessionTranfer.userSeller.tickets.find(
      (item) => item._id === tradeTicketDto.ticketId
    );

    if (!ticketTrade) {
      return `ticket ${tradeTicketDto.ticketId}, was not found! in User ${usersSessionTranfer.userSeller.firstName} ${usersSessionTranfer.userSeller.lastName}`;
    }

    if (usersSessionTranfer.userSeller.email === tradeTicketDto.emailBuyer) {
      return 'O usuario já possui o ticket selecionado!';
    }

    await this.tranferTicket(
      ticketTrade,
      usersSessionTranfer.userBuyer,
      usersSessionTranfer.userSeller
    );

    return `Finish trade between ${usersSessionTranfer.userSeller.firstName} and ${usersSessionTranfer.userBuyer.firstName}.`;
  }

  private async tranferTicket(
    ticketTrade: Ticket,
    userBuyer: User,
    userSeller: User
  ) {
    if (userSeller.tickets.length <= 0) {
      return 'O usuario não possui tickets cadastrados!';
    }

    if (!userBuyer) {
      return `You are not signed. Please Sign up in ${this.configService.get(
        'web_url'
      )}`;
    }

    try {
      await this.tradeService
        .createTrade({
          ticketId: ticketTrade._id,
          buyerId: userBuyer._id,
          salerId: userSeller._id,
          payment: {
            price: ticketTrade.price,
            installment: 1,
            method: 'PIX',
          },
        })
        .then((res) => {
          try {
            userSeller.trades.sales.unshift(res._id);
            userBuyer.trades.shop.unshift(res._id);
            userBuyer.tickets.unshift(ticketTrade);
            const index = userSeller.tickets.findIndex(
              (item) => item._id == ticketTrade._id
            );
            index >= 0 && userSeller.tickets.splice(index, 1);
            userBuyer.save();
            userSeller.save();
          } catch (error) {
            this.logger.debug(error);
          }
        });
    } catch (error) {
      throw new Error(error);
    }
  }
  private async getUsersTranfers(id: string, email: string) {
    const userSeller = await this.userService.findUserById(id);
    const userBuyer = await this.userService.findUserByEmail(email);

    return {
      userBuyer,
      userSeller,
    };
  }
}
