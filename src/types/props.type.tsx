import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamsList = {
    Home: undefined;
    Splash: undefined;
    EpisodeSelection: undefined;
    VideoPlayer: {
        continueWatchingTime: number;
    };
    Search: undefined;
};

export type HomeProps = NativeStackScreenProps<RootStackParamsList, 'Home'>;
export type SplashProps = NativeStackScreenProps<RootStackParamsList, 'Splash'>;
export type EpisodeSelectionProps = NativeStackScreenProps<
    RootStackParamsList,
    'EpisodeSelection'
>;

export type VideoPlayerProps = NativeStackScreenProps<
    RootStackParamsList,
    'VideoPlayer'
>;

export type SearchProps = NativeStackScreenProps<RootStackParamsList, 'Search'>;
