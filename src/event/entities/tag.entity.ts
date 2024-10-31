import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'tag-id-123', description: 'ID for the tag' })
  id: string;

  @ApiProperty({ example: 'Technology', description: 'Name of the tag' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  tag_name: string;

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

  @ManyToMany(() => Event, (event) => event.tags)
  @JoinTable({
    name: 'event_tag',
    joinColumn: { name: 'tag_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'event_id',
      referencedColumnName: 'id',
    },
  })
  events: Event[];
}
