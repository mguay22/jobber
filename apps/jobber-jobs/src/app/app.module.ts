import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { JobsModule } from './jobs/jobs.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    ConfigModule,
    JobsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
