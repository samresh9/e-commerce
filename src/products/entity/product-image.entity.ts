import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product-images' })
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  title: string;

  @ManyToOne(() => Product, (product) => product.productImages)
  product: Product;
}
