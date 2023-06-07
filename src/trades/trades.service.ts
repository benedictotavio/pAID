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
      console.log('Data Limite: ', newTrade.timeLimit);
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
      </div>
      <h4>Entre no link:<a> ${this.configService.get('web_url')}/${
            newTrade._id
          } </a></h4>
      <p>Voce tem até ${newTrade.timeLimit.toLocaleString('pt-br', {
        hour12: false,
        dateStyle: 'full',
        timeStyle: 'full',
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

  async findAllTradesByUser(id_user: string): Promise<object> {
    const userSession = await this.userService.findUserById(id_user);
    return userSession.trades;
  }

  private async defineTimeTrade(
    payload: CreateTradeDto
  ): Promise<Date | string> {
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
          payload.payment.price * 7666
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
    console.log('Data:', dateEvent);

    const today = new Date().getTime();
    const dateSpecific = dateEvent.getTime();

    if (dateSpecific < today) {
      return 'O evento ja foi!!!';
    }

    let dateToSendTicket: number =
      today +
      ((dateSpecific - today) / 2 + dateSpecific / today) +
      (dateSpecific - today) * 0.1;
    console.debug(dateToSendTicket);
    console.debug(
      new Date(dateToSendTicket).toLocaleDateString('pt-br', {
        dateStyle: 'short',
      })
    );
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
