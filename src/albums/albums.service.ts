import { Injectable, NotFoundException } from '@nestjs/common';
import { Album, AlbumResponse } from './interfaces/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  private readonly albums: Album[] = [];

  async create({
    name,
    year,
    artistId,
  }: CreateAlbumDto): Promise<AlbumResponse> {
    const newAlbum: Album = {
      id: crypto.randomUUID(),
      name,
      year,
      artistId,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  async findAll(): Promise<AlbumResponse[]> {
    return this.albums;
  }

  async findOne(id: string): Promise<AlbumResponse> {
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Album does not exist!');
    }

    return album;
  }

  async update(
    id: string,
    { name, year, artistId }: UpdateAlbumDto,
  ): Promise<AlbumResponse> {
    const albumIndex = this.albums.findIndex((album) => album.id === id);

    if (albumIndex === -1) {
      throw new NotFoundException('Album does not exist!');
    }

    const updateAlbum = { ...this.albums[albumIndex] };
    if (name) updateAlbum.name = name;
    if (year) updateAlbum.year = year;
    if (artistId !== undefined) updateAlbum.artistId = artistId;

    this.albums[albumIndex] = updateAlbum;

    return this.albums[albumIndex];
  }

  async remove(id: string): Promise<string | null> {
    const albumIndex = this.albums.findIndex((album) => album.id === id);

    if (albumIndex === -1) {
      throw new NotFoundException('Album does not exist!');
    }

    this.albums.splice(albumIndex, 1);
    return 'done';
  }

  async removeArtist(artistId: string): Promise<void> {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}
