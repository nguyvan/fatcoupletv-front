import React from 'react';
import { CurrentEpisodeI } from '../dtos/episode.dto';

interface AppContextI {
    currentEp?: CurrentEpisodeI;
    setCurrentEp?: React.Dispatch<
        React.SetStateAction<CurrentEpisodeI | undefined>
    >;
}

const AppContext = React.createContext<AppContextI>({});

export default AppContext;
