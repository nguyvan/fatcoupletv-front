import {
    GetSessionI,
    PostSessionI,
    ReturnCurrentWatchFilm,
    ReturnSessionWatchingI,
} from '../dtos/session.dto';
import axios from '../lib/axios';

export const getSession = async ({ id, id_movie }: GetSessionI) => {
    const response = await axios.get<{ session: ReturnSessionWatchingI }>(
        '/session',
        {
            params: {
                id,
                id_movie,
            },
        },
    );
    let session = response.data.session;
    let data_to_return: ReturnCurrentWatchFilm = {
        watchingFilm: {
            id: session.movie.id,
            name: session.movie.name,
            cover: session.movie.cover ?? '',
            description: session.movie.description,
            kind: session.movie.kind,
            nb_episodes: session.movie.nb_episode,
            trailer: session.movie.trailer ?? '',
        },
        currentEp: session.episode.episode,
        currentTime: session.current_time,
        date: session.last_update,
        skip_into_time: session.episode.skip_intro_time,
    };
    return data_to_return;
};

export const createOrUpdateSession = async ({
    id_movie,
    id_episode,
    current_time,
}: PostSessionI) => {
    await axios.post('/session', {
        id_movie,
        id_episode,
        current_time,
    });
};
