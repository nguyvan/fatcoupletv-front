import { typeMovie } from '../constants/type-movie.constant';
import { KindI } from './kind.dto';

export interface ReturnMoviesI {
    id: string;
    name: string;
    description: string;
    kind: KindI[];
    nb_episodes: number;
    cover: string;
    trailer: string;
    cover_horizontal?: string;
}

export interface ReturnMovieI {
    id: string;
    name: string;
    slug: string;
    kind: KindI[];
    description: string;
    trailer: string | null;
    trailer_storage: string;
    cover: string | null;
    cover_storage: string;
    type: string;
    nb_episode: number;
}

export interface GetMoviesI {
    page: number;
    limit: number;
    search?: string;
    type?: typeMovie;
}

export interface FilmI {
    id: string;
    name: string;
    cover: string;
    description: string;
    kind: KindI[];
    nb_episodes: number;
    trailer: string;
    cover_horizontal?: string;
}
