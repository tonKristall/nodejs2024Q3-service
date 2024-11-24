import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TrackResponse } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TracksService {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {}
  async create(data: CreateTrackDto): Promise<TrackResponse> {
    return await this.databaseService.track.create({ data });
  }

  async findAll(): Promise<TrackResponse[]> {
    return await this.databaseService.track.findMany();
  }

  async findOne(id: string): Promise<TrackResponse> {
    const track = await this.databaseService.track.findUnique({
      where: { id },
    });
    if (!track) {
      throw new NotFoundException('Track does not exist!');
    }

    return track;
  }

  async update(
    id: string,
    { name, artistId, duration, albumId }: UpdateTrackDto,
  ): Promise<TrackResponse> {
    const track = await this.databaseService.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track does not exist!');
    }

    const updatedTrack = { ...track };

    if (name) updatedTrack.name = name;
    if (duration) updatedTrack.duration = duration;
    if (artistId !== undefined) updatedTrack.artistId = artistId;
    if (albumId !== undefined) updatedTrack.albumId = albumId;

    await this.databaseService.track.update({
      where: { id },
      data: updatedTrack,
    });

    return updatedTrack;
  }

  async remove(id: string): Promise<string | null> {
    const track = await this.databaseService.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track does not exist!');
    }

    await this.databaseService.track.delete({ where: { id } });

    return 'done';
  }
}
