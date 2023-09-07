import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, RmqContext } from '@nestjs/microservices';
import { TradesService } from './trades.service';
// import { CreateTradeDto } from './dto/create-trade.dto';
// import { UpdateTradeDto } from './dto/update-trade.dto';

@Controller()
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  logger = new Logger();

  @EventPattern('created_trade')
  create(createTradeDto: any, @Ctx() context: RmqContext): string {
    this.logger.debug(context);
    this.logger.debug(context.getMessage());
    const responseObj = new Object(createTradeDto);
    this.logger.debug(createTradeDto);
    responseObj.hasOwnProperty('buyer');
    return responseObj.hasOwnProperty('buyer')
      ? 'The buyer is here'
      : 'No buyer';
  }
}
