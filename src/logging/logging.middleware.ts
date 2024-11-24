import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: any, res: any, next: () => void) {
    const { method, url, body, query } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      this.loggingService.log({
        method,
        url,
        query,
        body,
        statusCode,
      });
    });

    next();
  }
}
