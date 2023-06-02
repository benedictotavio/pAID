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
  ) {}
  async createTrade(createTradeDto: CreateTradeDto) {
    const timeLimit = await this.defineTimeTrade(createTradeDto.payment.price);
    const newTrade = new this.tradeModel({ ...createTradeDto, timeLimit });
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
      price * 5595;
    return new Date(dateLititToTradeTicket);
  }

  private async configTradeOptions(): Promise<object> {
    
    return;
  }
}
