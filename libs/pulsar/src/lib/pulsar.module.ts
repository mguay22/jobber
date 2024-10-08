import { Module } from '@nestjs/common';
import { PulsarClient } from './pulsar.client';

@Module({
  controllers: [],
  providers: [PulsarClient],
  exports: [PulsarClient],
})
export class PulsarModule {}
