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
import { Event } from './event.entity';

@Entity()
export class BasicInfo {
  @ApiProperty({
    example: 'f7e8f6c4-76f2-4c5a-a8f4-0eddb12a2f9d',
    description: 'ID for the basic information',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'ID of the associated Event',
  })
  @OneToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ApiProperty({
    example: {
      en: 'Annual Conference',
      hy: 'Տարեկան համաժողով',
      ru: 'Ежегодная конференция',
    },
    description: 'Title of the event in multiple languages',
  })
  @Column({ type: 'jsonb', nullable: false })
  event_title: Record<string, string>;

  @ApiProperty({
    example: {
      en: 'An event to discuss future technologies.',
      hy: 'Միջոցառում ապագա տեխնոլոգիաների քննարկման համար։',
      ru: 'Мероприятие для обсуждения будущих технологий.',
    },
    description: 'Description of the event in multiple languages',
  })
  @Column({ type: 'jsonb', nullable: false })
  event_description: Record<string, string>;

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
