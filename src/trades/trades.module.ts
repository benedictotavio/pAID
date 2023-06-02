import { Module } from '@nestjs/common';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Trade, TradeSchema } from './entities/trade.entity';
import { UsersModule } from 'src/users/users.module';
import { MailerService } from 'src/users/utils/mailer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trade.name, schema: TradeSchema, collection: 'trades' },
    ]),
    UsersModule,
  ],
  controllers: [TradesController],
  providers: [TradesService, MailerService],
  exports: [TradesService],
})
export class TradesModule {}
