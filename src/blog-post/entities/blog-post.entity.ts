import { IsNotEmpty, IsOptional } from "class-validator";
import { BlogPostCategory } from "../../blog-post-category/entities/blog-post-category.entity";
import { BlogPostStatus } from "../../helpers/enums/blogPostStatus.enum";
import { User } from "../../user/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'blog_post' })
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @IsNotEmpty()
  user_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  @IsNotEmpty()
  slug: string;

  @Column({ type: 'jsonb', nullable: false })
  @IsNotEmpty()
  title: Record<string, string>;

  @Column({ type: 'jsonb', nullable: false })
  @IsNotEmpty()
  short_description: Record<string, string>;

  @Column({ type: 'jsonb', nullable: false })
  @IsNotEmpty()
  description: Record<string, string>;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  created_at: Date | string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  updated_at: Date | string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  image_large: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  image_small: string;

  @Column({ type: 'int', default: 0 })
  @IsNotEmpty()
  views_count: number;

  @Column({ type: 'varchar', default: BlogPostStatus.DRAFT, nullable: true })
  status: BlogPostStatus;

  @ManyToOne(() => User, users => users.id)
  @JoinColumn({ name: "blog_posts_users" })
  users: User[];
  
  @ManyToMany(() => BlogPostCategory, categories => categories.blog_posts)
  @JoinTable({ name: "blog_posts_categories" })
  blog_post_categories: BlogPostCategory[];
};

