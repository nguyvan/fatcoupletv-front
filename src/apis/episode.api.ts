import {
    GetEpisodeI,
    GetEpisodesI,
    ReturnEpisodesI,
} from '../dtos/episode.dto';
import axios from '../lib/axios';

export const getEpisodes = async ({ page, limit, id_movie }: GetEpisodesI) => {
    const response = await axios.get<{ episodes: ReturnEpisodesI[] }>(
        '/episodes',
        {
            params: {
                page,
                limit,
                id_movie,
            },
        },
    );
    return response.data.episodes;
};

export const getEpisode = async ({ id_movie, ep }: GetEpisodeI) => {
    const response = await axios.get<{ episode: ReturnEpisodesI }>('/episode', {
        params: {
            id_movie,
            episode: ep,
        },
    });
    return response.data.episode;
};
