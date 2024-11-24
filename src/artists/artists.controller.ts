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
import { ArtistResponse } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistsService } from './artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';

@Controller('artist')
export class ArtistsController {
  constructor(
    private artistsService: ArtistsService,
    private tracksService: TracksService,
    private albumsService: AlbumsService,
  ) {}

  @Post()
  async create(
    @Body() createArtistDto: CreateArtistDto,
  ): Promise<ArtistResponse> {
    return await this.artistsService.create(createArtistDto);
  }

  @Get()
  async findAll(): Promise<ArtistResponse[]> {
    return await this.artistsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ArtistResponse> {
    try {
      return await this.artistsService.findOne(id);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistResponse> {
    try {
      return await this.artistsService.update(id, updateArtistDto);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      await this.artistsService.remove(id);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
