require('module-alias/register');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { init } from '@jobber/nestjs';
import { PRODUCTS_PACKAGE_NAME } from '@jobber/grpc';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  await init(app);
  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      url: app.get(ConfigService).getOrThrow('PRODUCTS_GRPC_SERVICE_URL'),
      package: PRODUCTS_PACKAGE_NAME,
      protoPath: join(__dirname, '../../libs/grpc/proto/products.proto'),
    },
  });
  await app.startAllMicroservices();
}

bootstrap();
