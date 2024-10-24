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
import { FeeTypeEnum } from '../enums/fee-type.enum';

@Entity('user_fee')
export class UserFee {
  @ApiProperty({
    example: '1e4a89f1-efc1-4b5b-8fcb-27b9b62c7b45',
    description: 'User fee ID',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.fees)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    description: 'Type of fee',
    nullable: false,
    type: 'enum',
    enum: FeeTypeEnum,
  })
  @Column({ type: 'enum', enum: FeeTypeEnum })
  fee_type: FeeTypeEnum;

  @ApiProperty({ description: 'Fee amount', nullable: false })
  @Column({ type: 'int' })
  amount: number;

  @ApiProperty({
    description: 'Timestamp when the record was created',
    default: () => 'CURRENT_TIMESTAMP',
    example: '2024-08-19T12:34:56Z',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the record was last updated',
    default: () => 'CURRENT_TIMESTAMP',
    example: '2024-08-19T12:34:56Z',
  })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
