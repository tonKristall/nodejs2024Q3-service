import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  EFavoritesEntity,
  FavoritesResponse,
  TFavorites,
  TFavoritesEntity,
} from './interfaces/favorites.interface';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(ArtistsService) private readonly artistsService: ArtistsService,
    @Inject(TracksService) private readonly tracksService: TracksService,
    @Inject(AlbumsService) private readonly albumsService: AlbumsService,
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {}

  async getAll(): Promise<FavoritesResponse> {
    const favorites = await this.databaseService.favorites.findMany({
      select: { album: true, artist: true, track: true },
    });

    const data: FavoritesResponse = {
      artists: [],
      tracks: [],
      albums: [],
    };

    favorites.forEach((favorite) => {
      if (favorite.artist) {
        data.artists.push(favorite.artist);
      }
      if (favorite.track) {
        data.tracks.push(favorite.track);
      }
      if (favorite.album) {
        data.albums.push(favorite.album);
      }
    });

    return data;
  }

  async addFavorite(
    entityType: TFavoritesEntity,
    id: string,
  ): Promise<TFavorites> {
    let entity: TFavorites;

    switch (entityType) {
      case 'artist':
        try {
          entity = await this.artistsService.findOne(id);
        } catch {
          throw new UnprocessableEntityException('Artist does not exist!');
        }
        break;
      case 'track':
        try {
          entity = await this.tracksService.findOne(id);
        } catch {
          throw new UnprocessableEntityException('Track does not exist!');
        }
        break;
      case 'album':
        try {
          entity = await this.albumsService.findOne(id);
        } catch {
          throw new UnprocessableEntityException('Album does not exist!');
        }
        break;
      default:
        throw new NotFoundException(`Cannot POST /favs/${entityType}/${id}`);
    }

    const favorite = await this.databaseService.favorites.findUnique({
      where: { id },
    });

    if (!favorite) {
      await this.databaseService.favorites.create({
        data: { [`${entityType}Id`]: id, id },
      });
    }

    return entity;
  }

  async removeFavorite(
    entityType: TFavoritesEntity,
    id: string,
  ): Promise<string | null> {
    const favoriteType = EFavoritesEntity[entityType];
    if (!favoriteType) {
      throw new NotFoundException(`Cannot DELETE /favs/${entityType}/${id}`);
    }

    const favorite = await this.databaseService.favorites.findUnique({
      where: { id },
    });

    if (!favorite) {
      throw new NotFoundException('Favorites does not exist!');
    }

    await this.databaseService.favorites.delete({
      where: { id },
    });

    return 'done';
  }
}
