import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  async helloApp(): Promise<string> {
    return 'This home library application!';
  }
}
