import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { AccessToken } from './access-token.entity';
import { RefreshToken } from './refresh-token.entity';
import { VerificationCode } from './verification-code.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Device } from './device.entity';
import { UserFee } from './user-fee.entity';
import { B2CUserFavorites } from './b2c-user-favorites.entity';

@Entity('user')
export class User {
  @ApiProperty({
    example: '1e4a89f1-efc1-4b5b-8fcb-27b9b62c7b45',
    description: 'ID for the user',
    format: 'uuid',
  })
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
  @Column({ type: 'enum', enum: ['b2b', 'b2c', 'both'] })
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

  @OneToMany(
    () => VerificationCode,
    (verificationCode) => verificationCode.user,
  )
  verificationCodes: VerificationCode[];

  @OneToMany(() => AccessToken, (accessToken) => accessToken.user)
  accessTokens: AccessToken[];

  @ManyToMany(() => Device, (device) => device.users)
  devices: Device[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => UserFee, (fees) => fees.user)
  fees: UserFee[];

  @OneToMany(() => B2CUserFavorites, (favorites) => favorites.user)
  favorites: B2CUserFavorites[];
}
