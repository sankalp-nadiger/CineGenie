export type WatchStatus = 'watching' | 'completed' | 'plan_to_watch' | 'dropped';

export type ContentType = 'movie' | 'series';

export type Platform = 
  | 'Netflix' 
  | 'Amazon Prime' 
  | 'Disney+'
  | 'HBO Max'
  | 'YouTube'
  | 'Apple TV+'
  | 'Other';

export interface WatchEntry {
  id: string;
  title: string;
  type: ContentType;
  platform: Platform;
  dateWatched: string;
  rating: number;
  review: string;
  genre: string[];
  tags: string[];
  status: WatchStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalWatched: number;
  favoriteGenres: { genre: string; count: number }[];
  platformBreakdown: { platform: Platform; count: number }[];
  recentlyWatched: WatchEntry[];
  averageRating: number;
}