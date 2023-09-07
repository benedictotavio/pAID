import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class paymentTicket {
 @IsString()
  method: string;

  @IsNumber()
  @Min(1)
  @Max(6)
  installment: number;
}

export class AddCreditUserDto {
  @IsNumber()
  @Min(1)
  value: number;

  @IsObject()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => paymentTicket)
  payment: paymentTicket;
}
