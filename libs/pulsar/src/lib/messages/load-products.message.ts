import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { JobMessage } from './job.message';

export class LoadProductsMessage extends JobMessage {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
