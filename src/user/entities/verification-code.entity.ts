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

@Entity('verification_code')
export class VerificationCode {
  @ApiProperty({ description: 'ID for the verification code' })
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
    enum: ['active', 'inactive', 'verified'],
  })
  @Column({ type: 'enum', enum: ['active', 'inactive', 'verified'] })
  status: string;

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
