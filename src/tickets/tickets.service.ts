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
    private readonly tradesService: TradesService
  ) {}

  async addNewTicket(
    createTicketDto: CreateTicketDto,
    id: string
  ): Promise<string | Ticket> {
    const userSession = await this.userService.findUserById(id);

    if (!userSession) {
      return 'Usuario não encontrado!';
    }

    const dateEventTicket = new Date(
      createTicketDto.dateEvent.year,
      createTicketDto.dateEvent.month - 1,
      createTicketDto.dateEvent.day,
      createTicketDto.dateEvent.hour,
      createTicketDto.dateEvent.minutes
    );

    if (dateEventTicket.getTime() <= Date.now()) {
      return 'O evento não pode ocorrer no passado, rolezeiro!';
    }

    if (dateEventTicket.getTime() <= Date.now() + 6000000) {
      return 'A data do evento esta muito próxima para a venda!';
    }

    try {
      userSession.tickets.unshift({
        _id: randomUUID(),
        category: createTicketDto.category,
        title: createTicketDto.title,
        price: createTicketDto.price,
        plataform: createTicketDto.plataform.toUpperCase(),
        dateEvent: dateEventTicket,
        dateBuy: new Date(),
        description: createTicketDto.description,
        active: true,
      });
      await userSession.save();
      return userSession.tickets[0];
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getTicketsByUser(id: string): Promise<Ticket[] | void[] | string> {
    const userTicketsSession = await this.userService.findUserById(id);

    if (!userTicketsSession) {
      return 'Usuario não encontrado!';
    }

    if (userTicketsSession.tickets.length > 0) {
      this.userService.updateAllTicketsExpired(userTicketsSession._id);
      userTicketsSession.save();
    }

    return userTicketsSession.tickets;
  }

  async tradeTicket(tradeTicketDto: TradeTicketDto): Promise<string> {
    const usersSessionTranfer = await this.getUsersTranfers(tradeTicketDto);

    if (usersSessionTranfer.userSeller.tickets.length <= 0) {
      return `O vendedor não possui tickets disponiveis.`;
    }

    if (!usersSessionTranfer.userBuyer || !usersSessionTranfer.userSeller) {
      return `Um dos usuarios não foi encontrado.`;
    }

    const ticketTrade = usersSessionTranfer.userSeller.tickets.find(
      (item) => item._id === tradeTicketDto.ticketId
    );

    if (!ticketTrade) {
      return `ticket ${tradeTicketDto.ticketId}, was not found! in User ${usersSessionTranfer.userSeller.firstName} ${usersSessionTranfer.userSeller.lastName}`;
    }

    if (usersSessionTranfer.userSeller.email === tradeTicketDto.emailBuyer) {
      return 'O usuario já possui o ticket selecionado!';
    }

    if (usersSessionTranfer.userBuyer.paidCoins < ticketTrade.price) {
      return `${usersSessionTranfer.userBuyer.firstName} não possui paidCoins suficiente para comprar esse ticket.`;
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
      await this.tradesService
        .createTrade({
          ticketId: ticketTrade._id,
          emailSaller: userSeller.email,
          emailBuyer: userBuyer.email,
        })
        .then((res) => {
          try {
            userSeller.trades.sales.unshift({ _id: res._id, active: true });
            userBuyer.trades.shop.unshift({ _id: res._id, active: true });
            userBuyer.tickets.unshift(ticketTrade);
            const index = userSeller.tickets.findIndex(
              (item) => item._id == ticketTrade._id
            );
            index >= 0 && userSeller.tickets.splice(index, 1);
            userBuyer.paidCoins = userBuyer.paidCoins - ticketTrade.price;
            userSeller.paidCoins = userBuyer.paidCoins + ticketTrade.price;
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

  private async getUsersTranfers(payload: TradeTicketDto) {
    const userSeller = await this.userService.findUserByEmail(
      payload.emailSaller
    );
    const userBuyer = await this.userService.findUserByEmail(
      payload.emailBuyer
    );

    return {
      userBuyer,
      userSeller,
    };
  }
}
