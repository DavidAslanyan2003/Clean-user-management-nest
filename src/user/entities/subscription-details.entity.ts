import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { B2BProfile } from './b2b-profile.entity';
import { SubscriptionStatusEnum } from '../enums/subscription-status.enum';
import { SubscriptionTypeEnum } from '../enums/subscription-type.enum';

@Entity('subscription_detail')
export class SubscriptionDetail {
  @ApiProperty({
    example: '1e4a89f1-efc1-4b5b-8fcb-27b9b62c7b45',
    description: 'Subscription detail ID',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => B2BProfile)
  @JoinColumn({ name: 'b2b_profile_id' })
  b2bProfile: B2BProfile;

  @ApiProperty({
    description: 'Subscription type',
    nullable: false,
    type: 'enum',
    enum: SubscriptionTypeEnum,
  })
  @Column({
    type: 'enum',
    enum: SubscriptionTypeEnum,
  })
  subscription_type: SubscriptionTypeEnum;

  @ApiProperty({ description: 'Subscription start date', nullable: false })
  @Column({ type: 'timestamp', nullable: false })
  start_date: Date;

  @ApiProperty({ description: 'Subscription end date', nullable: false })
  @Column({ type: 'timestamp', nullable: false })
  end_date: Date;

  @ApiProperty({
    description: 'Subscription status',
    nullable: false,
    type: 'enum',
    enum: SubscriptionStatusEnum,
  })
  @Column({ type: 'enum', enum: SubscriptionStatusEnum })
  status: SubscriptionStatusEnum;

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
