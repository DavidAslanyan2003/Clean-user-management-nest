import { IsNotEmpty } from "class-validator";
import { Blog } from "./blog.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { BlogCategoryStatus } from "../../helpers/enums/blogCategoryStatus.enum";


@Entity({ name: 'blog_category' })
export class BlogCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', nullable: true })
  @IsNotEmpty()
  category: Record<string, string>;

  @Column({ type: 'varchar', default: BlogCategoryStatus.ACTIVE, nullable: true })
  status: BlogCategoryStatus;

  @ManyToMany(() => Blog , blogPosts => blogPosts.blog_categories)
  @JoinTable({ name: "blog_categories" })
  blogs: Blog[];
};

