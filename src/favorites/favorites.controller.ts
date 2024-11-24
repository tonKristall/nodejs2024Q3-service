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
import {
  FavoritesResponse,
  TFavorites,
  TFavoritesEntity,
} from './interfaces/favorites.interface';

@Controller('favs')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  async getAll(): Promise<FavoritesResponse> {
    return await this.favoritesService.getAll();
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
