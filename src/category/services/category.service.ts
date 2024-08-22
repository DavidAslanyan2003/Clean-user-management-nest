import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { User } from 'src/user/user.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategories(newCategorie: CreateCategoryDto): Promise<Category> {
    const queryRunner =
      this.categoryRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let savedCategory: Category;
      const user = await queryRunner.manager.getRepository(User).findOne({
        where: { id: '83f83a08-4e85-db19-ccbd-ae47c3677854' },
      });

      const category = queryRunner.manager.getRepository(Category).create({
        name: newCategorie.name,
        description: newCategorie.description,
        category_icon: newCategorie.category_icon,
        category_image: newCategorie.category_image,
        user: user,
      });

      savedCategory = await this.categoryRepository.save(category);

      await queryRunner.commitTransaction();

      return savedCategory;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return error.message;
    } finally {
      await queryRunner.release();
    }
  }
}
