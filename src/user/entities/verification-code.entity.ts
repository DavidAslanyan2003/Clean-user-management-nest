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
import { ApiProperty } from '@nestjs/swagger';
import { VerificationCodeStatus } from '../../helpers/enums/user.enum';

@Entity('verification_code')
export class VerificationCode {
  @ApiProperty({
    example: '1e4a89f1-efc1-4b5b-8fcb-27b9b62c7b45',
    description: 'ID for the verification code',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.verificationCodes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'Verification code' })
  @Column({ type: 'varchar', length: 10 })
  code: string;

  @ApiProperty({
    description: 'Status of the code',
    type: 'enum',
    enum: VerificationCodeStatus,
  })
  @Column({ type: 'enum', enum: VerificationCodeStatus })
  status: VerificationCodeStatus;

  @ApiProperty({ description: 'Timestamp when the code was sent' })
  @Column({ type: 'timestamp' })
  sent_at: Date;

  @ApiProperty({ description: 'Registration method associated with the code' })
  @Column({ type: 'varchar', length: 255 })
  registration_method: string;

  @ApiProperty({ description: 'Profile URL associated with the code' })
  @Column({ type: 'varchar', length: 255 })
  profile_url: string;

  @ApiProperty({ description: 'Expiration timestamp of the verification code' })
  @Column({ type: 'timestamp' })
  expires_at: Date;

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
