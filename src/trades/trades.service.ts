import { Injectable } from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
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
    const createdTrade = new this.tradeModel(createTradeDto);
    return await createdTrade.save();
  }

  async findAllTradesByUser(id_user: string): Promise<object> {
    const userSession = await this.userService.findUserById(id_user);
    return {
      sales: userSession.sales,
      buy: userSession.shop,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} trade`;
  }

  update(id: number, updateTradeDto: UpdateTradeDto) {
    return `This action updates a #${id} trade`;
  }

  remove(id: number) {
    return `This action removes a #${id} trade`;
  }
}
