import { Inject, Injectable, Logger } from '@nestjs/common';
import { SessionAuthDto } from './dto/session-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './entities/auth.entity';
import { Model } from 'mongoose';
import { UserDocument, privateFields } from 'src/users/entities/user.entity';
import { Jwt } from 'src/users/utils/jwt';
import { get, omit } from 'lodash';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject(Jwt) private readonly jwt: Jwt,
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
    private readonly userService: UsersService
  ) {}
  async login(sessionAuthDto: SessionAuthDto): Promise<object | string> {
    const userLoginSession = await this.userService.findUserByEmail(
      sessionAuthDto.email
    );

    if (!userLoginSession) {
      return userLoginSession;
    }

    if (!userLoginSession.verified) {
      return 'Please verify your email';
    }

    // Validate password

    const isValid = await compare(
      sessionAuthDto.password,
      userLoginSession.password
    );

    if (!isValid) {
      return 'Invalid email or password';
    }

    const accessToken = await this.signAccessToken(userLoginSession);

    const refreshToken = await this.signRefreshToken({
      userId: userLoginSession._id,
    });

    return {
      accessToken,
      refreshToken,
      user: userLoginSession._id,
    };
  }

  async refreshAccessTokenHandler(
    refreshToken: string
  ): Promise<string | object> {
    type Decoded = {
      session: string;
    };

    const decoded = (await this.jwt.verifyJwt(
      refreshToken,
      'refreshTokenPublicKey'
    )) as Decoded;

    if (!decoded) {
      return 'Could not refresh access token';
    }

    try {
      const session = await this.authModel.findOne({
        _id: decoded.session,
      });

      console.log(session);

      if (!session || !session.valid) {
        return 'Could not refresh access token';
      }

      const userToken = await this.userService.findUserById(session.user);

      if (!userToken) {
        return 'Could not refresh access token';
      }

      const accessToken = this.signAccessToken(userToken);

      return accessToken;
    } catch (error) {
      return {
        error: error,
        message: 'Session is not find in Session Collection',
      };
    }
  }

  // Services Repositories

  private async signAccessToken(user: UserDocument) {
    const payload = omit(user.toJSON(), privateFields);

    const accessToken = await this.jwt.signJwt(
      payload,
      'accessTokenPrivateKey',
      {
        expiresIn: '15m',
      }
    );

    return accessToken;
  }
  private async signRefreshToken({ userId }: { userId: any }) {
    try {
      const session = await this.authModel.create({
        user: userId,
      });
      if (session) {
        const refreshToken = this.jwt.signJwt(
          {
            session: session._id,
          },
          'refreshTokenPrivateKey',
          {
            expiresIn: '1y',
          }
        );
        return refreshToken;
      } else {
        return 'Error refresh token';
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
  private async findSessionById(id: string) {
    return this.authModel.findById(id);
  }
}
