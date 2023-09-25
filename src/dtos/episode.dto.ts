import { FilmI } from './movie.dto';

export interface GetEpisodesI {
    page: number;
    limit: number;
    id_movie: string;
}

export interface GetEpisodeI {
    id_movie: string;
    ep: number;
}

export interface ReturnEpisodesI {
    id: string;
    video: string;
    poster: string | null;
    video_storage: string | null;
    poster_storage: string | null;
    id_movie: string;
    episode: number;
    subtitle: string | null;
    subtitle_storage: string;
    skip_intro_time?: number;
}

export interface ReturnEpisodeI {
    id: string;
    video: string | null;
    poster: string | null;
    video_storage: string;
    poster_storage: string;
    episode: number;
    subtitle: string | null;
    subtitle_storage: string;
    id_movie: string;
    skip_intro_time?: number;
}

export interface CurrentEpisodeI {
    watchingFilm: FilmI;
    currentEp: number;
    skip_into_time?: number;
}
