import {
  IsDate,
  IsNumber,
  IsString,
  Matches,
  IsISO8601,
  IsDateString
} from 'class-validator';

export class CreateTicketDto {
  @IsString()
  title: string;
  @Matches(/^(party|theater|sports|)+$/gi, {
    message: 'Category invalid! You must use: party, sports or theater',
  })
  @IsString()
  category: 'party' | 'theater' | 'sports';

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsDateString()
  @IsISO8601()
  dateEvent: string;

  @Matches(
    /^(ingresso rápido|blacktag|ingresse|sympla|ticket360|tickets for fun|blueticket)+$/gi,
    {
      message: 'Plataform is not compatible.',
    }
  )
  @IsString()
  plataform:
    | 'ingresso rapido'
    | 'blacktag'
    | 'ingresse'
    | 'sympla'
    | 'ticket360'
    | 'tickets for fun'
    | 'blueticket';
}
