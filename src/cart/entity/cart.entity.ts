import { Product } from 'src/products/entity/product.entity';
import { User } from 'src/users/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.carts)
  product: Product;

  @ManyToOne(() => User, (user) => user.carts)
  user: User;
}
