import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UserToken } from './entity/user-token.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private usersTokenRepository: Repository<UserToken>,
  ) {}

  //Checks if email is unique
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
    const salt = 10;
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, salt);
    createUserDto.password = hashedPassword;
    const user = this.userRepository.create(createUserDto);
    await this.isExistingEmail(user.email);
    return this.userRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  async removeUser(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  async saveTokenId(id: number, tokenId: string) {
    const user = await this.findOne(id);
    //create a new tokenId
    const userToken = this.usersTokenRepository.create({ tokenId });
    await this.usersTokenRepository.save(userToken);
    user.userToken = userToken;
    await this.userRepository.save(user);
  }
}
