import { IsNotEmpty, IsOptional } from "class-validator";
import { BlogStatus } from "../../helpers/enums/blogStatus.enum";
import { User } from "../../user/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BlogCategory } from "./blog-category.entity";
import { IsValidLocaleRecord } from "src/helpers/validations/decorators/validate-locale-record";


@Entity({ name: 'blog' })
export class Blog {
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
  @IsValidLocaleRecord()
  title: Record<string, string>;

  @Column({ type: 'jsonb', nullable: false })
  @IsNotEmpty()
  @IsValidLocaleRecord()
  short_description: Record<string, string>;

  @Column({ type: 'jsonb', nullable: false })
  @IsNotEmpty()
  @IsValidLocaleRecord()
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

  @Column({ type: 'varchar', default: BlogStatus.DRAFT, nullable: true })
  status: BlogStatus;

  @ManyToOne(() => User, users => users.id)
  @JoinColumn({ name: "blog_users" })
  users: User[];
  
  @ManyToMany(() => BlogCategory, categories => categories.blogs)
  @JoinTable({ name: "blog_categories" })
  blog_categories: BlogCategory[];
};

