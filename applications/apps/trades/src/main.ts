import { NestFactory } from '@nestjs/core';
import { TradesModule } from './trades.module';

async function bootstrap() {
  const app = await NestFactory.create(TradesModule);
  await app.listen(3000);
}
bootstrap();
