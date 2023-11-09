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

export enum PaymentMethod{
  PIX,
  CREDIT_CARD,
  DEBIT_CARD,
}

class paymentTicket {
 @IsString()
  method: PaymentMethod;

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
