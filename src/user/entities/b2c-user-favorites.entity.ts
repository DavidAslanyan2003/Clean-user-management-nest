import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { B2BProfile } from './b2b-profile.entity';

@Entity('b2c_user_favorites')
export class B2CUserFavorites {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ type: 'string', format: 'uuid' })
  id: string;

  @ManyToOne(() => User, (user) => user.favorites)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: ['event', 'artist', 'venue', 'organizer'] })
  @ApiProperty({
    type: 'enum',
    enum: ['event', 'artist', 'venue', 'organizer'],
  })
  type: string;

  // @ManyToOne(() => Event)
  // @JoinColumn({ name: 'event_id' })
  // @ApiProperty({ type: () => Event, nullable: true })
  // event: Event;

  @ManyToOne(() => B2BProfile, (profile) => profile.favorites)
  @JoinColumn({ name: 'b2b_profile_id' })
  b2bProfile: B2BProfile;

  @Column({ type: 'enum', enum: ['active', 'deleted'] })
  @ApiProperty({ type: 'string', enum: ['active', 'deleted'] })
  status: 'active' | 'deleted';

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
