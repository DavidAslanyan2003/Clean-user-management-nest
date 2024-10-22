import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AccessToken } from './access-token.entity';
import { DeviceUser } from './device-user.entity';
import { RefreshToken } from './refresh-token.entity';
import { VerificationCode } from './verificationCode.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class User {
  @ApiProperty({ description: 'ID for the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'First name of the user' })
  @Column({ type: 'varchar', length: 255 })
  first_name: string;

  @ApiProperty({ description: 'Last name of the user' })
  @Column({ type: 'varchar', length: 255 })
  last_name: string;

  @ApiProperty({ description: 'Username of the user' })
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @ApiProperty({ description: 'Email address of the user', required: false })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string;

  @ApiProperty({ description: 'Phone number of the user', required: false })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  phone: string;

  @ApiProperty({ description: 'Password of the user' })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({ description: 'Type of user' })
  @Column({ type: 'varchar', length: 255 })
  user_type: string;

  @ApiProperty({
    description: 'Status of the user',
    enum: ['Active', 'Unverified', 'Deleted', 'Blocked'],
  })
  @Column({
    type: 'enum',
    enum: ['Active', 'Unverified', 'Deleted', 'Blocked'],
  })
  status: string;

  @ApiProperty({ description: 'Preferred language of the user' })
  @Column({ type: 'varchar', length: 255 })
  language: string;

  @ApiProperty({
    description: 'Reason for deletion, if applicable',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  deletion_reason: string;

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

  @OneToMany(
    () => VerificationCode,
    (verificationCode) => verificationCode.user,
  )
  verificationCodes: VerificationCode[];

  @OneToMany(() => AccessToken, (accessToken) => accessToken.user)
  accessTokens: AccessToken[];

  @OneToMany(() => DeviceUser, (deviceUser) => deviceUser.user)
  deviceUsers: DeviceUser[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
