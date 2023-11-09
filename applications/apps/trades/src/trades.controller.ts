import { Controller, Get } from '@nestjs/common';
import { TradesService } from './trades.service';

@Controller()
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Get()
  getHello(): string {
    return this.tradesService.getHello();
  }
}
