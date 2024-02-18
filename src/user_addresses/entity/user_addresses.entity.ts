import { Order } from 'src/orders/entity/order.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user_addresses' })
export class UserAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  billingCity: string;

  @Column()
  billingState: string;

  @Column()
  billingArea: string;

  @Column()
  shippingCity: string;

  @Column()
  shippingState: string;

  @Column()
  shippingArea: string;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => User, (user) => user.userAddresses)
  user: User;

  @OneToMany(() => Order, (order) => order.userAddress)
  orders: Order[];
}
