import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../src/category/controllers/category.controller';
import { CategoryModule } from '../src/category/modules/category.module';
import { CategoryService } from '../src/category/services/category.service';
import { REQUEST } from '@nestjs/core';
import { Category } from '../src/category/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { UserModule } from '../src/user/user.module';
import { AppModule } from '../src/app.module';

const mockRequest = {
  language: 'en',
} as unknown as Request;

export async function setupTestModule(): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      AppModule,
      CategoryModule,
      UserModule,
      TypeOrmModule.forFeature([Category, User]),
    ],
    providers: [CategoryService],
    controllers: [CategoryController],
    exports: [TypeOrmModule],
  })
    .overrideProvider(REQUEST)
    .useValue(mockRequest)
    .compile();
}
