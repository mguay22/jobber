import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { LoadProductsMessage, PulsarClient } from '@jobber/pulsar';
import {
  JOBS_PACKAGE_NAME,
  PRODUCTS_PACKAGE_NAME,
  PRODUCTS_SERVICE_NAME,
  ProductsServiceClient,
} from '@jobber/grpc';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JobConsumer } from '../job.consumer';

@Injectable()
export class LoadProductsConsumer
  extends JobConsumer<LoadProductsMessage>
  implements OnModuleInit
{
  private productsService: ProductsServiceClient;

  async onModuleInit() {
    this.productsService =
      this.clientProducts.getService<ProductsServiceClient>(
        PRODUCTS_SERVICE_NAME
      );
    await super.onModuleInit();
  }

  constructor(
    pulsarClient: PulsarClient,
    @Inject(JOBS_PACKAGE_NAME) clientJobs: ClientGrpc,
    @Inject(PRODUCTS_PACKAGE_NAME) private clientProducts: ClientGrpc
  ) {
    super('LoadProducts', pulsarClient, clientJobs);
  }

  protected async execute(data: LoadProductsMessage): Promise<void> {
    await firstValueFrom(this.productsService.createProduct(data));
  }
}
