import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { AccessToken } from './access-token.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity('device')
export class Device {
  @ApiProperty({
    example: '1e4a89f1-efc1-4b5b-8fcb-27b9b62c7b45',
    description: 'Unique identifier for the device',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID for the device' })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  device_identifier: string;

  @ApiProperty({ description: 'Name of the device' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  device_name: string;

  @ApiProperty({ description: 'Location of the device' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  device_location: string;

  @ApiProperty({ description: 'Last known IP address of the device' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  last_ip_address: string;

  @ApiProperty({ description: 'Last activity timestamp on the device' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  last_activity: string;

  @ApiProperty({
    description: 'Push notification token associated with the device',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  push_notification_token: string;

  @ApiProperty({
    description: 'Current version of the app installed on the device',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  app_version: string;

  @ApiProperty({
    description: 'Indicates whether the device is currently active',
    default: true,
  })
  @Column({ type: 'bool', default: true, nullable: false })
  is_device_active: boolean;

  @ApiProperty({
    description: 'Type of the device (e.g., mobile, tablet, etc.)',
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  device_type: string;

  @ApiProperty({ description: 'Timestamp of the last login from this device' })
  @Column({ type: 'timestamp', nullable: false })
  last_login: Date;

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

  @OneToMany(() => AccessToken, (accessToken) => accessToken.device)
  accessTokens: AccessToken[];

  @ManyToMany(() => User, (user) => user.devices)
  @JoinTable({
    name: 'user_devices',
    joinColumn: { name: 'device_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: User[];
}
