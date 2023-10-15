import {
    View,
    Modal,
    TVEventControl,
    BackHandler,
    Alert,
    Platform,
} from 'react-native';
import { HomeProps } from '../types/props.type';
import { FilmI, ReturnMoviesI } from '../dtos/movie.dto';
import React from 'react';
import { typeMovie } from '../constants/type-movie.constant';
import Video from 'react-native-video';
import RNExitApp from 'react-native-exit-app';
import { hp, wp } from '../utils/responsive';
import TVNavbar from '../components/navbar/tv-navbar.component';
import FilmInfo from '../components/film-info/film-info.component';
import { getSession } from '../apis/session.api';
import { getMovies } from '../apis/movies.api';
import { LIMIT_MOVIE } from '../constants/limit.constant';
import AppContext from '../contexts/app.context';
import ListFilm from '../components/list-film/list-film.component';
import { useIsFocused } from '@react-navigation/native';

export const HomeScreen = ({ navigation, route }: HomeProps) => {
    const { setCurrentEp } = React.useContext(AppContext);
    const [films, setFilms] = React.useState<ReturnMoviesI[]>([]);
    const [type, setType] = React.useState<typeMovie>(typeMovie.MOVIE);
    const [idSelectedFilm, setIdSelectedFilm] = React.useState<string>('');
    const [isOpen, setIsOpen] = React.useState<boolean>(true);
    const [isTrailerPaused, setIsTrailerPaused] =
        React.useState<boolean>(false);
    const isFocused = useIsFocused();
    const [page, setPage] = React.useState<number>(0);

    const videoRef = React.useRef<Video>(null);

    const selectedFilm = React.useMemo(() => {
        return films.find(value => value.id === idSelectedFilm);
    }, [films, idSelectedFilm]);

    const onClickPlayButton = async (film: FilmI) => {
        setIsOpen(false);
        if (videoRef.current) {
            videoRef.current.seek(0);
        }
        setIsTrailerPaused(true);
        try {
            const session = await getSession({ id_movie: film.id });
            setIsTrailerPaused(true);
            Alert.alert(
                '',
                `You are watching ${session.watchingFilm.name} episode ${session.currentEp}`,
                [
                    {
                        text: 'Continue',
                        onPress: () => {
                            setCurrentEp!({
                                watchingFilm: session.watchingFilm,
                                currentEp: session.currentEp,
                            });
                            navigation.navigate('VideoPlayer', {
                                continueWatchingTime: session.currentTime,
                            });
                        },
                        isPreferred: true,
                    },
                    {
                        text: 'Cancel',
                        isPreferred: false,
                        style: 'cancel',
                        onPress: () => {
                            setCurrentEp!({
                                watchingFilm: film,
                                currentEp: session.currentEp,
                            });
                            if (film.nb_episodes > 1) {
                                navigation.navigate('EpisodeSelection');
                            } else {
                                navigation.navigate('VideoPlayer', {
                                    continueWatchingTime: 0,
                                });
                            }
                        },
                    },
                ],
            );
        } catch {
            setCurrentEp!({
                watchingFilm: film,
                currentEp: 1,
            });
            setIsTrailerPaused(true);
            if (film.nb_episodes > 1) {
                navigation.navigate('EpisodeSelection');
            } else {
                navigation.navigate('VideoPlayer', { continueWatchingTime: 0 });
            }
        }
    };

    const continueWatchFilm = async () => {
        try {
            const session = await getSession({});
            if (session.currentEp !== -1) {
                Alert.alert(
                    '',
                    `You are watching ${session.watchingFilm.name} episode ${session.currentEp}`,
                    [
                        {
                            text: 'Continue',
                            onPress: () => {
                                setCurrentEp!({
                                    watchingFilm: session.watchingFilm,
                                    currentEp: session.currentEp,
                                });
                                setIsOpen(false);
                                setIsTrailerPaused(true);
                                navigation.navigate('VideoPlayer', {
                                    continueWatchingTime: session.currentTime,
                                });
                            },
                            isPreferred: true,
                        },
                        {
                            text: 'Cancel',
                            isPreferred: false,
                            style: 'cancel',
                        },
                    ],
                );
            }
        } catch {}
    };

    React.useEffect(() => {
        (async () => {
            continueWatchFilm();
        })();
    }, []);

    React.useEffect(() => {
        (async () => {
            try {
                setPage(0);
                const movies = await getMovies({
                    page: 0,
                    limit: LIMIT_MOVIE,
                    type,
                });
                setFilms(movies);
            } catch {}
        })();
    }, [type]);

    React.useEffect(() => {
        (async () => {
            const movies = await getMovies({
                page: page,
                limit: LIMIT_MOVIE,
                type,
            });
            setFilms(films => {
                if (films.length) {
                    if (page) {
                        return [...films, ...movies];
                    } else {
                        return films;
                    }
                } else {
                    return movies;
                }
            });
        })();
    }, [page]);

    React.useEffect(() => {
        TVEventControl.enableTVMenuKey();
        const exitApp = () => {
            if (!navigation.isFocused()) {
                return false;
            }

            RNExitApp.exitApp();
            return true;
        };
        BackHandler.addEventListener('hardwareBackPress', exitApp);
        const blur = () => {
            setIsOpen(false);
            setIsTrailerPaused(true);
        };
        navigation.addListener('blur', blur);

        const focus = () => {
            setIsOpen(true);
            setIsTrailerPaused(false);
        };
        navigation.addListener('focus', focus);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', exitApp);
            navigation.removeListener('blur', blur);
            navigation.removeListener('focus', focus);
            TVEventControl.disableTVMenuKey();
        };
    }, [
        navigation,
        films,
        type,
        idSelectedFilm,
        isOpen,
        isTrailerPaused,
        page,
    ]);

    return (
        <View
            className={
                Platform.OS === 'android'
                    ? ''
                    : 'flex-1 items-center justify-center bg-black'
            }
            style={
                Platform.OS === 'android'
                    ? {
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'black',
                      }
                    : undefined
            }>
            <View
                className={Platform.OS === 'android' ? '' : 'w-full h-full'}
                style={
                    Platform.OS === 'android'
                        ? {
                              width: '100%',
                              height: '100%',
                          }
                        : undefined
                }>
                {selectedFilm && isFocused && isOpen ? (
                    <Video
                        ref={videoRef}
                        key={selectedFilm!.id}
                        source={{ uri: selectedFilm!.trailer, type: 'mp4' }}
                        resizeMode="cover"
                        className={
                            Platform.OS === 'android'
                                ? ''
                                : 'absolute top-0 bottom-0 left-0 right-0'
                        }
                        style={
                            Platform.OS === 'android'
                                ? {
                                      position: 'absolute',
                                      top: 0,
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                      width: wp(100),
                                      height: hp(100),
                                  }
                                : undefined
                        }
                        paused={isTrailerPaused}
                        repeat={true}
                        muted={false}
                        controls={false}
                        fullscreen={true}
                    />
                ) : (
                    <></>
                )}
            </View>
            <Modal
                transparent={true}
                visible={isOpen}
                onRequestClose={() => RNExitApp.exitApp()}>
                <View
                    className={
                        Platform.OS === 'android'
                            ? ''
                            : 'flex-col bg-transparent items-center justify-between absolute top-0 bottom-0 left-0 right-0'
                    }
                    style={[
                        { paddingBottom: hp(2) },
                        Platform.OS === 'android'
                            ? {
                                  flexDirection: 'column',
                                  backgroundColor: 'transparent',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  position: 'absolute',
                                  top: 0,
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                              }
                            : undefined,
                    ]}>
                    <TVNavbar
                        type={type}
                        setType={setType}
                        navigation={navigation}
                    />
                    <FilmInfo
                        film={selectedFilm}
                        onClickPlayButton={onClickPlayButton}
                    />
                    <ListFilm
                        films={films}
                        onClickPlayButton={onClickPlayButton}
                        setOffset={setPage}
                        idFocusedFilm={idSelectedFilm}
                        setIdFocusedFilm={setIdSelectedFilm}
                    />
                </View>
            </Modal>
        </View>
    );
};
