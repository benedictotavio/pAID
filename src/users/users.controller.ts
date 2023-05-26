import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  async createUserHandler(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUserHandler(createUserDto);
  }

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

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
