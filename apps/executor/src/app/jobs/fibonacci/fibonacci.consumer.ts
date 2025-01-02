import { Injectable, OnModuleInit } from '@nestjs/common';
import { FibonacciMessage, PulsarClient, PulsarConsumer } from '@jobber/pulsar';
import { iterate } from 'fibonacci';

@Injectable()
export class FibonacciConsumer
  extends PulsarConsumer<FibonacciMessage>
  implements OnModuleInit
{
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, 'Fibonacci');
  }

  protected async onMessage(data: FibonacciMessage): Promise<void> {
    const result = iterate(data.iterations);
    this.logger.log(result);
  }
}
