import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist, ArtistResponse } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  private readonly artists: Artist[] = [];

  async create({ name, grammy }: CreateArtistDto): Promise<ArtistResponse> {
    const newArtist: Artist = {
      id: crypto.randomUUID(),
      name,
      grammy,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  async findAll(): Promise<ArtistResponse[]> {
    return this.artists;
  }

  async findOne(id: string): Promise<ArtistResponse> {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist does not exist!');
    }

    return artist;
  }

  async update(
    id: string,
    { name, grammy }: UpdateArtistDto,
  ): Promise<ArtistResponse> {
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException('Artist does not exist!');
    }

    const updateArtist = { ...this.artists[artistIndex] };
    if (name) updateArtist.name = name;
    if (typeof grammy === 'boolean') updateArtist.grammy = grammy;

    this.artists[artistIndex] = updateArtist;

    return this.artists[artistIndex];
  }

  async remove(id: string): Promise<string | null> {
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException('Artist does not exist!');
    }

    this.artists.splice(artistIndex, 1);
    return 'done';
  }
}
