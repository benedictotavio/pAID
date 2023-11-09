import { NestFactory } from '@nestjs/core';
import { TicketsModule } from './tickets.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TicketsModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'tickets',
      queueOptions: {
        durable: false,
      },
      noAck: false
    },
  });

  await app.listen().then(() => new Logger().log('Ticket Microservices is running'))
}
bootstrap();
