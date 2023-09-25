import { GetMoviesI, ReturnMoviesI } from '../dtos/movie.dto';
import axios from '../lib/axios';

export const getMovies = async ({ page, limit, search, type }: GetMoviesI) => {
    const response = await axios.get<{ movies: ReturnMoviesI[] }>('/movies', {
        params: {
            page,
            limit,
            search,
            type,
        },
    });
    let movies: ReturnMoviesI[] = response.data.movies.map(val => ({
        id: val.id,
        name: val.name,
        description: val.description,
        kind: val.kind,
        nb_episodes: val.nb_episodes,
        cover: val.cover,
        trailer: val.trailer,
        cover_horizontal:
            val.cover_horizontal !== null ? val.cover_horizontal : undefined,
    }));
    return movies;
};
