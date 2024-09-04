import { BlogCategory } from "src/blog/entities/blog-category.entity";
import { User } from "../../user/user.entity";
import { BlogStatus } from "../enums/blogStatus.enum";


export interface BlogSingleLang {
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
  status: BlogStatus;
  users: User[];
  categories: BlogCategory[];
};
