import {
  Controller,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreditsService } from './credits.service';
import { AddCreditUserDto } from './dto/add-credit-user.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';

@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Post(':id')
  @UsePipes(new ValidationPipe())
  addCredits(
    @Param('id') id: string,
    @Body() addCreditUserDto: AddCreditUserDto
  ) {
    return this.creditsService.addCredits(id, addCreditUserDto.value);
  }
}
