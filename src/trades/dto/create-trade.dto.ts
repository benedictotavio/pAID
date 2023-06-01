import { IsDate, IsObject, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export type paymentTicket = {
  price: number;
  method: string;
  installment: number;
};

export class CreateTradeDto {
  @IsUUID()
  ticketId: UUID;
  @IsString()
  buyerId: string;
  @IsString()
  salerId: string;
  @IsObject()
  payment: paymentTicket;
}
