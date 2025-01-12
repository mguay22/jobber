import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { FibonacciMessage, PulsarClient } from '@jobber/pulsar';
import { iterate } from 'fibonacci';
import { JobConsumer } from '../job.consumer';
import { JOBS_PACKAGE_NAME } from '@jobber/grpc';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class FibonacciConsumer
  extends JobConsumer<FibonacciMessage>
  implements OnModuleInit
{
  constructor(
    pulsarClient: PulsarClient,
    @Inject(JOBS_PACKAGE_NAME) clientJobs: ClientGrpc
  ) {
    super('Fibonacci', pulsarClient, clientJobs);
  }

  protected async execute(data: FibonacciMessage): Promise<void> {
    const result = iterate(data.iterations);
    this.logger.log(result);
  }
}
