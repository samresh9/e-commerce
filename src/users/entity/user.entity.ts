import { Cart } from 'src/cart/entity/cart.entity';
import { Order } from 'src/orders/entity/order.entity';
import { Role } from 'src/role.enum';
import { UserAddress } from 'src/user_addresses/entity/user_addresses.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ nullable: false })
  phoneNumber: number;

  @Column({ nullable: true, type: 'enum', enum: Role, default: Role.Customer })
  roles: Role; //setting role to be enum

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.updated_by)
  ordersUpdatedBy: Order[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => UserAddress, (userAddress) => userAddress.user)
  userAddresses: UserAddress[];
}
