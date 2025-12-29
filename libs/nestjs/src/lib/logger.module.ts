import { Module, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule, Params } from 'nestjs-pino';
import * as pino from 'pino';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      useFactory: (configService: ConfigService): Params => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        const logger = pino.pino({
          level: isProduction ? 'info' : 'debug',
          transport: isProduction
            ? undefined
            : {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                },
              },
        });

        return {
          pinoHttp: { logger },
          forRoutes: [{ path: '*splat', method: RequestMethod.ALL }],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class LoggerModule {}
