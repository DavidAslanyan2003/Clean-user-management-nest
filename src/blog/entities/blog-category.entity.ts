import { IsNotEmpty } from 'class-validator';
import { Blog } from './blog.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlogCategoryStatus } from '../../helpers/enums/blogCategoryStatus.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'blog_category' })
export class BlogCategory {
  @ApiProperty({
    example: '1e4a89f1-efc1-4b5b-8fcb-27b9b62c7b45',
    description: 'Id of the blog category',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Name of the blog category in different languages',
  })
  @Column({ type: 'jsonb', nullable: true })
  @IsNotEmpty()
  category: Record<string, string>;

  @ApiProperty({
    example: BlogCategoryStatus,
    description: 'Status of the blog category',
  })
  @Column({
    type: 'varchar',
    default: BlogCategoryStatus.ACTIVE,
    nullable: true,
  })
  status: BlogCategoryStatus;

  @ManyToMany(() => Blog, (blogPosts) => blogPosts.blog_categories)
  @JoinTable({ name: 'blog_categories' })
  blogs: Blog[];
}
