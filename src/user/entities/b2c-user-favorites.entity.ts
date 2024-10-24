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
import { UserFavoriteTypeEnum } from '../enums/user-favorite-type.enum';
import { UserFavoriteStatusEnum } from '../enums/user-favorite-status.enum';

@Entity('b2c_user_favorites')
export class B2CUserFavorites {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ type: 'string', format: 'uuid' })
  id: string;

  @ManyToOne(() => User, (user) => user.favorites)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: UserFavoriteTypeEnum })
  @ApiProperty({
    type: 'enum',
    enum: UserFavoriteTypeEnum,
  })
  type: UserFavoriteTypeEnum;

  // @ManyToOne(() => Event)
  // @JoinColumn({ name: 'event_id' })
  // @ApiProperty({ type: () => Event, nullable: true })
  // event: Event;

  @ManyToOne(() => B2BProfile, (profile) => profile.favorites)
  @JoinColumn({ name: 'b2b_profile_id' })
  b2bProfile: B2BProfile;

  @Column({ type: 'enum', enum: UserFavoriteStatusEnum })
  @ApiProperty({ type: 'enum', enum: UserFavoriteStatusEnum })
  status: UserFavoriteStatusEnum;

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
