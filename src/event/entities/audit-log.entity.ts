import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// AuditLog Entity
@Entity()
export class AuditLog {
  @ApiProperty({
    example: 'log-id-123',
    description: 'ID for the audit log entry',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'event',
    description: 'Type of the entity being saved',
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  type: string;

  @ApiProperty({
    example: {
      id: 'a9f6d87e-6c3d-4f36-b087-bf9d7bc7b9f0',
      user_id: '5f9f1d3b-8e9d-4f0a-8465-3ed7e9b7cba0',
      status: 'active',
      slug: 'annual-tech-conference-1693455600',
      tags: [
        { id: '8e0f30d8-fc7c-4f69-8b77-91d2f749f45c', tag_name: 'Technology' },
        { id: '0c1b4354-f9a4-4782-a1c4-e94bb3cf0737', tag_name: 'Innovation' },
      ],
      faqs: [
        {
          id: 'f35e2b1f-620b-4a61-a1b8-8f9257e71200',
          question: 'What is the dress code?',
          answer: 'Business casual.',
        },
      ],
      categories: [
        { id: '4b9e2d5c-5d3a-4c2a-930a-7f1d85b7b93e', name: 'Conferences' },
      ],
      created_at: '2024-01-01T12:00:00Z',
      updated_at: '2024-01-02T14:30:00Z',
      version: 1,
    },
    description: 'The old value of the given entity',
  })
  @Column({ type: 'jsonb', unique: true, nullable: false })
  old_value: Record<string, any>;

  @ApiProperty({ example: 1, description: 'Version number for the record' })
  @Column({ type: 'int', nullable: false })
  version: number;

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
