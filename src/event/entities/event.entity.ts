import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { FAQ } from './faq.entity';
import { Tag } from './tag.entity';
import { EventInstance } from './event-instance.entity';
import { EventStatusEnum } from '../enums/event-status.enum';

@Entity()
export class Event {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'ID for the event',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID that created the event',
    nullable: false,
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    example: EventStatusEnum.DRAFT,
    description: 'Status of the event',
    default: EventStatusEnum.DRAFT,
  })
  @Column({
    type: 'enum',
    enum: EventStatusEnum,
    default: EventStatusEnum.DRAFT,
  })
  status: EventStatusEnum;

  @ApiProperty({
    example: 'annual-tech-conference-1693455600',
    description: 'Unique slug for the event',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @ManyToMany(() => Tag, (tag) => tag.events)
  tags: Tag[];

  @ApiProperty({
    description: 'FAQs associated with the event',
    type: () => [FAQ],
  })
  @OneToMany(() => FAQ, (faq) => faq.event)
  faqs: FAQ[];

  @ApiProperty({
    description: 'EventInstances associated with the event',
    type: () => [EventInstance],
  })
  @OneToMany(() => EventInstance, (eventInstance) => eventInstance.event)
  eventInstances: [EventInstance];

  @ManyToMany(() => Category, (category) => category.events)
  categories: Category;

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
