import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetToken } from './entity/password-reset.entity';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import * as uuid from 'uuid';
import { MailerServiceService } from 'src/mailer-service/mailer-service.service';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { TokenStatus } from './enums/password-reset-status-enum';
import { ForgotPasswordDto } from './dtos/forgor-password.dto';

@Injectable()
export class PasswordResetService {
  private tokenExpirationTime = 10 * 60 * 1000;
  private salt = 10;
  constructor(
    @InjectRepository(PasswordResetToken)
    private passwordResetRepositoty: Repository<PasswordResetToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly emailService: MailerServiceService,
  ) {}

  async requestPasswordReset(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      const isToken = await this.checkToken(email);
      if (isToken) {
        throw new HttpException('Reset Link Already Sent', HttpStatus.CONFLICT);
      }
      const token = this.generateToken();
      const expiryDate = new Date(Date.now() + this.tokenExpirationTime);
      const resetToken = this.passwordResetRepositoty.create({
        token,
        expiresAt: expiryDate,
        user,
      });
      await this.passwordResetRepositoty.save(resetToken);
      await this.emailService.sendMail(email, token);
      return 'Reset Link Sent To Email';
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;
    const tokenRecord = await this.findToken(token);
    if (
      tokenRecord &&
      tokenRecord.token === token &&
      tokenRecord.status === TokenStatus.ACTIVE
    ) {
      const user = tokenRecord.user;
      this.isValid(tokenRecord);
      const hashedNewPassword = await bcrypt.hash(newPassword, this.salt);
      user.password = hashedNewPassword;
      await this.userRepository.save(user);
      await this.updateTokenStatus(tokenRecord.id, TokenStatus.USED);
      return 'Password Reset Successful';
    }
    throw new BadRequestException('Token invalid or Not Found');
  }

  generateToken() {
    const token = uuid.v4();
    return token;
  }

  isValid(tokenRecord: PasswordResetToken) {
    const { expiresAt } = tokenRecord;
    const currentTime = new Date(Date.now());
    if (currentTime > expiresAt) {
      this.updateTokenStatus(tokenRecord.id, TokenStatus.EXPIRED);
      throw new BadRequestException('Invalid or Expired Token');
    }
    return;
  }

  async findToken(token: string) {
    const tokenRecord = await this.passwordResetRepositoty.findOne({
      where: { token },
      relations: ['user'],
    });
    return tokenRecord;
  }

  async checkToken(email: string) {
    const tokenRecord = await this.passwordResetRepositoty.findOne({
      where: { user: { email }, status: TokenStatus.ACTIVE },
    });
    if (tokenRecord) {
      const { expiresAt } = tokenRecord;
      const currentTime = new Date(Date.now());
      if (currentTime > expiresAt) {
        await this.updateTokenStatus(tokenRecord.id, TokenStatus.EXPIRED);
        return;
      }
      return tokenRecord;
    }
    return;
  }

  async delete(id: number) {
    const tokenRecord = await this.passwordResetRepositoty.findOne({
      where: { id },
    });
    if (tokenRecord) {
      await this.passwordResetRepositoty.remove(tokenRecord);
    }
  }

  async updateTokenStatus(id: number, status: TokenStatus) {
    const tokenRecord = await this.passwordResetRepositoty.findOne({
      where: { id },
    });
    if (tokenRecord) {
      tokenRecord.status = status;
      await this.passwordResetRepositoty.save(tokenRecord);
    }
  }
}
