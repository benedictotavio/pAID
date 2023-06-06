import {
  IsDate,
  IsNumber,
  IsString,
  IsUppercase,
  Matches,
} from 'class-validator';

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

  @Matches(
    /^(ingresso rápido|blacktag|ingresse|sympla|ticket360|tickets for fun|blueticket)+$/gi,
    {
      message: 'Plataform is not compatible.',
    }
  )
  @IsUppercase()
  @IsString()
  plataform:
    | 'INGRESSO RÁPIDO'
    | 'BLACKTAG'
    | 'INGRESSE'
    | 'SYMPLA'
    | 'TICKET360'
    | 'TICKETS FOR FUN'
    | 'BLUETICKET';
}
