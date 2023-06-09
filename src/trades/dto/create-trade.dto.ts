import { IsDate, IsEmail, IsObject, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateTradeDto {
  @IsUUID()
  ticketId: UUID;
  @IsString()
  buyerId: string;
  @IsEmail()
  emailBuyer: string;
  @IsEmail()
  emailSaller: string;
}
