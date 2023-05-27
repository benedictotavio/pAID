import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionAuthDto } from './dto/session-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('sessions')
  login(@Body() createAuthDto: SessionAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @UsePipes(new ValidationPipe())
  @Post('sessions/refresh')
  refreshToken(@Req() req: string) {
    return this.authService.refreshAccessTokenHandler(req);
  }
}
