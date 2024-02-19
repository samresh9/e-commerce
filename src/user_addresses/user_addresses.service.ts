import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAddress } from './entity/user_addresses.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateUserAddressesDto } from './dtos/create-user-address.dto';
import { User } from 'src/users/entity/user.entity';
import { UpdateUserAddressesDto } from './dtos/update-user-address.dto';

@Injectable()
export class UserAddressesService {
  constructor(
    @InjectRepository(UserAddress)
    private userAddressesRepository: Repository<UserAddress>,
    private usersService: UsersService,
  ) {}

  async create(createUserAddressesDto: CreateUserAddressesDto, userId: number) {
    const currentUser = await this.usersService.findOne(userId);

    const newAddress = this.userAddressesRepository.create({
      ...createUserAddressesDto,
      user: currentUser,
    });

    const defaultAddress = await this.defaultAddress(currentUser);

    if (!defaultAddress) {
      newAddress.isDefault = true;
    }

    const savedAddress = await this.userAddressesRepository.save(newAddress);

    if (defaultAddress && newAddress.isDefault) {
      defaultAddress.isDefault = false;
      await this.userAddressesRepository.save(defaultAddress);
    }
    return savedAddress;
  }

  async update(
    updateUserAddressDto: UpdateUserAddressesDto,
    addressId: number,
    userId: number,
  ) {
    const currentUser = await this.usersService.findOne(userId);
    await this.validateId(addressId, userId);
    const existingAddress = await this.findOne(addressId);

    const existingAddresses = await this.findAddressesByUserId(userId);
    if (existingAddresses.length === 1 && !updateUserAddressDto.isDefault) {
      throw new BadRequestException('Should Be Atleast One Default Address');
    }
    const defaultAddress = await this.defaultAddress(currentUser);
    //find the length of the address of the current user if it is more than one then let to update the default address otherwise donot

    if (defaultAddress && updateUserAddressDto.isDefault) {
      defaultAddress.isDefault = false;
      await this.userAddressesRepository.save(defaultAddress);
    }
    return await this.userAddressesRepository.save({
      ...existingAddress,
      ...updateUserAddressDto,
    });
  }

  async findOne(id: number) {
    const userAddress = await this.userAddressesRepository
      .createQueryBuilder('useraddresses')
      .where('useraddresses.id = :id', { id })
      .getOne();

    if (!userAddress) throw new NotFoundException('User Address Not Found');

    return userAddress;
  }

  async findAddressesByUserId(userId: number) {
    const userAddresses = await this.userAddressesRepository
      .createQueryBuilder('useraddresses')
      .where('useraddresses.user.id = :userId', { userId })
      .getMany();

    if (!userAddresses) throw new NotFoundException('User Address Not Found');

    return userAddresses;
  }
  async defaultAddress(currentUser: User) {
    const defaultAddress = await this.userAddressesRepository.findOne({
      where: { user: { id: currentUser.id }, isDefault: true },
    });
    return defaultAddress;
  }
  async findAll() {
    const userAddress = await this.userAddressesRepository
      .createQueryBuilder('useraddresses')
      .leftJoinAndSelect('useraddresses.user', 'user')
      .getMany();

    if (!userAddress) return new NotFoundException('User Addresses Not Found');
    return userAddress;
  }

  async validateId(id: number, userId: number) {
    const userAddress = await this.userAddressesRepository
      .createQueryBuilder('useraddresses')
      .where('useraddresses.id = :id', { id })
      .andWhere('useraddresses.user.id =:userId', { userId })
      .getOne();
    if (!userAddress) throw new NotFoundException('Not Found Error');
    return true;
  }

  async delete(id: number, userId: number) {
    await this.validateId(id, userId);
    const deleted = await this.userAddressesRepository
      .createQueryBuilder()
      .delete()
      .from(UserAddress)
      .where('id=:id', { id })
      .execute();
    return { deleteCount: deleted.affected };
  }
}
