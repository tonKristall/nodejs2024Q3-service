import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { TrackResponse } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TracksService } from './tracks.service';

@Controller('track')
export class TracksController {
  constructor(private tracksService: TracksService) {}

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto): Promise<TrackResponse> {
    return await this.tracksService.create(createTrackDto);
  }

  @Get()
  async findAll(): Promise<TrackResponse[]> {
    return await this.tracksService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<TrackResponse> {
    try {
      return await this.tracksService.findOne(id);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<TrackResponse> {
    try {
      return await this.tracksService.update(id, updateTrackDto);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      await this.tracksService.remove(id);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
