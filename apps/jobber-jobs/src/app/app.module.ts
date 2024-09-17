import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [ConfigModule, JobsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
