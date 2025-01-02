import {
  DiscoveredClassWithMeta,
  DiscoveryService,
} from '@golevelup/nestjs-discovery';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { JOB_METADATA_KEY } from './decorators/job.decorator';
import { AbstractJob } from './jobs/abstract.job';
import { JobMetadata } from './interfaces/job-metadata.interface';
import * as fs from 'fs';
import { UPLOADS_FILE_PATH } from './uploads/uploads';
import { PrismaService } from './prisma/prisma.service';
import { JobStatus } from './models/job-status.enum';

@Injectable()
export class JobsService implements OnModuleInit {
  private jobs: DiscoveredClassWithMeta<JobMetadata>[] = [];

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly prismaService: PrismaService
  ) {}

  async onModuleInit() {
    this.jobs = await this.discoveryService.providersWithMetaAtKey<JobMetadata>(
      JOB_METADATA_KEY
    );
  }

  getJobs() {
    return this.jobs.map((job) => job.meta);
  }

  async executeJob(name: string, data: any) {
    const job = this.jobs.find((job) => job.meta.name === name);
    if (!job) {
      throw new BadRequestException(`Job ${name} does not exist.`);
    }
    if (!(job.discoveredClass.instance instanceof AbstractJob)) {
      throw new InternalServerErrorException(
        'Job is not an instance of AbstractJob.'
      );
    }
    await job.discoveredClass.instance.execute(
      data.fileName ? this.getFile(data.fileName) : data,
      job.meta.name
    );
    return job.meta;
  }

  private getFile(fileName?: string) {
    if (!fileName) {
      return;
    }
    try {
      return JSON.parse(
        fs.readFileSync(`${UPLOADS_FILE_PATH}/${fileName}`, 'utf-8')
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to read file: ${fileName}`
      );
    }
  }

  async acknowledge(jobId: number) {
    const job = await this.prismaService.job.update({
      where: { id: jobId },
      data: { completed: { increment: 1 } },
    });

    if (!job) {
      throw new BadRequestException(`Job with ID ${jobId} does not exist.`);
    }

    if (job.completed === job.size) {
      await this.prismaService.job.update({
        where: { id: jobId },
        data: { status: JobStatus.COMPLETED },
      });
    }

    return job;
  }
}
