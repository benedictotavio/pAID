import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import sendEmail from 'src/utils/mailer';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>
  ) {}
  async createUserHandler(createUserDto: CreateUserDto) {
    const userBody = createUserDto;

    const saltOrRounds = await genSalt();

    const passwordHash = await hash(createUserDto.password, saltOrRounds);
    try {
      const userSession = await new this.userModel({
        ...userBody,
        password: passwordHash,
      });
      userSession.save();

      try {
        await sendEmail({
          to: userSession.email,
          from: 'test@example.com',
          subject: 'Verify your email',
          text: `Código de verificação(copie e cole o código no site Methas): ${userSession.verificationCode}`,
        });
        return userSession._id;
      } catch (error) {
        this.logger.error('Falha no envio de e-mail!', error);
      }
    } catch (e:any) {
      if (e.code === 11000) {
        return 'O Usuário ja esta em uso!'
      }else{
        return e
      }
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
