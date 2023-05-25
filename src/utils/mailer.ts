import {
  SendMailOptions,
  createTransport,
  getTestMessageUrl,
} from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

const configService = new ConfigService();

const smtp = configService.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>('smtp');

const transporter = createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendEmail(payload: SendMailOptions): Promise<void> {
  const logger = new Logger(sendEmail.name);
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      logger.error(err, 'Error sending email');
      return;
    }
    logger.log(`Preview URL: ${getTestMessageUrl(info)}`);
  });
}

export default sendEmail;
