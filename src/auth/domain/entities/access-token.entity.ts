import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('access_tokens')
export class AccessToken {
  @ApiProperty({
    example: '8a7f8651-7a0f-4cb1-b93e-12a5142e34a3',
    description: 'ID for access token',
  })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @ApiProperty({
    description: 'Timestamp when the record was created',
    default: () => 'CURRENT_TIMESTAMP',
    example: '2024-08-19T12:34:56Z',
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public readonly createdAt?: Date;

  @ApiProperty({
    description: 'Timestamp when the record was last updated',
    default: () => 'CURRENT_TIMESTAMP',
    example: '2024-08-19T12:34:56Z',
  })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  public readonly updatedAt?: Date | null;

  @ApiProperty({ example: 'Token', description: 'Token value of the access token' })
  @Column({ type: 'varchar', length: 255 })
  public token: string;

  @ApiProperty({
    example: '8a7f8651-7a0f-4cb1-b93e-12a5142e34a3',
    description: 'ID for user',
  })
  @Column({ type: 'uuid', name: 'user_id' })
  public readonly userId: string;

  constructor(userId: string, token: string, updatedAt?: Date | null) {
    this.userId = userId;
    this.token = token;
    this.updatedAt = updatedAt ?? null;
  }
};

