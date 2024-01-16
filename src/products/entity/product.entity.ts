import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  price: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
