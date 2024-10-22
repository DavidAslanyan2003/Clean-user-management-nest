import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Device } from './device.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('device_user')
export class DeviceUser {
  @ApiProperty({ description: 'ID for the device-user link' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.deviceUsers)
  user: User;

  @ManyToOne(() => Device, (device) => device.deviceUsers)
  device: Device;

  @ApiProperty({
    description: 'Timestamp when the device was created',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the device was last updated',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
