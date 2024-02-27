import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetToken } from './entity/password-reset.entity';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import * as uuid from 'uuid';
import { MailerServiceService } from 'src/mailer-service/mailer-service.service';

@Injectable()
export class PasswordResetService {
  private tokenExpirationTime = 10 * 60 * 1000;
  constructor(
    @InjectRepository(PasswordResetToken)
    private passwordResetRepositoty: Repository<PasswordResetToken>,
    private readonly userService: UsersService,
    private readonly emailService: MailerServiceService,
  ) {}

  async requestPasswordReset(body: any) {
    const { email } = body;
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      const token = this.generateToken();
      const expiryDate = new Date(Date.now() + this.tokenExpirationTime);
      const resetToken = this.passwordResetRepositoty.create({
        token,
        expiresAt: expiryDate,
        user,
      });
      await this.passwordResetRepositoty.save(resetToken);
      await this.emailService.sendMail(email, token);
      return;
    }
  }

  generateToken() {
    const token = uuid.v4();
    return token;
  }
}
