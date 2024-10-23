import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Device } from './device.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('refresh_token')
export class RefreshToken {
  @ApiProperty({ description: 'ID for the refresh token' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Device, { nullable: true })
  @JoinColumn({ name: 'device_id' })
  device: Device;

  @ApiProperty({ description: 'Refresh token value' })
  @Column({ type: 'text' })
  token: string;

  @ApiProperty({ description: 'Expiration timestamp of the token' })
  @Column({ type: 'timestamp' })
  expires_at: Date;

  @ApiProperty({
    description: 'Indicates whether the token is currently active',
    default: true,
  })
  @Column({ type: 'bool', default: true, nullable: false })
  is_active: boolean;

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
