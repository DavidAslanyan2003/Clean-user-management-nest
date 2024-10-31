import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventInstance } from './event-instance.entity';

@Entity()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '8a7f8651-7a0f-4cb1-b93e-12a5142e34a4',
    description: 'ID for the media',
  })
  id: string;

  @ApiProperty({
    example: 'https://s3.amazonaws.com/bucket-name/path-to-image',
    description: 'URL for the cover image',
  })
  @Column()
  cover_image: string;

  @ApiProperty({
    example: [
      'https://s3.amazonaws.com/bucket-name/path-to-image1',
      'https://s3.amazonaws.com/bucket-name/path-to-image2',
    ],
    description: 'URLs for additional images',
    nullable: true,
  })
  @Column('varchar', { array: true, nullable: true })
  images: string[];

  @ApiProperty({
    example: 'https://example.com/video.mp4',
    description: 'URL for event video',
  })
  @Column()
  video_link: string;

  @ApiProperty({
    example: '8a7f8651-7a0f-4cb1-b93e-12a5142e34a4',
    description: 'Associated event instance ID',
  })
  @OneToOne(() => EventInstance)
  @JoinColumn({ name: 'event_instance_id' })
  eventInstance: EventInstance;

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
