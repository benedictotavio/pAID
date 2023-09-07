import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './utils/mailer';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, MailerService],
  exports: [UsersService],
})
export class UsersModule {}
