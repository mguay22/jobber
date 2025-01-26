// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v3.21.12
// source: proto/jobs.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export interface AcknowledgeRequest {
  jobId: number;
}

export interface AcknowledgeResponse {}

export interface JobsServiceClient {
  acknowledge(request: AcknowledgeRequest): Observable<AcknowledgeResponse>;
}

export interface JobsServiceController {
  acknowledge(
    request: AcknowledgeRequest
  ):
    | Promise<AcknowledgeResponse>
    | Observable<AcknowledgeResponse>
    | AcknowledgeResponse;
}

export function JobsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['acknowledge'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod('JobsService', method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcStreamMethod('JobsService', method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const JOBS_SERVICE_NAME = 'JobsService';
