import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  LoadProductsMessage,
  PulsarClient,
  PulsarConsumer,
} from '@jobber/pulsar';
import {
  PRODUCTS_PACKAGE_NAME,
  PRODUCTS_SERVICE_NAME,
  ProductsServiceClient,
} from '@jobber/grpc';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LoadProductsConsumer
  extends PulsarConsumer<LoadProductsMessage>
  implements OnModuleInit
{
  private productsService: ProductsServiceClient;

  async onModuleInit() {
    this.productsService = this.client.getService<ProductsServiceClient>(
      PRODUCTS_SERVICE_NAME
    );
    await super.onModuleInit();
  }

  constructor(
    pulsarClient: PulsarClient,
    @Inject(PRODUCTS_PACKAGE_NAME) private client: ClientGrpc
  ) {
    super(pulsarClient, 'LoadProducts');
  }

  protected async onMessage(data: LoadProductsMessage): Promise<void> {
    await firstValueFrom(this.productsService.createProduct(data));
  }
}
