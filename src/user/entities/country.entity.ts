import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('country')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    type: 'string',
    example: '1e4a89f1-efc1-4b5b-8fcb-27b9b62c7b45',
    format: 'uuid',
  })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @ApiProperty({ type: 'string', example: 'Armenia' })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @ApiProperty({ type: 'string', example: '374' })
  code: string;

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
