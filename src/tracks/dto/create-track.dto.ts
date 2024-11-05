import { IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @ValidateIf((_, value) => !!value)
  artistId: string | null; // refers to Artist

  @IsString()
  @ValidateIf((_, value) => !!value)
  albumId: string | null; // refers to Album

  @IsInt()
  @IsNotEmpty()
  duration: number; // integer number
}
