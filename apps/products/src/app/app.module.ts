import { Module } from '@nestjs/common';
import { LoggerModule } from '@jobber/nestjs';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    CategoriesModule,
    DatabaseModule,
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
