import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { mailer } from 'src/users/utils/mailer';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly configService = new ConfigService();
  private readonly mailer = new mailer();
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>
  ) {}
  async createUserHandler(createUserDto: CreateUserDto) {
    const userBody = createUserDto;

    const saltOrRounds = await genSalt();

    const passwordHash = await hash(createUserDto.password, saltOrRounds);

    try {
      // Check if user already exists
      const UserInDataBase = await this.userModel.findOne({
        email: userBody.email,
      });

      if (!UserInDataBase) {
        const userSession = await new this.userModel({
          ...userBody,
          password: passwordHash,
        });

        userSession.save();

        try {
          await this.mailer.sendEmail({
            to: userSession.email,
            from: 'verify@paid.com',
            subject: 'Verify your email',
            text: `Código de verificação(copie e cole o código no site ${this.configService.get<string>(
              'web_url'
            )}): ${userSession.verificationCode}`,
            html: `<div><h3>Verification Code</h3>
            <h5>1º Passo</h5>
            <p>
            clique no link abaixo para finalizar a verificação ${this.configService.get<string>(
              'web_url'
            )}</p>
            </div>`,
          });
          return userSession;
        } catch (error) {
          this.logger.error('Falha no envio de e-mail!', error);
        }
      } else {
        this.logger.error('User is alrady registered!');
        return 'O Usuário ja esta em uso!';
      }
    } catch (e: any) {
      if (e.code === 11000) {
        return 'O Usuário ja esta em uso!';
      } else {
        return e;
      }
    }
  }

  async verifyUserHandler(userId: string, verificationCode: string) {
    const userVerify = await this.userModel.findOne({ _id: userId });

    if (!userVerify) {
      return 'Could not verify user';
    }

    // check to see if they are already verified
    if (userVerify.verified) {
      return 'User is already verified';
    }

    // check to see if the verificationCode matches
    if (userVerify.verificationCode === verificationCode) {
      userVerify.verified = true;

      await userVerify.save();

      return 'User successfully verified';
    }

    return 'Could not verify user';
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
