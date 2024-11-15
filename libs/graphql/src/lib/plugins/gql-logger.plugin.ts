import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from '@apollo/server';
import { Logger } from '@nestjs/common';

export class GqlLoggingPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger(GqlLoggingPlugin.name);

  async requestDidStart(
    requestContext: GraphQLRequestContext<BaseContext>
  ): Promise<void | GraphQLRequestListener<BaseContext>> {
    const { request } = requestContext;
    const start = Date.now();

    this.logger.log({
      headers: request.http?.headers,
      query: request.query,
      variables: request.variables,
    });

    return {
      willSendResponse: async (responseContext) => {
        const duration = Date.now() - start;

        this.logger.log({
          query: request.query,
          statusCode: responseContext.response?.http?.status || 200,
          duration: `${duration}ms`,
        });
      },
    };
  }
}
