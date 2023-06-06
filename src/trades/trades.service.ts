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
    const timeLimit = await this.defineTimeTrade(createTradeDto.payment.price);
    const newTrade = new this.tradeModel({ ...createTradeDto, timeLimit });
    if (newTrade) {
      try {
        await this.mailer.sendEmail({
          to: createTradeDto.emailSaller,
          from: 'sales@paid.com',
          subject: 'Alerta de compra!',
          html: `<div>
      <h3>Parece que alguem comprou seu ticket</h3>
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

  private async defineTimeTrade(price: number): Promise<Date> {
    const dateLititToTradeTicket =
      Date.now() +
      +this.configService.get<number>('time.fixed_time') +
      price * 6595;
    return new Date(dateLititToTradeTicket);
  }

  private async configTradeOptions(): Promise<object> {
    return;
  }
}
