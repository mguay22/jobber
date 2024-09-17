import { Module } from '@nestjs/common';
import { FibonacciJob } from './fibonacci.job';

@Module({
  providers: [FibonacciJob],
})
export class JobsModule {}
