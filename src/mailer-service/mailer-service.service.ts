import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerServiceService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(mail: string, token: string) {
    await this.mailerService.sendMail({
      to: mail, // list of receivers
      from: 'thapasamresh9@gmail.com', // sender address
      subject: 'Password Reset', // Subject line
      text: 'Password Reset', // plaintext body
      html: `
    <p>You have requested to reset your password. Please click the link below to reset your password:</p>
    <p><a href=${token}>Reset Password</a></p>
    <p>If you didn't request a password reset, you can safely ignore this email.</p>
  `,
    });
    return 'Success';
  }
}
