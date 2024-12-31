import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Module({
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
