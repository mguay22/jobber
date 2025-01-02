import { Controller } from '@nestjs/common';
import {
  AcknowledgeRequest,
  JobsServiceController,
  JobsServiceControllerMethods,
} from '@jobber/grpc';

@Controller()
@JobsServiceControllerMethods()
export class JobsController implements JobsServiceController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async acknowledge(request: AcknowledgeRequest) {}
}
