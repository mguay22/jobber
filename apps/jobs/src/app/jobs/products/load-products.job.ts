import { LoadProductsMessage, PulsarClient } from '@jobber/pulsar';
import { Job } from '../../decorators/job.decorator';
import { AbstractJob } from '../abstract.job';
import { PrismaService } from '../../prisma/prisma.service';

@Job({
  name: 'LoadProducts',
  description: 'Loads uploaded product data into the DB after enrichment.',
})
export class LoadProductsJob extends AbstractJob<LoadProductsMessage> {
  protected messageClass = LoadProductsMessage;

  constructor(pulsarClient: PulsarClient, prismaService: PrismaService) {
    super(pulsarClient, prismaService);
  }
}
