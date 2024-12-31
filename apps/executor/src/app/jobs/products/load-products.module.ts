import { Module } from '@nestjs/common';
import { LoadProductsConsumer } from './load-products.consumer';
import { PulsarModule } from '@jobber/pulsar';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Packages } from '@jobber/grpc';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    PulsarModule,
    ClientsModule.registerAsync([
      {
        name: Packages.PRODUCTS,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.getOrThrow('PRODUCTS_GRPC_SERVICE_URL'),
            package: Packages.PRODUCTS,
            protoPath: join(__dirname, '../../libs/grpc/proto/products.proto'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [LoadProductsConsumer],
})
export class LoadProductModule {}
