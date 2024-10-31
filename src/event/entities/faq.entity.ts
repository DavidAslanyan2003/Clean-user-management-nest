import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class FAQ {
  @ApiProperty({
    example: '8a7f8651-7a0f-4cb1-b93e-12a5142e34a4',
    description: 'ID for the FAQ',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'ID of the associated Event',
  })
  @ManyToOne(() => Event, (event) => event.faqs)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ApiProperty({
    example: 'What is the event about?',
    description: 'Question in the FAQ',
  })
  @Column({ type: 'text', nullable: false })
  question: string;

  @ApiProperty({
    example: 'This event is about learning programming.',
    description: 'Answer in the FAQ',
  })
  @Column({ type: 'text', nullable: false })
  answer: string;

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

  @ApiProperty({ example: 1, description: 'Version number for the record' })
  @Column({ type: 'int', nullable: false })
  version: number;
}
