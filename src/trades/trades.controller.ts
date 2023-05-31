import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto/create-trade.dto';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createTrade(@Body() createTradeDto: CreateTradeDto) {
    return this.tradesService.createTrade(createTradeDto);
  }

  @Get(':id')
  findAllTradesByUser(@Param('id') id: string) {
    return this.tradesService.findAllTradesByUser(id);
  }
}
