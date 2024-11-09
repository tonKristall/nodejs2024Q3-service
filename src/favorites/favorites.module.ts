import { Module } from '@nestjs/common';

import { FavoritesService } from './favorites.service';
import { TracksModule } from '../tracks/tracks.module';
import { FavoritesController } from './favorites.controller';
import { ArtistsModule } from '../artists/artists.module';
import { AlbumsModule } from '../albums/albums.module';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
  imports: [TracksModule, ArtistsModule, AlbumsModule],
})
export class FavoritesModule {}
