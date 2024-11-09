import { Artist } from '../../artists/interfaces/artist.interface';
import { Album } from '../../albums/interfaces/album.interface';
import { Track } from '../../tracks/interfaces/track.interface';

export enum EFavoritesEntity {
  artist = 'artists',
  album = 'albums',
  track = 'tracks',
}

export interface Favorites {
  [EFavoritesEntity.artist]: string[]; // favorite artists ids
  [EFavoritesEntity.album]: string[]; // favorite albums ids
  [EFavoritesEntity.track]: string[]; // favorite tracks ids
}

export interface FavoritesResponse {
  [EFavoritesEntity.artist]: Artist[];
  [EFavoritesEntity.album]: Album[];
  [EFavoritesEntity.track]: Track[];
}

export type TFavoritesEntity = keyof typeof EFavoritesEntity;
export type TFavorites = Artist | Album | Track;
