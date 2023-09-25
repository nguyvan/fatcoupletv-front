import { ReturnEpisodeI } from './episode.dto';
import { FilmI, ReturnMovieI } from './movie.dto';

export interface ReturnSessionWatchingI {
    id: string;
    current_time: number;
    last_update: string;
    movie: ReturnMovieI;
    episode: ReturnEpisodeI;
}

export interface GetSessionI {
    id?: string;
    id_movie?: string;
}

export interface PostSessionI {
    id_movie: string;
    id_episode: string;
    current_time: number;
}

export interface ReturnCurrentWatchFilm {
    watchingFilm: FilmI;
    currentEp: number;
    currentTime: number;
    date: string;
    skip_into_time?: number;
}
