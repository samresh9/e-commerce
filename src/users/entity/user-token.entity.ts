import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_tokens' })
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tokenId: string;
}
