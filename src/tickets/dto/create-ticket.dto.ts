import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  IsUppercase,
  Matches,
  ValidateNested,
} from 'class-validator';

class DateFormatDto {
  @IsNumber()
  year: number;
  @IsNumber()
  month: number;
  @IsNumber()
  day: number;
  @IsNumber()
  hour: number;
  @IsNumber()
  minutes?: number;
}

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

  @IsObject()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => DateFormatDto)
  dateEvent: DateFormatDto;

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
