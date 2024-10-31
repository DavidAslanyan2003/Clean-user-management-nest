import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Agenda } from './agenda.entity';

@Entity()
export class Slot {
  @ApiProperty({
    example: 'f56b7a34-3d24-4ed6-97c9-9b2f4d8e0842',
    description: 'ID for the slot',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'f4d5e4a2-8e3d-41bd-bf68-ffa3f7b68456',
    description: 'ID of the associated Agenda',
  })
  @ManyToOne(() => Agenda, (agenda) => agenda.slots)
  agenda: Agenda;

  @ApiProperty({ example: '10:00:00', description: 'Start time of the slot' })
  @Column({ type: 'time', nullable: false })
  start_time: string;

  @ApiProperty({ example: '12:00:00', description: 'End time of the slot' })
  @Column({ type: 'time', nullable: false })
  end_time: string;

  @ApiProperty({ example: 'UTC', description: 'Timezone for the slot' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  timezone: string;

  @ApiProperty({
    example: { en: 'Introduction', hy: 'Ներածություն', ru: 'Введение' },
    description: 'Title of the slot in multiple languages',
  })
  @Column({ type: 'jsonb', nullable: false })
  title: Record<string, string>;

  @ApiProperty({
    example: {
      en: 'This is an introductory slot.',
      hy: 'Սա ներածական հատված է։',
      ru: 'Это вводный слот.',
    },
    description: 'Description of the slot in multiple languages',
    nullable: true,
  })
  @Column({ type: 'jsonb', nullable: true })
  description: Record<string, string>;

  @ApiProperty({
    example: 'Main Hall',
    description: 'Location of the slot',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @ApiProperty({
    example: { en: 'John Doe', hy: 'Ջոն Դոու', ru: 'Джон Доу' },
    description: 'Speaker name in multiple languages',
    nullable: true,
  })
  @Column({ type: 'jsonb', nullable: true })
  speaker_name: Record<string, string>;

  @ApiProperty({
    example: { en: 'Professor', hy: 'Պրոֆեսոր', ru: 'Профессор' },
    description: 'Speaker profession in multiple languages',
    nullable: true,
  })
  @Column({ type: 'jsonb', nullable: true })
  speaker_profession: Record<string, string>;

  @ApiProperty({
    example: 'https://s3.amazonaws.com/bucket-name/path-to-image',
    description: 'URL for speaker image',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string;

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
