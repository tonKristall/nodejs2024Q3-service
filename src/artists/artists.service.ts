import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ArtistResponse } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {}

  async create(data: CreateArtistDto): Promise<ArtistResponse> {
    return await this.databaseService.artist.create({ data });
  }

  async findAll(): Promise<ArtistResponse[]> {
    return await this.databaseService.artist.findMany();
  }

  async findOne(id: string): Promise<ArtistResponse> {
    const artist = await this.databaseService.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      throw new NotFoundException('Artist does not exist!');
    }

    return artist;
  }

  async update(
    id: string,
    { name, grammy }: UpdateArtistDto,
  ): Promise<ArtistResponse> {
    const artist = await this.databaseService.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      throw new NotFoundException('Artist does not exist!');
    }

    const updateArtist = { ...artist };
    if (name) updateArtist.name = name;
    if (typeof grammy === 'boolean') updateArtist.grammy = grammy;

    return await this.databaseService.artist.update({
      where: { id },
      data: updateArtist,
    });
  }

  async remove(id: string): Promise<string | null> {
    const artist = await this.databaseService.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      throw new NotFoundException('Artist does not exist!');
    }

    await this.databaseService.artist.delete({ where: { id } });
    return 'done';
  }
}
