import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../category/entities/category.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Blog } from '../blog/entities/blog.entity';

@Entity('user')
export class User {
  @ApiProperty({
    example: '1e4a89f1-efc1-4b5b-8fcb-27b9b62c7b45',
    description: 'Id of the user',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Blog, blogs => blogs.users)
  blogs: Blog[] 
}
