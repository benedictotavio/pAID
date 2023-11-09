import { Injectable } from '@nestjs/common';

@Injectable()
export class TradesService {
  getHello(): string {
    return 'Hello World!';
  }
}
