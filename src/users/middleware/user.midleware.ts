import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Jwt } from 'src/users/utils/jwt';

@Injectable()
export class UserMiddlewares implements NestMiddleware {
  constructor(private readonly jwt: Jwt) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      return next();
    }

    console.log(accessToken);

    const decoded = await this.jwt.verifyJwt(
      accessToken,
      'accessTokenPublicKey'
    );

    if (decoded) {
      res.locals.user = decoded;
    } else {
      res.status(404).send('User not logged');
    }

    return next();
  }
}
