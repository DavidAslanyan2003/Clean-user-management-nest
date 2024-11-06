import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventInstance } from './event-instance.entity';

@Entity()
export class Dates {
  @ApiProperty({
    example: '8a7f8651-7a0f-4cb1-b93e-12a5142e34a3',
    description: 'ID for the date entity',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '8a7f8651-7a0f-4cb1-b93e-12a5142e34a2',
    description: 'ID of the associated EventInstance',
  })
  @OneToOne(() => EventInstance)
  @JoinColumn({ name: 'event_instance_id' })
  eventInstance: EventInstance;

  @ApiProperty({
    example: '2022-12-12T10:00:00Z',
    description: 'Start date of the event instance',
  })
  @Column({ type: 'timestamp', nullable: false })
  start_date: Date;

  @ApiProperty({
    example: '2022-12-13T18:00:00Z',
    description: 'End date of the event instance',
  })
  @Column({ type: 'timestamp', nullable: false })
  end_date: Date;

  @ApiProperty({
    example: '10:00:00',
    description: 'Start time of the event instance',
  })
  @Column({ type: 'time', nullable: false })
  start_time: string;

  @ApiProperty({
    example: '18:00:00',
    description: 'End time of the event instance',
  })
  @Column({ type: 'time', nullable: false })
  end_time: string;

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
