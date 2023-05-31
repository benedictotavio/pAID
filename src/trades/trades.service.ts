import { Injectable } from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trade.dto';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Trade, TradeDocument } from './entities/trade.entity';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TradesService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    @InjectModel(Trade.name) private readonly tradeModel: Model<TradeDocument>
  ) {}
  async createTrade(createTradeDto: CreateTradeDto) {
    const newTrade = new this.tradeModel(createTradeDto);
    return await newTrade.save();
  }

  async findAllTradesByUser(id_user: string): Promise<object> {
    const userSession = await this.userService.findUserById(id_user);
    return {
      sales: userSession.sales,
      buy: userSession.shop,
    };
  }

  private async defineTimeTrade(timeTrade: Date, price: number) {
    const dateLititToTradeTicket =
      timeTrade.getTime() +
      this.configService.get<number>('time.fixed_time') +
      price;

    return new Date(dateLititToTradeTicket);
  }

  private async configTradeOptions(){

  }
}
