import { Prop } from '@nestjs/mongoose';

export class Ticket{
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  category: string;
}
