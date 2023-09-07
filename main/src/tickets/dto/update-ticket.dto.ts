import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { UUID } from 'crypto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    @IsUUID()
    @IsNotEmpty()
    _id:UUID
}
