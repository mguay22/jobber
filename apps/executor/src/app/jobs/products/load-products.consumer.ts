import {
  Packages,
  PRODUCTS_SERVICE_NAME,
  ProductsServiceClient,
} from '@jobber/grpc';
import { Jobs } from '@jobber/nestjs';
import { LoadProductsMessage, PulsarClient } from '@jobber/pulsar';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JobConsumer } from '../job.consumer';

@Injectable()
export class LoadProductsConsumer
  extends JobConsumer<LoadProductsMessage>
  implements OnModuleInit
{
  private productsService: ProductsServiceClient;

  constructor(
    pulsarClient: PulsarClient,
    @Inject(Packages.JOBS) clientJobs: ClientGrpc,
    @Inject(Packages.PRODUCTS) private clientProducts: ClientGrpc
  ) {
    super(Jobs.LOAD_PRODUCTS, pulsarClient, clientJobs);
  }

  async onModuleInit() {
    this.productsService =
      this.clientProducts.getService<ProductsServiceClient>(
        PRODUCTS_SERVICE_NAME
      );
    await super.onModuleInit();
  }

  protected async execute(data: LoadProductsMessage) {
    await firstValueFrom(this.productsService.createProduct(data));
  }
}
