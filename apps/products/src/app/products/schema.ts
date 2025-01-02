import { integer, pgTable, real, serial, text } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name'),
  category: text('category'),
  price: real('price'),
  stock: integer('stock'),
  rating: real('rating'),
  description: text('description'),
});
