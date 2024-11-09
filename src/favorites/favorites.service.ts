import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  EFavoritesEntity,
  Favorites,
  FavoritesResponse,
  TFavorites,
  TFavoritesEntity,
} from './interfaces/favorites.interface';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(ArtistsService) private readonly artistsService: ArtistsService,
    @Inject(TracksService) private readonly tracksService: TracksService,
    @Inject(AlbumsService) private readonly albumsService: AlbumsService,
  ) {}
  private readonly favorites: Favorites = {
    artists: [],
    tracks: [],
    albums: [],
  };

  async getAll({
    artists,
    tracks,
    albums,
  }: FavoritesResponse): Promise<FavoritesResponse> {
    const artistFavorites = artists.filter(({ id }) =>
      this.favorites.artists.includes(id),
    );
    const trackFavorites = tracks.filter(({ id }) =>
      this.favorites.tracks.includes(id),
    );
    const albumFavorites = albums.filter((album) =>
      this.favorites.albums.includes(album.id),
    );

    return {
      artists: artistFavorites,
      tracks: trackFavorites,
      albums: albumFavorites,
    };
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

    const favoriteType = EFavoritesEntity[entityType];
    const favoritesIds = this.favorites[favoriteType];

    if (!favoritesIds.includes(id)) {
      this.favorites[favoriteType].push(id);
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

    const favoritesIndex = this.favorites[favoriteType].findIndex(
      (favoritesId) => favoritesId === id,
    );

    if (favoritesIndex === -1) {
      throw new NotFoundException('Favorites does not exist!');
    }

    this.favorites[favoriteType].splice(favoritesIndex, 1);
    return 'done';
  }
}
