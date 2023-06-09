import { Module } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import { UsersModule } from '../users/users.module';
import { TradesModule } from '../trades/trades.module';

@Module({
  imports:[UsersModule, TradesModule],
  controllers: [CreditsController],
  providers: [CreditsService]
})
export class CreditsModule {}
