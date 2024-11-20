import { IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  @ValidateIf(
    (_, value) => value !== null && value !== undefined && value !== '',
  )
  name?: string;

  @IsString()
  @ValidateIf(
    (_, value) => value !== null && value !== undefined && value !== '',
  )
  artistId?: string | null; // refers to Artist

  @IsString()
  @ValidateIf(
    (_, value) => value !== null && value !== undefined && value !== '',
  )
  albumId?: string | null; // refers to Album

  @IsInt()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  duration?: number;
}
