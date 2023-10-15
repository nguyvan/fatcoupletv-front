import React from 'react';
import { EpisodeSelectionProps } from '../types/props.type';
import AppContext from '../contexts/app.context';
import { ReturnEpisodesI } from '../dtos/episode.dto';
import { LIMIT_EPISODE } from '../constants/limit.constant';
import { getEpisodes } from '../apis/episode.api';
import {
    TVEventControl,
    View,
    Image,
    Modal,
    Text,
    TouchableOpacity,
    TVFocusGuideView,
    FlatList,
    Platform,
    ScrollView,
    BackHandler,
} from 'react-native';
import { hp, wp } from '../utils/responsive';
import { getSession } from '../apis/session.api';
import { useFocusEffect } from '@react-navigation/native';
import SVGReturn from '../assets/svg/SvgReturn';

interface EpisodeCardProps {
    index: number;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    nbPages: number;
    lastEp: number;
}

const EpisodeCard = ({
    index,
    page,
    setPage,
    nbPages,
    lastEp,
}: EpisodeCardProps) => {
    return (
        <TouchableOpacity
            key={index}
            style={{
                borderBottomWidth: page === index ? 3 : 0,
                borderColor: '#f7b99c',
                marginRight: wp(3),
            }}
            tvParallaxProperties={{
                magnification: 1.2,
            }}
            hasTVPreferredFocus={true}
            activeOpacity={Platform.OS === 'android' ? 0.2 : 1}
            onPress={() => setPage(index)}>
            <Text
                style={{
                    color: 'white',
                    fontSize: Platform.OS === 'android' ? 20 : 36,
                    fontWeight: 'bold',
                }}>
                {index * 100 + 1} -{' '}
                {index === nbPages - 1 ? lastEp : (index + 1) * 100}
            </Text>
        </TouchableOpacity>
    );
};

export const EpisodeSelectionScreen = ({
    navigation,
}: EpisodeSelectionProps) => {
    const { currentEp, setCurrentEp } = React.useContext(AppContext);
    const [page, setPage] = React.useState<number>(0);
    const [episodes, setEpisodes] = React.useState<ReturnEpisodesI[]>([]);
    const [nbPages, setNbPages] = React.useState<number>(0);
    const [modalVisibility, setModalVisibility] = React.useState<boolean>(true);
    const [focusEp, setFocusEp] = React.useState<number>(0);

    const fetchEpisodeData = async () => {
        if (currentEp) {
            try {
                const episodes_ = await getEpisodes({
                    page: page,
                    limit: LIMIT_EPISODE,
                    id_movie: currentEp.watchingFilm.id,
                });
                setEpisodes(episodes_);
                setNbPages(
                    Math.floor(
                        currentEp.watchingFilm.nb_episodes / LIMIT_EPISODE,
                    ) +
                        (currentEp.watchingFilm.nb_episodes % LIMIT_EPISODE > 0
                            ? 1
                            : 0),
                );
            } catch {}
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (!navigation || !navigation.canGoBack()) {
                    return false;
                } else {
                    setModalVisibility(false);
                    setFocusEp(-1);
                    setPage(0);
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
    }, [focusEp]);

    React.useEffect(() => {
        fetchEpisodeData();
    }, [currentEp, page]);

    React.useEffect(() => {
        const blur = () => {
            setModalVisibility(false);
            setFocusEp(-1);
            setPage(0);
        };
        navigation.addListener('blur', blur);

        const focus = async () => {
            setModalVisibility(true);
            setFocusEp(-1);
            setPage(0);
        };
        navigation.addListener('focus', focus);

        return () => {
            navigation.removeListener('blur', blur);
            navigation.removeListener('focus', focus);
        };
    }, [navigation, modalVisibility, focusEp]);
    return (
        <View className="flex-1 justify-center items-center bg-[#3C3737]">
            {currentEp ? (
                <Image
                    source={{
                        uri:
                            currentEp.watchingFilm.cover_horizontal ??
                            currentEp.watchingFilm.cover,
                    }}
                    style={{
                        width: wp(100),
                        height: hp(100),
                        resizeMode: 'cover',
                        zIndex: 0,
                    }}
                />
            ) : (
                <></>
            )}
            {currentEp && (
                <Modal transparent={true} visible={modalVisibility}>
                    <View
                        className={
                            Platform.OS === 'android'
                                ? ''
                                : 'bg-black/30 flex-col justify-between items-center absolute bottom-0 left-0 right-0'
                        }
                        style={[
                            {
                                top: hp(40),
                                paddingVertical: hp(2),
                                paddingHorizontal: wp(5),
                            },
                            Platform.OS === 'android'
                                ? {
                                      backgroundColor: 'rgba(0,0,0,0.3)',
                                      flexDirection: 'column',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      position: 'absolute',
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                  }
                                : undefined,
                        ]}>
                        {Platform.OS === 'android' ? (
                            <TouchableOpacity
                                style={{
                                    zIndex: 99,
                                    alignSelf: 'flex-start',
                                    position: 'absolute',
                                    transform: [{ scale: 0.4 }],
                                    left: 28,
                                }}
                                onPress={() => {
                                    if (navigation.canGoBack()) {
                                        setModalVisibility(false);
                                        setFocusEp(-1);
                                        setPage(0);
                                        navigation.goBack();
                                    }
                                }}>
                                <SVGReturn />
                            </TouchableOpacity>
                        ) : (
                            <></>
                        )}
                        <Text
                            className="text-6xl text-white font-bold"
                            style={{
                                fontSize: Platform.OS === 'android' ? 36 : 60,
                            }}>
                            {currentEp.watchingFilm.name}
                        </Text>
                        <FlatList
                            contentContainerStyle={{
                                justifyContent: 'flex-start',
                                alignSelf: 'flex-start',
                            }}
                            horizontal={true}
                            data={[...Array(nbPages)]}
                            renderItem={({ item, index }) => (
                                <EpisodeCard
                                    key={index}
                                    index={index}
                                    page={page}
                                    setPage={setPage}
                                    lastEp={currentEp.watchingFilm.nb_episodes}
                                    nbPages={nbPages}
                                />
                            )}
                            style={{
                                flexGrow: 0,
                            }}
                        />
                        <TVFocusGuideView
                            className="flex-1"
                            style={[
                                {
                                    marginVertical: hp(2),
                                    height: hp(30),
                                    width: wp(100),
                                },
                                Platform.OS === 'android'
                                    ? {
                                          flex: 1,
                                      }
                                    : undefined,
                            ]}
                            autoFocus>
                            <FlatList
                                data={episodes}
                                horizontal={false}
                                initialNumToRender={5}
                                numColumns={10}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={async () => {
                                            setFocusEp(-1);
                                            setModalVisibility(false);
                                            let data = {
                                                watchingFilm:
                                                    currentEp.watchingFilm,
                                                currentEp:
                                                    page * 100 + index + 1,
                                            };
                                            setCurrentEp!(data);
                                            try {
                                                const session =
                                                    await getSession({
                                                        id_movie: item.id_movie,
                                                    });
                                                const ep =
                                                    session.currentEp ===
                                                    index + 1
                                                        ? session.currentTime
                                                        : 0;
                                                navigation.navigate(
                                                    'VideoPlayer',
                                                    {
                                                        continueWatchingTime:
                                                            ep,
                                                    },
                                                );
                                            } catch {
                                                navigation.navigate(
                                                    'VideoPlayer',
                                                    {
                                                        continueWatchingTime: 0,
                                                    },
                                                );
                                            }
                                        }}
                                        tvParallaxProperties={{
                                            enabled: true,
                                            magnification: 1.3,
                                        }}
                                        hasTVPreferredFocus={true}
                                        onFocus={() => {
                                            setFocusEp(index);
                                        }}
                                        activeOpacity={
                                            Platform.OS === 'android' ? 0.2 : 1
                                        }
                                        style={{
                                            flex: 0.1,
                                            aspectRatio: 8 / 5,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 10,
                                            backgroundColor: 'white',
                                            marginRight: wp(3),
                                            marginBottom:
                                                index >= 90 ? hp(5) : 0,
                                            marginTop: index < 10 ? hp(2) : 0,
                                        }}>
                                        <Text
                                            className="text-black text-3xl font-medium"
                                            style={{
                                                fontSize:
                                                    Platform.OS === 'android'
                                                        ? 16
                                                        : 30,
                                            }}>
                                            {page * 100 + index + 1}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                style={{
                                    paddingHorizontal: wp(5),
                                }}
                                ItemSeparatorComponent={() => (
                                    <View style={{ height: 30 }} />
                                )}
                            />
                        </TVFocusGuideView>
                    </View>
                </Modal>
            )}
        </View>
    );
};
