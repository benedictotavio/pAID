import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SendMailOptions,
  createTransport,
  getTestMessageUrl,
} from 'nodemailer';

export class mailer {
  private readonly logger = new Logger(mailer.name);
  constructor(private configService?: ConfigService) {}

  transporter = createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2',
    },
  });

  public async sendEmail(payload: SendMailOptions) {
    this.logger.log(this.transporter);
    this.transporter.sendMail(payload, (err, info) => {
      if (err) {
        this.logger.error(err, 'Error sending email');
        return;
      }
      this.logger.verbose(`Preview URL: ${getTestMessageUrl(info)}`);
    });
  }
}
