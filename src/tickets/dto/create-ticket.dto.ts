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
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class DateFormatDto {
  @IsNumber()
  @Min(new Date().getFullYear())
  @Max(new Date().getFullYear() + 5)
  year: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  @Min(1)
  @Max(31)
  day: number;

  @IsNumber()
  @Min(1)
  @Max(24)
  hour: number;
  
  @IsNumber()
  @Min(0)
  @Max(59)
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
