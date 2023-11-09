import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../../config/configuration';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UserMiddlewares } from './users/middleware/user.midleware';
import { UsersController } from './users/users.controller';
import { Jwt } from './users/utils/jwt';
import { TicketsModule } from './tickets/tickets.module';
import { TradesModule } from './trades/trades.module';
import { CreditsModule } from './credits/credits.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('mongo_uri'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'pAID',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    TicketsModule,
    TradesModule,
    CreditsModule,
  ],
  controllers: [],
  providers: [Jwt],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log(consumer.apply.name);
    console.log('Middleware is working!!!');
    consumer.apply(UserMiddlewares).forRoutes(UsersController);
  }
}
