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

@Entity('access_token')
export class AccessToken {
  @ApiProperty({ description: 'ID for the access token' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.accessTokens)
  user: User;

  @ManyToOne(() => Device, (device) => device.accessTokens, { nullable: true })
  device: Device;

  @ApiProperty({ description: 'Access token value' })
  @Column({ type: 'text' })
  token: string;

  @ApiProperty({ description: 'Expiration timestamp of the access token' })
  @Column({ type: 'timestamp' })
  expires_at: Date;

  @ApiProperty({
    description: 'Indicates whether the token is currently active',
    default: true,
  })
  @Column({ type: 'bool', default: true, nullable: false })
  is_active: boolean;

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
