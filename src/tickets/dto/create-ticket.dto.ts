import { IsDate, IsNumber, IsString, Matches } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  title: string;
  @Matches(/^(event|game)+$/gi, {
    message: 'Category must be a event or game.',
  })
  @IsString()
  category: 'event' | 'game';

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsString()
  dateEvent: Date;
}
