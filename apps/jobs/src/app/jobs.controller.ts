import {
  AcknowledgeRequest,
  JobsServiceController,
  JobsServiceControllerMethods,
} from '@jobber/grpc';
import { Controller } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller()
@JobsServiceControllerMethods()
export class JobsController implements JobsServiceController {
  constructor(private readonly jobsService: JobsService) {}

  async acknowledge(request: AcknowledgeRequest) {
    await this.jobsService.acknowledge(request.jobId);
  }
}
