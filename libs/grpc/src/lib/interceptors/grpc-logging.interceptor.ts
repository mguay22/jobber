import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class GrpcLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GrpcLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler().name;
    const args = context.getArgs()[0];
    const startTime = Date.now();
    const requestId = uuidv4();

    this.logger.log({
      requestId,
      handler,
      args,
    });

    return next.handle().pipe(
      tap(() => {
        this.logger.log({
          requestId,
          handler,
          duration: Date.now() - startTime,
        });
      })
    );
  }
}
