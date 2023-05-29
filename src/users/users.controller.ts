import {
  Controller,
  Post,
  Body,
  Param,
  Query,
  ValidationPipe,
  UsePipes,
  Get,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  async createUserHandler(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUserHandler(createUserDto);
  }

  @UsePipes(new ValidationPipe())
  @Post('verify/:userId')
  async verifyUserHandler(
    @Param('userId') userId: string,
    @Query('verifyCode') verifyCode: string
  ): Promise<string> {
    return this.usersService.verifyUserHandler(userId, verifyCode);
  }

  @UsePipes(new ValidationPipe())
  @Post('forgotpassword')
  async forgotPasswordHandler(@Query('email') email: string): Promise<string> {
    return this.usersService.forgotPasswordHandler(email);
  }

  @UsePipes(new ValidationPipe())
  @Post('resetpassword')
  async resetPasswordHandler(
    @Body() passwordResetDto: PasswordResetDto,
  ): Promise<string> {
    return this.usersService.resetPasswordHandler(passwordResetDto);
  }

  @Get('me')
  async getCurrentUserHandler(@Res() res: Response) {
    return res.status(HttpStatus.FOUND).json(res.locals.user);
  }
}
