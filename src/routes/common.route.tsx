import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { lazyImport } from '../utils/lazy-import';
import { NavigationContainer } from '@react-navigation/native';
import {
    EpisodeSelectionProps,
    HomeProps,
    RootStackParamsList,
    SearchProps,
    SplashProps,
    VideoPlayerProps,
} from '../types/props.type';
import LazyLoadWrapper from '../components/lazy-load-wrapper/lazy-load-wrapper.component';

const { HomeScreen } = lazyImport(
    () => import('../screens/home.screen'),
    'HomeScreen',
);

const { SplashScreen } = lazyImport(
    () => import('../screens/splash.screen'),
    'SplashScreen',
);

const { EpisodeSelectionScreen } = lazyImport(
    () => import('../screens/episode-selection.screen'),
    'EpisodeSelectionScreen',
);

const { VideoPlayerScreen } = lazyImport(
    () => import('../screens/video-player.screen'),
    'VideoPlayerScreen',
);

const { SearchScreen } = lazyImport(
    () => import('../screens/search.screen'),
    'SearchScreen',
);

const LazyHomeScreen = (props: HomeProps) => {
    return (
        <LazyLoadWrapper>
            <HomeScreen {...props} />
        </LazyLoadWrapper>
    );
};

const LazySplashScreen = (props: SplashProps) => {
    return (
        <LazyLoadWrapper>
            <SplashScreen {...props} />
        </LazyLoadWrapper>
    );
};

const LazyEpisodeSelectionScreen = (props: EpisodeSelectionProps) => {
    return (
        <LazyLoadWrapper>
            <EpisodeSelectionScreen {...props} />
        </LazyLoadWrapper>
    );
};

const LazyVideoPlayerScreen = (props: VideoPlayerProps) => {
    return (
        <LazyLoadWrapper>
            <VideoPlayerScreen {...props} />
        </LazyLoadWrapper>
    );
};

const LazySearchScreen = (props: SearchProps) => {
    return (
        <LazyLoadWrapper>
            <SearchScreen {...props} />
        </LazyLoadWrapper>
    );
};

const Stack = createNativeStackNavigator<RootStackParamsList>();

const CommonRoute = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen
                    name="Splash"
                    component={LazySplashScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={LazyHomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EpisodeSelection"
                    component={LazyEpisodeSelectionScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="VideoPlayer"
                    component={LazyVideoPlayerScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Search"
                    component={LazySearchScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default CommonRoute;
