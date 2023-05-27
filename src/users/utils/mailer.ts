import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SendMailOptions,
  createTransport,
  getTestMessageUrl,
} from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  constructor(private configService: ConfigService) {}

  public async sendEmail(payload: SendMailOptions) {
    const transporter = createTransport({
      service: 'gmail',
      host: this.configService.get('smtp.host'),
      port: 587,
      auth: {
        user: this.configService.get('smtp.user'),
        pass: this.configService.get('smtp.pass'),
      },
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2',
      },
    });
    transporter.sendMail(payload, (err, info) => {
      if (err) {
        this.logger.error(err, 'Error sending email');
        return;
      }
      this.logger.verbose(`Preview URL: ${getTestMessageUrl(info)}`);
    });
  }
}
