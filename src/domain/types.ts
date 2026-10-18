export type TitleKind = 'film' | 'series';
export interface Title {
  id: string; name: string; tagline: string; synopsis: string; genres: string[];
  kind: TitleKind; year: number; rating: string; duration: string; image: string;
  video: string; demoCredit: string; color: string; featured?: boolean;
}
export interface Profile { id: string; name: string; color: string; }
export interface WatchProgress { position: number; duration: number; updatedAt: number; }
export interface ProfileLibrary { list: string[]; progress: Record<string, WatchProgress>; }
export interface StorageLike { getItem(key: string): string | null; setItem(key: string, value: string): void; }
