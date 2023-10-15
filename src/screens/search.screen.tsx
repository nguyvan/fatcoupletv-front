import React from 'react';
import {
    Alert,
    Image,
    TVEventControl,
    TVFocusGuideView,
    Text,
    TouchableOpacity,
    View,
    Platform,
    BackHandler,
} from 'react-native';
import { FlatList, TextInput } from 'react-native';
import { SVGSearchBlack } from '../assets/svg/SvgSearch';
import AppContext from '../contexts/app.context';
import { FilmI, ReturnMoviesI } from '../dtos/movie.dto';
import { getSession } from '../apis/session.api';
import { getMovies } from '../apis/movies.api';
import { LIMIT_MOVIE } from '../constants/limit.constant';
import { hp, wp } from '../utils/responsive';
import { useFocusEffect } from '@react-navigation/native';
import SVGReturn from '../assets/svg/SvgReturn';

const MovieItem = ({
    film,
    onClickPlayButton,
}: {
    film: ReturnMoviesI | string;
    onClickPlayButton: (film: FilmI) => void;
}) => {
    if (typeof film === 'string') {
        return (
            <TouchableOpacity
                className="w-1/4 flex-col items-center justify-center"
                style={{
                    flex: 1 / 4,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 20,
                    aspectRatio: 4 / 6,
                }}
            />
        );
    }
    return (
        <TouchableOpacity
            className="w-1/4 flex-col items-center justify-center"
            style={{
                flex: 1 / 4,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 20,
                aspectRatio: 4 / 6,
            }}
            onPress={() =>
                onClickPlayButton({
                    id: film.id,
                    name: film.name,
                    cover: film.cover,
                    description: film.description,
                    kind: film.kind,
                    nb_episodes: film.nb_episodes,
                    trailer: film.trailer,
                })
            }>
            <Image
                source={{ uri: film.cover }}
                className="flex-1 w-full h-full"
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                }}
            />
            <Text
                className="text-white text-3xl"
                style={{
                    marginTop: hp(2),
                    color: 'white',
                    fontSize: Platform.OS === 'android' ? 12 : 30,
                }}
                numberOfLines={1}>
                {film.name}
            </Text>
        </TouchableOpacity>
    );
};

export const SearchScreen = ({ navigation }: any) => {
    const { setCurrentEp } = React.useContext(AppContext);

    const [films, setFilms] = React.useState<ReturnMoviesI[] | []>([]);
    const [skip, setSkip] = React.useState<number>(0);
    const [search, setSearch] = React.useState<string>('');

    const ref = React.useRef<FlatList>(null);

    const blanks = React.useMemo(() => {
        return Array.from({ length: 4 - (films.length % 4) }).map(i => 'blank');
    }, [films]);

    const onClickPlayButton = async (film: FilmI) => {
        try {
            const session = await getSession({ id_movie: film.id });
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
            if (film.nb_episodes > 1) {
                navigation.navigate('EpisodeSelection');
            } else {
                navigation.navigate('VideoPlayer', {
                    continueWatchingTime: 0,
                });
            }
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (!navigation || !navigation.canGoBack()) {
                    return false;
                } else {
                    navigation.goBack();
                    return true;
                }
            };

            const subscription = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress,
            );

            return () => subscription.remove();
        }, [navigation]),
    );

    React.useEffect(() => {
        TVEventControl.enableTVMenuKey();
        return () => {
            TVEventControl.disableTVMenuKey();
        };
    }, [navigation]);

    React.useEffect(() => {
        (async () => {
            setSkip(0);
            const response = await getMovies({
                page: 0,
                limit: LIMIT_MOVIE,
                search,
            });
            setFilms(response);
        })();
    }, [search]);

    React.useEffect(() => {
        (async () => {
            const response = await getMovies({
                page: skip,
                limit: LIMIT_MOVIE,
                search,
            });
            setFilms(films => {
                if (films.length) {
                    if (skip) {
                        return [...films, ...response];
                    } else {
                        return films;
                    }
                } else {
                    return response;
                }
            });
        })();
    }, [skip]);

    return (
        <View
            className="flex-1 justify-center items-center bg-black"
            style={{
                paddingVertical: hp(3),
                paddingRight: wp(2),
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
            }}>
            <View
                className="w-full h-full flex-1 flex-row"
                style={{
                    width: '100%',
                    height: '100%',
                    flex: 1,
                    flexDirection: 'row',
                }}>
                <TVFocusGuideView
                    className="w-1/3 flex-row"
                    style={{
                        padding: 30,
                        width: '33.33%',
                        flexDirection: 'column',
                    }}
                    autoFocus>
                    {Platform.OS === 'android' ? (
                        <TouchableOpacity
                            style={{
                                alignSelf: 'flex-start',
                                transform: [{ scale: 0.4 }],
                                left: -28,
                            }}
                            onPress={() => {
                                if (navigation.canGoBack()) {
                                    navigation.goBack();
                                }
                            }}>
                            <SVGReturn />
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )}
                    <View
                        className="relative w-11/12 rounded-xl flex-row bg-white items-center overflow-hidden"
                        style={{
                            height: hp(6),
                            padding: 10,
                            width: '91.67%',
                            borderRadius: 12,
                            flexDirection: 'row',
                            backgroundColor: 'white',
                            alignItems: 'center',
                            overflow: 'hidden',
                        }}>
                        <View
                            className="flex-1 absolute left-5 self-center z-1"
                            style={{
                                zIndex: 1,
                                flex: 1,
                                position: 'absolute',
                                left: 5,
                                alignSelf: 'center',
                            }}>
                            <SVGSearchBlack
                                width={Platform.OS === 'android' ? '24' : '40'}
                                height={Platform.OS === 'android' ? '24' : '40'}
                            />
                        </View>
                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            blurOnSubmit={false}
                            textAlign="center"
                            className="absolute w-full overflow-hidden bg-white text-black items-center justify-center z-0"
                            style={{
                                fontSize: Platform.OS === 'android' ? 16 : 32,
                                zIndex: 0,
                                position: 'absolute',
                                width: '100%',
                                overflow: 'hidden',
                                backgroundColor: 'white',
                                color: 'black',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            placeholderTextColor="black"
                            placeholder="Search movie"
                        />
                    </View>
                </TVFocusGuideView>
                <View
                    className="flex-1 flex-col"
                    style={{ flex: 1, flexDirection: 'column' }}>
                    <FlatList
                        ref={ref}
                        data={[...films, ...blanks]}
                        renderItem={({ item, index }) => (
                            <MovieItem
                                film={item}
                                key={item === 'blank' ? item.id : index}
                                onClickPlayButton={onClickPlayButton}
                            />
                        )}
                        onContentSizeChange={() => {
                            let indexScroll =
                                skip * LIMIT_MOVIE < films.length
                                    ? skip * LIMIT_MOVIE
                                    : 0;
                            if (indexScroll > 0)
                                ref.current!.scrollToIndex({
                                    index: Math.round(indexScroll / 4) - 1,
                                });
                        }}
                        numColumns={4}
                        onEndReached={() => setSkip(skip => skip + 1)}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 20, width: 20 }} />
                        )}
                    />
                </View>
            </View>
        </View>
    );
};
