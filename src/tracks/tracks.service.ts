import { Injectable, NotFoundException } from '@nestjs/common';
import { Track, TrackResponse } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  private readonly tracks: Track[] = [];

  async create({
    name,
    artistId,
    duration,
    albumId,
  }: CreateTrackDto): Promise<TrackResponse> {
    const newTrack: Track = {
      id: crypto.randomUUID(),
      name,
      artistId,
      albumId,
      duration,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  async findAll(): Promise<TrackResponse[]> {
    return this.tracks;
  }

  async findOne(id: string): Promise<TrackResponse> {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException('Track does not exist!');
    }

    return track;
  }

  async update(
    id: string,
    { name, artistId, duration, albumId }: UpdateTrackDto,
  ): Promise<TrackResponse> {
    const trackIndex = this.tracks.findIndex((track) => track.id === id);

    if (trackIndex === -1) {
      throw new NotFoundException('Track does not exist!');
    }

    const updateTrack = { ...this.tracks[trackIndex] };
    if (name) updateTrack.name = name;
    if (duration) updateTrack.duration = duration;
    if (artistId !== undefined) updateTrack.artistId = artistId;
    if (albumId !== undefined) updateTrack.albumId = albumId;

    this.tracks[trackIndex] = updateTrack;

    return this.tracks[trackIndex];
  }

  async remove(id: string): Promise<string | null> {
    const trackIndex = this.tracks.findIndex((track) => track.id === id);

    if (trackIndex === -1) {
      throw new NotFoundException('Track does not exist!');
    }

    this.tracks.splice(trackIndex, 1);
    return 'done';
  }

  async removeAlbum(albumId: string): Promise<void> {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }

  async removeArtist(artistId: string): Promise<void> {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }
}
