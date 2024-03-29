import { Injectable } from '@nestjs/common';
import { AddCreditUserDto } from './dto/add-credit-user.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { TradesService } from '../trades/trades.service';

@Injectable()
export class CreditsService {
  constructor(private readonly userService: UsersService) {}
  async addCredits(id: string, value: number) {
    const userSessionAddTicket = await this.userService.findUserById(id);
    if (userSessionAddTicket) {
      userSessionAddTicket.paidCoins = userSessionAddTicket.paidCoins + value;
      userSessionAddTicket.save();
      return userSessionAddTicket.paidCoins;
    } else {
      throw new Error('User is not found!');
    }
  }

  private async emitDatabasePayment() {
    
  }
}
