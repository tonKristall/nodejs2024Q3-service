import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/public.decorator';

@Controller('')
export class AppController {
  @Public()
  @Get()
  async helloApp(): Promise<string> {
    return 'This home library application!';
  }
}
