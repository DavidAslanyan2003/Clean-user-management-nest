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

@Entity('subscription_detail')
export class SubscriptionDetail {
  @ApiProperty({ description: 'Subscription detail ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => B2BProfile)
  @JoinColumn({ name: 'b2b_profile_id' })
  b2bProfile: B2BProfile;

  @ApiProperty({ description: 'Subscription type', nullable: false })
  @Column({
    type: 'enum',
    enum: ['free', 'per event', 'premium', 'enterprise'],
  })
  subscription_type: string;

  @ApiProperty({ description: 'Subscription start date', nullable: false })
  @Column({ type: 'timestamp', nullable: false })
  start_date: Date;

  @ApiProperty({ description: 'Subscription end date', nullable: false })
  @Column({ type: 'timestamp', nullable: false })
  end_date: Date;

  @ApiProperty({ description: 'Subscription status', nullable: false })
  @Column({ type: 'enum', enum: ['active', 'inactive', 'expired'] })
  status: string;

  @ApiProperty({
    description: 'Timestamp when the record was created',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the record was last updated',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
