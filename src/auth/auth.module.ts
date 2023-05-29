import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './entities/auth.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';
import { Jwt } from 'src/users/utils/jwt';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema, collection: 'auth_sessions' },
    ]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, Jwt],
  exports: [AuthService],
})
export class AuthModule {}
