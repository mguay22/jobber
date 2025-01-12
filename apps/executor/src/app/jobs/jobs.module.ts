import { PulsarModule } from '@jobber/pulsar';
import { Module } from '@nestjs/common';
import { FibonacciConsumer } from './fibonacci/fibonacci.consumer';
import { LoadProductsModule } from './products/load-products.module';
import { JobClientsModule } from './job-clients.module';

@Module({
  imports: [PulsarModule, LoadProductsModule, JobClientsModule],
  providers: [FibonacciConsumer],
})
export class JobsModule {}
