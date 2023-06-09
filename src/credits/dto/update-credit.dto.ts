import { PartialType } from '@nestjs/mapped-types';
import { AddCreditUserDto } from './add-credit-user.dto';

export class UpdateCreditDto extends PartialType(AddCreditUserDto) {

    
}
