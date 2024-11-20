import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdateArtistDto {
  @IsString()
  @IsNotEmpty()
  @ValidateIf(
    (_, value) => value !== null && value !== undefined && value !== '',
  )
  name?: string;

  @IsBoolean()
  @IsNotEmpty()
  @ValidateIf((_, value) => value !== undefined)
  grammy?: boolean | null;
}
