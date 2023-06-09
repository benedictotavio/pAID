import { Inject, Injectable } from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trade.dto';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Trade, TradeDocument } from './entities/trade.entity';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { MailerService } from '../users/utils/mailer';

@Injectable()
export class TradesService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    @InjectModel(Trade.name) private readonly tradeModel: Model<TradeDocument>,
    @Inject(MailerService) private readonly mailer: MailerService
  ) {}

  async createTrade(createTradeDto: CreateTradeDto) {
    const ticket = await this.ticketSession(createTradeDto);
    const timeLimit = await this.defineTimeTrade(createTradeDto);
    const newTrade = new this.tradeModel({ ...createTradeDto, timeLimit });

    if (newTrade) {
      try {
        await this.mailer.sendEmail({
          to: createTradeDto.emailSaller,
          from: 'sales@paid.com',
          subject: 'Alerta de compra!',
          html: `<div>
      <h3>Parece que alguem comprou seu ticket</h3>
      <div>
      <h5>Nome do Ticket</h5>
      <p>${ticket.title}</p>
      <h5>Valor do Ticket</h5>
      <p>${ticket.price}</p>
      <h5>Plataforma</h5>
      <p>${ticket.plataform}</p>
      <h5>Data do Evento</h5>
      <p>${ticket.dateEvent.toLocaleString('pt-br', {
        hour12: false,
        dateStyle: 'full',
        timeStyle: 'medium',
      })}</p>
      </div>
      <h4>Entre no link:<a> ${this.configService.get('web_url')}/${
            newTrade._id
          } </a></h4>
      <p>Voce tem até ${newTrade.timeLimit.toLocaleString('pt-br', {
        hour12: false,
        dateStyle: 'full',
        timeStyle: 'medium',
      })} para enviar o ticket para o email: <b>${
            createTradeDto.emailBuyer
          }</b>.
        </p>
        <p>No caso do envio não ser identificado pelo sistema, a compra será cancelada.</p>
      </div>`,
        });
      } catch (error) {
        throw new Error(error);
      }
    }
    return await newTrade.save();
  }

  async findAllTradesByUser(id_user: string): Promise<object | string> {
    const userSession = await this.userService.findUserById(id_user);

    if (!userSession) {
      return 'User not found';
    }

    return userSession.trades;
  }

  private async defineTimeTrade(payload: CreateTradeDto): Promise<Date> {
    return await this.dateLimitToTradeTicket(payload);
  }

  private async dateLimitToTradeTicket(payload: CreateTradeDto) {
    const isDateEventToday = await this.isToday(
      (
        await this.ticketSession(payload)
      ).dateEvent
    ).then((res) => res);

    if (isDateEventToday) {
      return new Date(
        Date.now() +
          +this.configService.get<number>('time.fixed_time') +
          (await this.ticketSession(payload)).price * 7666
      );
    } else {
      return this.dateToSendTicket(
        (await this.ticketSession(payload)).dateEvent
      );
    }
  }

  private async ticketSession(payload: CreateTradeDto) {
    return (
      await this.userService.findUserByEmail(payload.emailSaller)
    ).tickets.find((item) => item._id === payload.ticketId);
  }

  private async dateToSendTicket(dateEvent: Date) {
    const today = new Date().getTime();
    const dateSpecific = dateEvent.getTime();

    let dateToSendTicket = today + (dateSpecific - today) * 0.8789;
    return new Date(dateToSendTicket);
  }

  private async isToday(date: Date) {
    const today = new Date();
    if (today.toDateString() === date.toDateString()) {
      return true;
    }
    return false;
  }

  private async configTradeOptions(): Promise<object> {
    return;
  }
}
