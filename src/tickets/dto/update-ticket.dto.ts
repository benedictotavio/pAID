import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { UUID } from 'crypto';
import { IsUUID } from 'class-validator';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    @IsUUID()
    _id:UUID
}
