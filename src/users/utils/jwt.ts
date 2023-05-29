import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignOptions, sign, verify } from 'jsonwebtoken';

@Injectable()
export class Jwt {
  constructor(private readonly configService: ConfigService) {}
  async signJwt(
    object: Object,
    keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
    options: SignOptions
  ) {
    const privateKey = Buffer.from(
      this.configService.get<string>(keyName),
      'base64'
    ).toString('ascii');
    console.debug(privateKey);
    return sign(object, privateKey, {
      ...options,
      algorithm: 'RS256',
    });
  }

  async verifyJwt<T>(
    token: string | undefined,
    keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
  ): Promise<object | T> {
    const publicKey = Buffer.from(
      this.configService.get<string>(keyName),
      'base64'
    ).toString('ascii');

    try {
      const decoded = verify(token, publicKey, {
        algorithms: ['RS256'],
      }) as T | object;
      return decoded;
    } catch (err) {
      return err;
    }
  }
}
