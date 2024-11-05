import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { B2CDeliveryAddress } from './b2c-delivery-address.entity';

@Entity('b2c_profile')
export class B2CProfile {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    type: 'string',
    example: '1e4a89f1-efc1-4b5b-8fcb-27b9b62c7b45',
    format: 'uuid',
  })
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ type: 'int', default: 0 })
  loyalty_points: number;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ type: 'int', default: 0 })
  upcoming_events_count: number;

  @Column({ type: 'int' })
  @ApiProperty({ type: 'int' })
  following_list: number;

  @ManyToOne(() => B2CDeliveryAddress, (delivery) => delivery.b2cProfile)
  @JoinColumn({ name: 'delivery_id' })
  @ApiProperty({ type: () => B2CDeliveryAddress })
  deliveryAddress: B2CDeliveryAddress;

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