import React from 'react';
import { VideoPlayerProps } from '../types/props.type';
import AppContext from '../contexts/app.context';
import {
    Modal,
    TVEventControl,
    TVEventHandler,
    TouchableOpacity,
    View,
    Text,
    Platform,
} from 'react-native';
import Video, {
    OnLoadData,
    OnProgressData,
    TextTrackType,
} from 'react-native-video';
import { ReturnEpisodesI } from '../dtos/episode.dto';
import { getEpisode } from '../apis/episode.api';
import socket from '../services/socket';
import SVGPlay from '../assets/svg/SvgPlay';
import SVGPause from '../assets/svg/SvgPause';
import { hp, wp } from '../utils/responsive';
import * as Progress from 'react-native-progress';
import SVGBack from '../assets/svg/SvgBack';
import SVGNext from '../assets/svg/SvgNext';
import SVGControl from '../assets/svg/SvgControl';
import SVGSkipForward from '../assets/svg/SvgSkipForward';
import SVGSkipBackward from '../assets/svg/SvgSkipBackward';
import SVGReturn from '../assets/svg/SvgReturn';

export const VideoPlayerScreen = ({ route, navigation }: VideoPlayerProps) => {
    const { currentEp, setCurrentEp } = React.useContext(AppContext);
    const [continueWatchingTime, setContinueWatchingTime] =
        React.useState<number>(route.params.continueWatchingTime);
    let tvEventHandler = new TVEventHandler();
    const player = React.useRef<Video>(null);

    const [videoEp, setVideoEp] = React.useState<ReturnEpisodesI | undefined>(
        undefined,
    );
    const [duration, setDuration] = React.useState<number>(1.0);
    const [currentTime, setCurrentTime] = React.useState<number>(0.0);
    const [currentTimeBackup, setCurrentTimeBackup] =
        React.useState<number>(0.0);
    const [currentTimeSaving, setCurrentTimeSaving] =
        React.useState<number>(0.0);
    const [paused, setPause] = React.useState<boolean>(false);
    const [controlDisplayed, setControlDisplayed] =
        React.useState<boolean>(true);
    const [startFromBeginning, setStartFromBeginning] =
        React.useState<boolean>(false);
    const [skipIntro, setSkipIntro] = React.useState<boolean>(false);
    const [skipEnding, setSkipEnding] = React.useState<boolean>(false);

    const fetchEpisodeData = async () => {
        if (currentEp) {
            try {
                const episode = await getEpisode({
                    id_movie: currentEp.watchingFilm.id,
                    ep: currentEp.currentEp,
                });
                setVideoEp(episode);
                setCurrentTimeBackup(0.0);
                setCurrentTimeSaving(0.0);
            } catch {}
        }
    };

    const displayTime = (seconds: number) => {
        return new Date(seconds * 1000).toISOString().substring(11, 19);
    };

    const onLoad = (data: OnLoadData) => {
        setSkipEnding(false);
        setDuration(data.duration);
        setContinueWatchingTime(0);
        if (
            player &&
            player.current &&
            continueWatchingTime &&
            !startFromBeginning
        ) {
            player.current.seek(continueWatchingTime);
        }
        if (
            (startFromBeginning || continueWatchingTime === 0) &&
            currentEp &&
            currentEp.watchingFilm.nb_episodes > 1
        ) {
            setSkipIntro(true);
        }
    };

    const onProgress = (data: OnProgressData) => {
        setCurrentTime(data.currentTime);
        if (
            !videoEp?.skip_intro_time ||
            data.currentTime > videoEp!.skip_intro_time
        ) {
            setSkipIntro(false);
        } else {
            setSkipIntro(true);
        }
        if (duration - data.currentTime <= 120) {
            setSkipEnding(true);
        } else {
            setSkipEnding(false);
        }
    };

    const renderPlayPauseControl = () => {
        return (
            <TouchableOpacity
                activeOpacity={Platform.OS === 'android' ? 0.2 : 1}
                hasTVPreferredFocus={true}
                onPress={() => setPause(!paused)}
                tvParallaxProperties={{ magnification: 1.2 }}
                style={
                    Platform.OS === 'android'
                        ? { transform: [{ scale: 0.4 }] }
                        : undefined
                }>
                {paused ? <SVGPlay /> : <SVGPause />}
            </TouchableOpacity>
        );
    };

    const goToNextEpisode = async () => {
        setStartFromBeginning(true);
        setSkipEnding(false);
        if (
            currentEp &&
            currentEp.currentEp + 1 < currentEp.watchingFilm.nb_episodes - 1
        ) {
            let data = {
                currentEp: currentEp.currentEp + 1,
                watchingFilm: currentEp.watchingFilm,
            };
            setCurrentEp!(data);
        } else setPause(true);
    };

    const renderNextBackControl = () => {
        return (
            <View
                className="flex-row justify-between items-center"
                style={{
                    width: Platform.OS === 'android' ? wp(30) : wp(12),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                {Platform.OS === 'android' ? (
                    <TouchableOpacity
                        tvParallaxProperties={{ magnification: 1.2 }}
                        hasTVPreferredFocus={true}
                        activeOpacity={Platform.OS === 'android' ? 0.2 : 1}
                        onPress={async () => {
                            player.current?.seek(currentTime - 10.0);
                        }}
                        style={
                            Platform.OS === 'android'
                                ? { transform: [{ scale: 0.3 }] }
                                : undefined
                        }>
                        <SVGSkipBackward />
                    </TouchableOpacity>
                ) : (
                    <></>
                )}
                {Platform.OS === 'android' ? (
                    <TouchableOpacity
                        tvParallaxProperties={{ magnification: 1.2 }}
                        hasTVPreferredFocus={true}
                        activeOpacity={Platform.OS === 'android' ? 0.2 : 1}
                        onPress={async () => {
                            player.current?.seek(currentTime + 10.0);
                        }}
                        style={
                            Platform.OS === 'android'
                                ? { transform: [{ scale: 0.3 }] }
                                : undefined
                        }>
                        <SVGSkipForward />
                    </TouchableOpacity>
                ) : (
                    <></>
                )}
                <TouchableOpacity
                    tvParallaxProperties={{ magnification: 1.2 }}
                    hasTVPreferredFocus={true}
                    activeOpacity={Platform.OS === 'android' ? 0.2 : 1}
                    onPress={async () => {
                        setStartFromBeginning(true);
                        setContinueWatchingTime(0);
                        if (currentEp && currentEp.currentEp - 1 > 0) {
                            let data = {
                                currentEp: currentEp.currentEp - 1,
                                watchingFilm: currentEp.watchingFilm,
                            };
                            setCurrentEp!(data);
                        } else setPause(true);
                    }}
                    style={
                        Platform.OS === 'android'
                            ? { transform: [{ scale: 0.4 }] }
                            : undefined
                    }>
                    <SVGBack />
                </TouchableOpacity>
                <TouchableOpacity
                    tvParallaxProperties={{ magnification: 1.2 }}
                    hasTVPreferredFocus={true}
                    activeOpacity={Platform.OS === 'android' ? 0.2 : 1}
                    onPress={goToNextEpisode}
                    style={
                        Platform.OS === 'android'
                            ? { transform: [{ scale: 0.4 }] }
                            : undefined
                    }>
                    <SVGNext />
                </TouchableOpacity>
            </View>
        );
    };

    React.useEffect(() => {
        fetchEpisodeData();
    }, [currentEp]);

    React.useEffect(() => {
        TVEventControl.enableTVMenuKey();
        tvEventHandler.enable(this, (cmp, evt) => {
            if (evt && evt.eventType === 'playPause') {
                setPause(paused => !paused);
            }
            if (evt && evt.eventType === 'up') {
                setControlDisplayed(true);
                setCurrentTimeBackup(currentTime);
            }
            if (evt && evt.eventType === 'down') {
                setControlDisplayed(false);
            }
            if (evt && evt.eventType === 'right' && !controlDisplayed) {
                player.current?.seek(currentTime + 10.0);
            }
            if (evt && evt.eventType === 'left' && !controlDisplayed) {
                player.current?.seek(currentTime - 10.0);
            }
        });

        return () => {
            if (tvEventHandler) {
                tvEventHandler.disable();
            }
            TVEventControl.disableTVMenuKey();
        };
    }, [currentTime, currentEp]);

    React.useEffect(() => {
        const blur = () => {
            setPause(true);
            setControlDisplayed(false);
        };

        const focus = () => {
            setVideoEp(undefined);
            setPause(false);
            setControlDisplayed(true);
        };
        navigation.addListener('blur', blur);
        navigation.addListener('focus', focus);
        return () => {
            navigation.removeListener('blur', blur);
            navigation.removeListener('focus', focus);
        };
    }, [
        navigation,
        currentTime,
        currentEp,
        videoEp,
        duration,
        controlDisplayed,
    ]);

    React.useEffect(() => {
        if (currentTime - currentTimeBackup >= 10.0) {
            if (controlDisplayed) {
                setControlDisplayed(false);
            }
        }
        if (currentTime - currentTimeSaving >= 60.0 && videoEp) {
            socket.emit('save_session', {
                id_movie: videoEp.id_movie,
                id_episode: videoEp.id,
                current_time: currentTime,
            });
            setCurrentTimeSaving(currentTime);
        }
        if (
            currentEp &&
            duration - currentTime <= 120.0 &&
            currentEp.watchingFilm.nb_episodes > 1
        ) {
            setSkipEnding(true);
        }
    }, [currentTime, currentTimeSaving, currentTimeBackup]);

    return (
        <View className="flex-1 justify-center items-center bg-black">
            <View className="w-full h-full">
                {videoEp ? (
                    <Video
                        ref={player}
                        source={{ uri: videoEp.video, type: 'mp4' }}
                        className="w-full h-full"
                        rate={1}
                        paused={paused}
                        volume={1}
                        muted={false}
                        resizeMode="cover"
                        onLoad={data => onLoad(data)}
                        onProgress={data => onProgress(data)}
                        onEnd={goToNextEpisode}
                        repeat={false}
                        controls={false}
                        fullscreen={true}
                        fullscreenOrientation="landscape"
                        textTracks={
                            videoEp.subtitle
                                ? [
                                      {
                                          title: 'Vietsub',
                                          language: 'en',
                                          type: TextTrackType.VTT,
                                          uri: videoEp.subtitle,
                                      },
                                  ]
                                : undefined
                        }
                        selectedTextTrack={
                            videoEp.subtitle
                                ? {
                                      type: 'title',
                                      value: 'Vietsub',
                                  }
                                : undefined
                        }
                    />
                ) : (
                    <></>
                )}
                {Platform.OS === 'android' ? (
                    <TouchableOpacity
                        style={{
                            zIndex: 99,
                            alignSelf: 'flex-end',
                            position: 'absolute',
                            top: '5%',
                        }}
                        onPress={() => {
                            setCurrentTimeBackup(currentTime);
                            setControlDisplayed(true);
                        }}>
                        <SVGControl />
                    </TouchableOpacity>
                ) : (
                    <></>
                )}
            </View>
            {currentEp && videoEp ? (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={controlDisplayed}>
                    <View
                        className="bg-black/60 absolute top-0 bottom-0 left-0 right-0 items-center justify-between flex-col"
                        style={{ paddingHorizontal: '5%' }}>
                        {Platform.OS === 'android' ? (
                            <View
                                style={{
                                    width: '70%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    alignSelf: 'flex-start',
                                }}>
                                <TouchableOpacity
                                    style={{
                                        marginTop: hp(2),
                                        transform: [{ scale: 0.4 }],
                                        left: -32,
                                    }}
                                    onPress={() => {
                                        if (navigation.canGoBack()) {
                                            setPause(true);
                                            setControlDisplayed(false);
                                            navigation.goBack();
                                        }
                                    }}>
                                    <SVGReturn />
                                </TouchableOpacity>
                                <Text
                                    className="text-white text-3xl font-bold"
                                    style={{
                                        alignSelf: 'center',
                                    }}>
                                    {`${currentEp.watchingFilm.name} : ${currentEp.currentEp}/${currentEp.watchingFilm.nb_episodes}`}
                                </Text>
                            </View>
                        ) : (
                            <Text
                                className="text-white text-3xl font-bold"
                                style={{
                                    marginTop: hp(2),
                                }}>
                                {`${currentEp.watchingFilm.name} : ${currentEp.currentEp}/${currentEp.watchingFilm.nb_episodes}`}
                            </Text>
                        )}
                        {skipEnding || skipIntro ? (
                            <View
                                className={
                                    Platform.OS === 'android'
                                        ? ''
                                        : 'w-full self-start h-3/4 justify-end items-end'
                                }
                                style={
                                    Platform.OS === 'android'
                                        ? {
                                              width: wp(90),
                                              justifyContent: 'flex-end',
                                              alignItems: 'flex-end',
                                              height: hp(70),
                                              alignSelf: 'center',
                                          }
                                        : undefined
                                }>
                                {skipEnding ? (
                                    <TouchableOpacity
                                        tvParallaxProperties={{
                                            magnification: 1.2,
                                        }}
                                        hasTVPreferredFocus={true}
                                        activeOpacity={
                                            Platform.OS === 'android' ? 0.2 : 1
                                        }
                                        onPress={goToNextEpisode}
                                        className={
                                            Platform.OS === 'android'
                                                ? ''
                                                : 'rounder-xl bg-black/70 items-center justify-center'
                                        }
                                        style={[
                                            {
                                                height: hp(5),
                                                width: wp(10),
                                            },
                                            Platform.OS === 'android'
                                                ? {
                                                      borderRadius: wp(10),
                                                      backgroundColor:
                                                          'rgba(0,0,0,0.7)',
                                                      alignItems: 'center',
                                                      justifyContent: 'center',
                                                  }
                                                : undefined,
                                        ]}>
                                        <Text
                                            className={
                                                Platform.OS === 'android'
                                                    ? ''
                                                    : 'text-white text-2xl font-bold'
                                            }
                                            style={
                                                Platform.OS === 'android'
                                                    ? {
                                                          color: 'white',
                                                          fontSize: wp(1.2),
                                                          fontWeight: 'bold',
                                                          lineHeight: wp(1.5),
                                                      }
                                                    : undefined
                                            }>
                                            Next episode
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <></>
                                )}
                                {skipIntro ? (
                                    <TouchableOpacity
                                        activeOpacity={
                                            Platform.OS === 'android' ? 0.2 : 1
                                        }
                                        onPress={() => {
                                            if (player && player.current) {
                                                player.current.seek(340);
                                            }
                                            setSkipIntro(false);
                                        }}
                                        className={
                                            Platform.OS === 'android'
                                                ? ''
                                                : 'rounder-xl bg-black/70 items-center justify-center'
                                        }
                                        style={[
                                            {
                                                height: hp(5),
                                                width: wp(10),
                                            },
                                            Platform.OS === 'android'
                                                ? {
                                                      borderRadius: wp(10),
                                                      backgroundColor:
                                                          'rgba(0,0,0,0.7)',
                                                      alignItems: 'center',
                                                      justifyContent: 'center',
                                                  }
                                                : undefined,
                                        ]}
                                        tvParallaxProperties={{
                                            magnification: 1.2,
                                        }}
                                        hasTVPreferredFocus={true}>
                                        <Text
                                            className={
                                                Platform.OS === 'android'
                                                    ? ''
                                                    : 'text-white text-2xl font-bold'
                                            }
                                            style={
                                                Platform.OS === 'android'
                                                    ? {
                                                          color: 'white',
                                                          fontSize: wp(1.2),
                                                          fontWeight: 'bold',
                                                          lineHeight: wp(1.5),
                                                      }
                                                    : undefined
                                            }>
                                            Skip intro
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <></>
                                )}
                            </View>
                        ) : (
                            <></>
                        )}
                        <View
                            className={
                                Platform.OS === 'android'
                                    ? ''
                                    : 'w-11/12 self-start h-2/12 justify-center'
                            }
                            style={[
                                { marginBottom: hp(2) },
                                Platform.OS === 'android'
                                    ? {
                                          width: wp(90),
                                          alignSelf: 'center',
                                          height: hp(10),
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                      }
                                    : undefined,
                            ]}>
                            <Progress.Bar
                                progress={currentTime / duration}
                                width={wp(90)}
                                color="white"
                                unfilledColor="rgba(0,0,0,0.6)"
                            />
                            <View
                                className={
                                    Platform.OS === 'android'
                                        ? ''
                                        : 'flex-row h-4/12 items-center justify-between'
                                }
                                style={[
                                    {
                                        width: wp(90),
                                        marginTop: hp(2),
                                    },
                                    Platform.OS === 'android'
                                        ? {
                                              flexDirection: 'row',
                                              height: hp(2),
                                              alignItems: 'center',
                                              justifyContent: 'space-between',
                                              left: -32,
                                              marginTop: hp(5),
                                          }
                                        : undefined,
                                ]}>
                                <View
                                    className={
                                        Platform.OS === 'android'
                                            ? ''
                                            : 'flex-row justify-center'
                                    }
                                    style={
                                        Platform.OS === 'android'
                                            ? {
                                                  flexDirection: 'row',
                                                  justifyContent: 'center',
                                              }
                                            : undefined
                                    }>
                                    {renderPlayPauseControl()}
                                    <View
                                        className="flex-row"
                                        style={{
                                            marginLeft: 15,
                                        }}>
                                        <Text
                                            className="self-center text-3xl text-white"
                                            style={[
                                                { paddingHorizontal: 2 },
                                                Platform.OS === 'android'
                                                    ? {
                                                          alignSelf: 'center',
                                                          fontSize: wp(2),
                                                          color: 'white',
                                                      }
                                                    : undefined,
                                            ]}>
                                            {`${displayTime(
                                                currentTime,
                                            )}/${displayTime(duration)}`}
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    className="flex-row justify-center items-center"
                                    style={
                                        Platform.OS === 'android'
                                            ? {
                                                  right: -10,
                                              }
                                            : undefined
                                    }>
                                    {renderNextBackControl()}
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            ) : (
                <></>
            )}
        </View>
    );
};
