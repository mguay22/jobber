import {
  AcknowledgeRequest,
  JOBS_SERVICE_NAME,
  JobsServiceClient,
} from '@jobber/grpc';
import { PulsarClient, PulsarConsumer } from '@jobber/pulsar';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export abstract class JobConsumer<
  T extends AcknowledgeRequest
> extends PulsarConsumer<T> {
  private jobsService: JobsServiceClient;

  constructor(
    topic: string,
    pulsarClient: PulsarClient,
    private readonly grpcClient: ClientGrpc
  ) {
    super(pulsarClient, topic);
  }

  async onModuleInit(): Promise<void> {
    this.jobsService =
      this.grpcClient.getService<JobsServiceClient>(JOBS_SERVICE_NAME);
    await super.onModuleInit();
  }

  protected async onMessage(data: T): Promise<void> {
    await this.execute(data);
    await firstValueFrom(this.jobsService.acknowledge(data));
  }

  protected abstract execute(data: T): Promise<void>;
}
