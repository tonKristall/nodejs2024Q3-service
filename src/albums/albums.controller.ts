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
import { AlbumResponse } from './interfaces/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumsService } from './albums.service';
import { TracksService } from '../tracks/tracks.service';

@Controller('album')
export class AlbumsController {
  constructor(
    private albumsService: AlbumsService,
    private tracksService: TracksService,
  ) {}

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<AlbumResponse> {
    return await this.albumsService.create(createAlbumDto);
  }

  @Get()
  async findAll(): Promise<AlbumResponse[]> {
    return await this.albumsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<AlbumResponse> {
    try {
      return await this.albumsService.findOne(id);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumResponse> {
    try {
      return await this.albumsService.update(id, updateAlbumDto);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      await this.albumsService.remove(id);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
