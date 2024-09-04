import { BlogPostCategory } from "src/blog-post-category/entities/blog-post-category.entity";
import { BlogPostStatus } from "../enums/blogPostStatus.enum";
import { User } from "../../user/user.entity";


export interface BlogPostSingleLang {
  title: string;
  description: string;
  short_description: string;
  id: string;
  user_id: string;
  slug: string;
  created_at: Date | string;
  updated_at: Date | string;
  image_large: string;
  image_small: string;
  views_count: number;
  status: BlogPostStatus;
  users: User[];
  categories: BlogPostCategory[];
}