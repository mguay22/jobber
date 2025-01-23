import { Packages } from '@jobber/grpc';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: Packages.JOBS,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.getOrThrow('JOBS_GRPC_SERVICE_URL'),
            package: Packages.JOBS,
            protoPath: join(__dirname, '../../libs/grpc/proto/jobs.proto'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class JobClientsModule {}
