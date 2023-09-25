import React from 'react';
import {
    Alert,
    Image,
    TVEventControl,
    TVFocusGuideView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { FlatList, TextInput } from 'react-native';
import { SVGSearchBlack } from '../assets/svg/SvgSearch';
import AppContext from '../contexts/app.context';
import { FilmI, ReturnMoviesI } from '../dtos/movie.dto';
import { getSession } from '../apis/session.api';
import { getMovies } from '../apis/movies.api';
import { LIMIT_MOVIE } from '../constants/limit.constant';
import { hp, wp } from '../utils/responsive';

const MovieItem = ({
    film,
    onClickPlayButton,
}: {
    film: ReturnMoviesI;
    onClickPlayButton: (film: FilmI) => void;
}) => {
    return (
        <TouchableOpacity
            className="w-1/4 flex-col items-center justify-center"
            style={{
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
            />
            <Text
                className="text-white text-3xl"
                style={{ marginTop: hp(2) }}
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

    const onClickPlayButton = async (film: FilmI) => {
        const session = await getSession({ id_movie: film.id });
        try {
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
                            navigation.navigate('EpisodeSelection');
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
            }}>
            <View className="w-full h-full flex-1 flex-row">
                <TVFocusGuideView
                    className="w-1/3 flex-row"
                    style={{ padding: 30 }}
                    autoFocus>
                    <View
                        className="relative w-11/12 rounded-xl flex-row bg-white items-center overflow-hidden"
                        style={{
                            height: hp(6),
                            padding: 10,
                        }}>
                        <View
                            className="flex-1 absolute left-5 self-center z-1"
                            style={{
                                zIndex: 1,
                            }}>
                            <SVGSearchBlack />
                        </View>
                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            blurOnSubmit={false}
                            textAlign="center"
                            className="absolute w-full overflow-hidden bg-white text-black items-center justify-center z-0"
                            style={{
                                fontSize: 32,
                                zIndex: 0,
                            }}
                            placeholderTextColor="black"
                            placeholder="Search movie"
                        />
                    </View>
                </TVFocusGuideView>
                <View className="flex-1 flex-col">
                    <FlatList
                        ref={ref}
                        data={films}
                        renderItem={({ item }) => (
                            <MovieItem
                                film={item}
                                key={item.id}
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
