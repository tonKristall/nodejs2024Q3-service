import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
  imports: [DatabaseModule],
})
export class TracksModule {}
