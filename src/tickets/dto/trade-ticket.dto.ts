import { IsEmail, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class TradeTicketDto {
  @IsUUID()
  ticketId: UUID;

  @IsEmail(
    {
      allow_display_name: true,
      allow_ip_domain: true,
      domain_specific_validation: true,
    },
    {
      message: 'email must be a valid format',
    }
  )
  @IsString()
  emailBuyer: string;
}
