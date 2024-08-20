import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { IsValidLocaleRecord } from '../../helper/validations/decorators/has-required-locales';
import { IsValidUrl } from '../../helper/validations/decorators/validate-aws-s3-path';
import { User } from '../../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'category' })
export class Category {
  @ApiProperty({
    example: '1e4a89f1-efc1-4b5b-8fcb-27b9b62c7b45',
    description: 'Id of the category',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Name of the category in different languages',
  })
  @IsValidLocaleRecord()
  @Column({ type: 'jsonb', nullable: false })
  name: Record<string, string>;

  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Description of the category in different languages',
  })
  @IsValidLocaleRecord()
  @Column({ type: 'jsonb', nullable: true })
  description: Record<string, string>;

  @ApiProperty({
    example: 'Active',
    description: 'status of the category',
  })
  @Column({ type: 'enum', enum: ['Active', 'Inactive'], default: 'Active' })
  status: string;

  @ApiProperty({
    example: '<https://s3.amazonaws.com/bucket-name/path-to-image>',
    description: 'Category image url',
  })
  @IsValidUrl()
  @Column({ type: 'varchar', nullable: false })
  category_image: string;

  @ApiProperty({
    example: '<https://s3.amazonaws.com/bucket-name/path-to-image',
    description: 'Category icon url',
  })
  @IsValidUrl()
  @Column({ type: 'varchar', nullable: false })
  category_icon: string;

  @ApiProperty({
    example: '2024-08-19T12:34:56Z',
    description: 'Date of creation',
  })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ApiProperty({
    example: '2024-08-19T12:34:56Z',
    description: 'Date of update',
  })
  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn({ name: 'created_by' })
  user: User;
}
