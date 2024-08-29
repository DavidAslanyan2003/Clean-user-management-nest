import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../src/category/controllers/category.controller';
import { CategoryModule } from '../src/category/modules/category.module';
import { CategoryService } from '../src/category/services/category.service';
import { UserModule } from '../src/user/user.module';
import { AppModule } from '../src/app.module';
import { REQUEST } from '@nestjs/core';

const mockRequest = {
  language: 'en',
} as unknown as Request;

export async function setupTestModule(): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [CategoryModule, UserModule, AppModule],
    providers: [CategoryService],
    controllers: [CategoryController],
  })
    .overrideProvider(REQUEST)
    .useValue(mockRequest)
    .compile();
}
