import { IsNotEmpty, IsOptional } from "class-validator";
import { BlogStatus } from "../../helpers/enums/blogStatus.enum";
import { User } from "../../user/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BlogCategory } from "./blog-category.entity";
import { IsValidLocaleRecord } from "src/helpers/validations/decorators/validate-locale-record";
import { ApiProperty } from "@nestjs/swagger";


@Entity({ name: 'blog' })
export class Blog {
  @ApiProperty({
    example: '1e4a89f1-efc1-4b5b-8fcb-27b9b62c7b45',
    description: 'Id of the blog',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '1e4a89f1-efc1-4b5b-8fcb-27b9b62c7b45',
    description: 'Id of the user',
  })
  @Column({ type: 'uuid', nullable: false })
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    example: 'blog-name-12345',
    description: 'Slug of the blog',
  })
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Title of blog in different languages',
  })
  @Column({ type: 'jsonb', nullable: false })
  @IsNotEmpty()
  @IsValidLocaleRecord()
  title: Record<string, string>;

  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Short Description of blog in different languages',
  })
  @Column({ type: 'jsonb', nullable: false })
  @IsNotEmpty()
  @IsValidLocaleRecord()
  short_description: Record<string, string>;

  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Description of blog in different languages',
  })
  @Column({ type: 'jsonb', nullable: false })
  @IsNotEmpty()
  @IsValidLocaleRecord()
  description: Record<string, string>;

  @ApiProperty({
    example: '2024-08-19T12:34:56Z',
    description: 'Date of creation',
  })
  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  created_at: Date | string;

  @ApiProperty({
    example: '2024-08-19T12:34:56Z',
    description: 'Date of update',
  })
  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  updated_at: Date | string;

  @ApiProperty({
    example: '<https://s3.amazonaws.com/bucket-name/path-to-image',
    description: 'Blog image large url',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  image_large: string;

  @ApiProperty({
    example: '<https://s3.amazonaws.com/bucket-name/path-to-image',
    description: 'Blog image small url',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  image_small: string;

  @ApiProperty({
    example: '10',
    description: 'Views count of the blog',
  })
  @Column({ type: 'int', default: 0 })
  @IsNotEmpty()
  views_count: number;

  @ApiProperty({
    example: BlogStatus,
    description: 'Status of the blog',
  })
  @Column({ type: 'varchar', default: BlogStatus.DRAFT, nullable: true })
  status: BlogStatus;

  @ManyToOne(() => User, users => users.id)
  @JoinColumn({ name: "blog_users" })
  users: User[];
  
  @ManyToMany(() => BlogCategory, categories => categories.blogs)
  @JoinTable({ name: "blog_categories" })
  blog_categories: BlogCategory[];
};

