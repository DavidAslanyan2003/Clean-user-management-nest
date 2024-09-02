import { IsNotEmpty } from "class-validator";
import { BlogPost } from "../../blog-post/entities/blog-post.entity";
import { BlogPostCategoryStatus } from "../../helpers/enums/categoryStatus.enum";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'blog_post_category' })
export class BlogPostCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', nullable: true })
  @IsNotEmpty()
  category: Record<string, string>;

  @Column({ type: 'varchar', default: BlogPostCategoryStatus.ACTIVE, nullable: true })
  status: BlogPostCategoryStatus;

  @ManyToMany(() => BlogPost , blogPosts => blogPosts.blog_post_categories)
  @JoinTable({ name: "blog_posts_categories" })
  blog_posts: BlogPost[];
};

