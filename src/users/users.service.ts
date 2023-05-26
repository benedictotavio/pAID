import { Injectable, Logger } from '@nestjs/common';

// DTO`s
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

import { User, UserDocument } from './entities/user.entity';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { mailer } from 'src/users/utils/mailer';
import { randomUUID } from 'crypto';

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
        const userSession = new this.userModel({
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
            html: `<div>
            <h3>Verificação Código</h3>
            <h5>1º Passo</h5>
            <p>
            clique no link abaixo para finalizar a verificação
            </p>
            <h5>
            Link: <b>${this.configService.get<string>('web_url')}</b>
            </h5>
            <h5>2º Passo</h5>
            <p>
            Copie e cole o codigo <code>${
              userSession.verificationCode
            }</code> no site: <a>${process.env.WEB_URL}</a>
            </p>
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
      return 'User is not registered!';
    }

    // check to see if they are already verified
    if (userVerify.verified) {
      return 'User is already been verified';
    }

    // check to see if the verificationCode matches
    if (userVerify.verificationCode === verificationCode) {
      userVerify.verified = true;

      await userVerify.save();

      return 'User successfully verified';
    }

    return 'Could not verify user';
  }

  async forgotPasswordHandler(emailRequest: string): Promise<string> {
    this.logger.log(emailRequest);
    const emailUserPasswordReset = emailRequest;
    const userPasswordReset = await this.userModel.findOne({
      email: emailUserPasswordReset,
    });

    if (!userPasswordReset) {
      this.logger.debug(
        `User with email ${emailUserPasswordReset} does not exists`
      );
      return 'If a user with that email is registered you will receive a password reset email';
    }

    if (userPasswordReset.verified === false) {
      return 'User is not verified';
    }

    const passwordResetCode = randomUUID();

    userPasswordReset.passwordResetCode = passwordResetCode;

    await userPasswordReset.save();

    return 'Senha alterada com sucesso';
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
