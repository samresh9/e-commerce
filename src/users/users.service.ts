import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UserToken } from './entity/user-token.entity';
import { MailerServiceService } from 'src/mailer-service/mailer-service.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private usersTokenRepository: Repository<UserToken>,
    private readonly mailService: MailerServiceService,
  ) {}

  //Checks if email is unique
  private salt = 10;
  async isExistingEmail(email: string) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email Already Exists');
    }
    return;
  }

  async find() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, this.salt);
    createUserDto.password = hashedPassword;
    const user = this.userRepository.create(createUserDto);
    await this.isExistingEmail(user.email);
    return this.userRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { password, newPassword, ...updateUserData } = updateUserDto;
    const user = await this.findOne(id);
    let hashedNewPassword: string;
    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new BadRequestException('Incorrect Password');
      }
      hashedNewPassword = await bcrypt.hash(newPassword, this.salt);
      user.password = hashedNewPassword;
    }
    return this.userRepository.save({ ...user, ...updateUserData });
  }

  async removeUser(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  async saveTokenId(id: number, tokenId: string) {
    const user = await this.findOne(id);
    //Check if user has related tokenId in Db
    const userToken = await this.usersTokenRepository.findOne({
      where: { user: { id } },
    });
    // update tokenId
    if (userToken) {
      const UpdateUserToken = this.usersTokenRepository.create({
        ...userToken,
        tokenId,
        user,
      });
      await this.usersTokenRepository.save(UpdateUserToken);
    } else {
      //create new userToken
      const newUserToken = this.usersTokenRepository.create({
        tokenId,
        user,
      });
      await this.usersTokenRepository.save(newUserToken);
    }
  }

  async hasValidToken(id: number, tokenId: any) {
    const userToken = await this.usersTokenRepository.findOne({
      where: [{ user: { id } }, { tokenId }],
    });

    const tokenIdFromDb = userToken?.tokenId;
    if (!tokenId) throw new UnauthorizedException('no');
    if (tokenId === tokenIdFromDb) return true;
    return false;
  }

  async sendMail() {
    return this.mailService.sendMail();
  }
}
