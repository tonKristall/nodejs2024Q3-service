import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { TracksService } from '../tracks/tracks.service';
import {
  FavoritesResponse,
  TFavorites,
  TFavoritesEntity,
} from './interfaces/favorites.interface';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';

@Controller('favs')
export class FavoritesController {
  constructor(
    private favoritesService: FavoritesService,
    private albumsService: AlbumsService,
    private tracksService: TracksService,
    private artistsService: ArtistsService,
  ) {}

  @Get()
  async getAll(): Promise<FavoritesResponse> {
    const artists = await this.artistsService.findAll();
    const albums = await this.albumsService.findAll();
    const tracks = await this.tracksService.findAll();
    return await this.favoritesService.getAll({ artists, albums, tracks });
  }

  @Post(':entityType/:id')
  async addFavorite(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('entityType') entityType: TFavoritesEntity,
  ): Promise<TFavorites> {
    try {
      return await this.favoritesService.addFavorite(entityType, id);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Delete(':entityType/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFavorite(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('entityType') entityType: TFavoritesEntity,
  ): Promise<void> {
    try {
      await this.favoritesService.removeFavorite(entityType, id);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
