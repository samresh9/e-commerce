import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_tokens' })
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tokenId: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
