import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('b2b_profile')
export class B2BProfile {
  @ApiProperty({
    description: 'Profile ID',
    example: '1e4a89f1-efc1-4b5b-8fcb-27b9b62c7b45',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'Account image path', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  account_image_path: string;

  @ApiProperty({ description: 'Profile type: Artist, Venue, or Organizer' })
  @Column({ type: 'varchar', length: 255 })
  profile_type: string;

  @ApiProperty({ description: 'Profile image path', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  profile_image_path: string;

  @ApiProperty({ description: 'Legal name', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  legal_name: string;

  @ApiProperty({ description: 'Venue name', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  venue_name: string;

  @ApiProperty({ description: 'Stage name', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  stage_name: string;

  @ApiProperty({ description: 'Genres', nullable: true })
  @Column({ type: 'text', array: true, nullable: true })
  genres: string[];

  @ApiProperty({ description: 'Website', nullable: false })
  @Column({ type: 'varchar', length: 255 })
  website: string;

  @ApiProperty({ description: 'Phone number', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  @ApiProperty({ description: 'Email', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @ApiProperty({ description: 'Facebook profile', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  facebook: string;

  @ApiProperty({ description: 'Instagram profile', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  instagram: string;

  @ApiProperty({ description: 'LinkedIn profile', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedin: string;

  @ApiProperty({ description: 'Portfolio images', nullable: true })
  @Column({ type: 'text', array: true, nullable: true })
  portfolio_images: string[];

  @ApiProperty({ description: 'Portfolio videos', nullable: true })
  @Column({ type: 'text', array: true, nullable: true })
  portfolio_videos: string[];

  @ApiProperty({ description: 'YouTube links', nullable: false })
  @Column({ type: 'text', array: true })
  youtube_links: string[];

  @ApiProperty({ description: 'Cover photo path', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  cover_photo_path: string;

  @ApiProperty({ description: 'Bio', nullable: true })
  @Column({ type: 'text', nullable: true })
  bio: string;

  @ApiProperty({ description: 'Profile status', nullable: false })
  @Column({
    type: 'enum',
    enum: ['active', 'pending', 'unverified', 'inactive', 'deleted'],
  })
  profile_status: string;

  @ApiProperty({ description: 'Address', nullable: false })
  @Column({ type: 'varchar', length: 255 })
  address: string;

  @ApiProperty({
    description: 'Rejected reason for registration',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  rejected_reason: string;

  @ApiProperty({
    description: 'Timestamp when the record was created',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the record was last updated',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
