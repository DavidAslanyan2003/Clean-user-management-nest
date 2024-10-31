import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { EventInstance } from './event-instance.entity';
import { Slot } from './slot.entity';

@Entity()
export class Agenda {
  @ApiProperty({
    example: 'f4d5e4a2-8e3d-41bd-bf68-ffa3f7b68456',
    description: 'ID for the agenda',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '8a7f8651-7a0f-4cb1-b93e-12a5142e34a2',
    description: 'ID of the associated EventInstance',
  })
  @ManyToOne(() => EventInstance, (eventInstance) => eventInstance.agendas)
  @JoinColumn({ name: 'event_instance_id' })
  eventInstance: EventInstance;

  @ApiProperty({
    example: '2022-12-12T10:00:00Z',
    description: 'Date of the agenda',
  })
  @Column({ type: 'timestamp', nullable: true })
  date: Date;

  @ApiProperty({
    description: 'Slots associated with this agenda',
    type: () => [Slot],
  })
  @OneToMany(() => Slot, (slot) => slot.agenda)
  slots: Slot[];

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
