import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsController } from './products.controller';

@Module({
  imports: [CategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
