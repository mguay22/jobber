import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { JobsModule } from './jobs.module';
import { GraphQLModule } from '@nestjs/graphql';
import { LoggerModule } from '@jobber/nestjs';
import { GqlLoggingPlugin } from '@jobber/graphql';
import { UploadsModule } from './uploads/uploads.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    LoggerModule,
    UploadsModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JobsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      useGlobalPrefix: true,
      plugins: [new GqlLoggingPlugin()],
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
