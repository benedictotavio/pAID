import { Module } from '@nestjs/common';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Trade, TradeSchema } from './entities/trade.entity';
import { UsersModule } from 'src/users/users.module';
import { MailerService } from 'src/users/utils/mailer';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRADES_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'trades',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
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
