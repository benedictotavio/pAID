import { IsDate, IsEmail, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateTradeDto {
  @IsUUID()
  ticketId: UUID;
  @IsEmail()
  emailBuyer: string;
  @IsEmail()
  emailSaller: string;
}
