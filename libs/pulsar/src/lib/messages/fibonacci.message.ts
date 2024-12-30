import { IsNotEmpty, IsNumber } from 'class-validator';

export class FibonacciMessage {
  @IsNumber()
  @IsNotEmpty()
  iterations: number;
}
