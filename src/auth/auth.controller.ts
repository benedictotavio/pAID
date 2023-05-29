import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UsePipes,
  ValidationPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionAuthDto } from './dto/session-auth.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('sessions')
  login(@Body() createAuthDto: SessionAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Get('sessions/refresh')
  refreshToken(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.authService.refreshAccessTokenHandler(token);
  }
}
