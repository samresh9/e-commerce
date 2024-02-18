import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../enums/order-status.enum';
import { UserAddress } from 'src/user_addresses/entity/user_addresses.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  ordered_at: Date;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @Column({ nullable: true })
  shipped_at: Date;

  @Column({ nullable: true })
  delivered_at: Date;

  @ManyToOne(() => User, (user) => user.ordersUpdatedBy)
  updated_by: User;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => UserAddress, (UserAddress) => UserAddress.orders)
  userAddress: UserAddress;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
