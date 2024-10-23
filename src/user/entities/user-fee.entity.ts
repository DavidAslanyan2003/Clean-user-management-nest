import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_fee')
export class UserFee {
  @ApiProperty({ description: 'User fee ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.fees)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'Type of fee', nullable: false })
  @Column({ type: 'enum', enum: [] })
  fee_type: string;

  @ApiProperty({ description: 'Fee amount', nullable: false })
  @Column({ type: 'int' })
  amount: number;

  @ApiProperty({
    description: 'Timestamp when the table was created',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the table was last updated',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
