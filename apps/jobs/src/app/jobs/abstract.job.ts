import { Producer } from 'pulsar-client';
import { plainToInstance } from 'class-transformer';
import { PulsarClient, serialize } from '@jobber/pulsar';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobStatus } from '../models/job-status.enum';

export abstract class AbstractJob<T extends object> {
  private producer: Producer;
  protected abstract messageClass: new () => T;

  constructor(
    private readonly pulsarClient: PulsarClient,
    private readonly prismaService: PrismaService
  ) {}

  async execute(data: T, name: string) {
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(name);
    }
    const job = await this.prismaService.job.create({
      data: {
        name,
        size: Array.isArray(data) ? data.length : 1,
        completed: 0,
        status: JobStatus.IN_PROGRESS,
      },
    });
    if (Array.isArray(data)) {
      for (const message of data) {
        this.send({ ...message, jobId: job.id });
      }
      return job;
    }
    this.send({ ...data, jobId: job.id });
    return job;
  }

  private send(data: T) {
    this.validateData(data).then(() =>
      this.producer.send({ data: serialize(data) })
    );
  }

  private async validateData(data: T) {
    const errors = await validate(plainToInstance(this.messageClass, data));
    if (errors.length) {
      throw new BadRequestException(
        `Job data is invalid: ${JSON.stringify(errors)}`
      );
    }
  }
}
