import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerServiceService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail() {
    await this.mailerService.sendMail({
      to: 'Yukensubedi@gmail.com', // list of receivers
      from: 'thapasamresh9@gmail.com', // sender address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome', // plaintext body
      html: `
    <p>You have requested to reset your password. Please click the link below to reset your password:</p>
    <p><a href="rese">Reset Password</a></p>
    <p>If you didn't request a password reset, you can safely ignore this email.</p>
  `,
    });
    return 'Success';
  }
}
