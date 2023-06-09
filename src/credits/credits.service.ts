import { Injectable } from '@nestjs/common';
import { AddCreditUserDto } from './dto/add-credit-user.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { TradesService } from '../trades/trades.service';

@Injectable()
export class CreditsService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly tradesService: TradesService
  ) {}
  async addCredits(id: string, value: number) {
    const userSessionAddTicket = await this.userService.findUserById(id);
    if (userSessionAddTicket) {
      userSessionAddTicket.paidCoins = userSessionAddTicket.paidCoins + value;
      return userSessionAddTicket.save();
    } else {
      throw new Error('User is not found!');
    }
  }
}
