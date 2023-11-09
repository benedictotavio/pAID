import { Prop } from '@nestjs/mongoose';
import { PaymentMethod } from '../dto/add-credit-user.dto';

export type paymentTicket = {
  method: PaymentMethod;
  installment: number;
};

export class Credit {
  @Prop({ type: Number, required: true })
  credits: number;
  @Prop({ type: Object, required: true })
  payment: paymentTicket;
}
