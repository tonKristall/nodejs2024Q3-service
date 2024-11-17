import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AlbumResponse } from './interfaces/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {}

  async create(data: CreateAlbumDto): Promise<AlbumResponse> {
    return await this.databaseService.album.create({ data });
  }

  async findAll(): Promise<AlbumResponse[]> {
    return await this.databaseService.album.findMany();
  }

  async findOne(id: string): Promise<AlbumResponse> {
    const album = await this.databaseService.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException('Album does not exist!');
    }

    return album;
  }

  async update(
    id: string,
    { name, year, artistId }: UpdateAlbumDto,
  ): Promise<AlbumResponse> {
    const album = await this.databaseService.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException('Album does not exist!');
    }

    const updateAlbum = { ...album };
    if (name) updateAlbum.name = name;
    if (year) updateAlbum.year = year;
    if (artistId !== undefined) updateAlbum.artistId = artistId;

    return await this.databaseService.album.update({
      where: { id },
      data: updateAlbum,
    });
  }

  async remove(id: string): Promise<string | null> {
    const album = await this.databaseService.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException('Album does not exist!');
    }

    await this.databaseService.album.delete({ where: { id } });
    return 'done';
  }

  async removeArtist(artistId: string): Promise<void> {
    await this.databaseService.album.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }
}
