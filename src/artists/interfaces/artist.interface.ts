export interface Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

export type ArtistResponse = Artist;
