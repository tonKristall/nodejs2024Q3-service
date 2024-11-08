import { IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  @IsNotEmpty()
  @ValidateIf(
    (_, value) => value !== null && value !== undefined && value !== '',
  )
  name?: string;

  @IsInt()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  year?: number;

  @IsString()
  @ValidateIf(
    (_, value) => value !== null && value !== undefined && value !== '',
  )
  artistId?: string | null; // refers to Artist
}
