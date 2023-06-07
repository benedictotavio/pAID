import { Inject, Injectable, Logger } from '@nestjs/common';

// DTO`s
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { MailerService } from './utils/mailer';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @Inject(MailerService) private readonly mailer: MailerService,
    private readonly configService: ConfigService
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

      if (userBody.password != userBody.passwordConfirmation) {
        return `Password and confirmation password must be equal`;
      }

      if (!UserInDataBase) {
        const userSession = new this.userModel({
          ...userBody,
          password: passwordHash,
        });

        await userSession.save();

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
            }</code> no site: <a>${this.configService.get('web_url')}</a>
            </p>
            </div>`,
          });
          return userSession;
        } catch (error) {
          this.logger.error('Falha no envio de e-mail!', error);
        }
      } else {
        return `O e-mail ${createUserDto.email} ja esta em uso!`;
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

    await this.mailer.sendEmail({
      to: emailRequest,
      from: 'test@example.com',
      subject: 'Reset your password',
      text: `Password reset code: ${passwordResetCode}`,
    });

    this.logger.debug(`Password reset email sent to ${emailRequest}`);

    return userPasswordReset._id;
  }
  async resetPasswordHandler(passwordResetDto: PasswordResetDto) {
    const userResetPassword = await this.userModel.findOne({
      email: passwordResetDto.email,
    });

    if (
      !userResetPassword ||
      !userResetPassword.passwordResetCode ||
      userResetPassword.passwordResetCode !== passwordResetDto.passwordResetCode
    ) {
      return 'Could not reset user password';
    }

    userResetPassword.passwordResetCode = null;

    const saltOrRounds = await genSalt();

    const newPasswordHashed = await hash(
      passwordResetDto.newPassword,
      saltOrRounds
    );

    userResetPassword.password = newPasswordHashed;

    await userResetPassword.save();

    return 'Successfully updated password';
  }
  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }
  async findUserById(id: string) {
    try {
      return await this.userModel.findOne({ _id: id });
    } catch (error) {
      throw new Error(error);
    }
  }
}
