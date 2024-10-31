import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Agenda } from './agenda.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from './event.entity';
import { EventInstanceStatusEnum } from '../enums/event-instance-status.enum';

@Entity()
export class EventInstance {
  @ApiProperty({
    example: '8a7f8651-7a0f-4cb1-b93e-12a5142e34a2',
    description: 'ID for the event instance',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'Event ID to which this instance belongs',
  })
  @ManyToOne(() => Event, (event) => event.eventInstances)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ApiProperty({
    example: EventInstanceStatusEnum.ACTIVE,
    description: 'Status of the event instance',
    default: EventInstanceStatusEnum.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: EventInstanceStatusEnum,
    default: EventInstanceStatusEnum.ACTIVE,
  })
  status: EventInstanceStatusEnum;

  //   @ManyToOne(() => Venue)
  //   @JoinColumn()
  //   @ApiProperty({ example: 'venue', description: 'The events venue' })
  //   venue: Venue;

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

  @ApiProperty({
    example: [
      {
        eventId: 'df37b6ce-e833-4a42-a02e-c6fe04df0e3d',
        date: '2025-01-01',
      },
    ],
    description: 'Agendas of the event instance',
  })
  @OneToMany(() => Agenda, (agenda) => agenda.eventInstance)
  agendas: Agenda[];
}
