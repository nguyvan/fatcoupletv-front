import React from 'react';
import { FilmI } from '../../dtos/movie.dto';
import {
    TouchableOpacity,
    Image,
    TVFocusGuideView,
    FlatList,
    Platform,
} from 'react-native';
import { hp, wp } from '../../utils/responsive';

interface ListFilmProps {
    films: FilmI[];
    onClickPlayButton: (film: FilmI) => void;
    setOffset: React.Dispatch<React.SetStateAction<number>>;
    idFocusedFilm: string;
    setIdFocusedFilm: React.Dispatch<React.SetStateAction<string>>;
}

interface FilmProps {
    film: FilmI;
    onClickPlayButton: (film: FilmI) => void;
    isLastItem: boolean;
    idFocusedFilm: string;
    setIdFocusedFilm: React.Dispatch<React.SetStateAction<string>>;
}

const CardFilm = ({
    film,
    onClickPlayButton,
    isLastItem,
    idFocusedFilm,
    setIdFocusedFilm,
}: FilmProps) => {
    const handleFocusFilm = () => {
        setIdFocusedFilm(film.id);
    };
    const handleClickPlayButton = () => {
        onClickPlayButton(film);
    };
    return (
        <TouchableOpacity
            key={film.id}
            onPress={handleClickPlayButton}
            tvParallaxProperties={{
                enabled: true,
                magnification: 1.3,
            }}
            hasTVPreferredFocus={true}
            onFocus={handleFocusFilm}
            activeOpacity={Platform.OS === 'android' ? 0.2 : 1}
            style={{
                marginRight: isLastItem ? wp(3) : 0,
            }}>
            <Image
                source={{ uri: film.cover }}
                resizeMode="cover"
                className="rounded-xl"
                style={{
                    marginRight: wp(3),
                    width: wp(15),
                    height: hp(30),
                    opacity: idFocusedFilm === film.id ? 1 : 0.6,
                }}
            />
        </TouchableOpacity>
    );
};

const ListFilm = ({
    films,
    onClickPlayButton,
    setOffset,
    idFocusedFilm,
    setIdFocusedFilm,
}: ListFilmProps) => {
    return (
        <TVFocusGuideView
            className="flex-1"
            style={[
                { marginTop: hp(2) },
                Platform.OS === 'android' ? { flex: 1 } : undefined,
            ]}
            autoFocus>
            <FlatList
                data={films}
                horizontal={true}
                initialNumToRender={5}
                renderItem={({ item, index }) => (
                    <CardFilm
                        film={item}
                        onClickPlayButton={onClickPlayButton}
                        isLastItem={index === films.length - 1}
                        idFocusedFilm={idFocusedFilm}
                        setIdFocusedFilm={setIdFocusedFilm}
                    />
                )}
                onEndReached={() => setOffset((offset: number) => offset + 1)}
                className={
                    Platform.OS === 'android' ? '' : 'bg-black/10 rounded-3xl'
                }
                style={[
                    {
                        paddingHorizontal: wp(3),
                        paddingVertical: hp(3),
                    },
                    Platform.OS === 'android'
                        ? {
                              backgroundColor: 'rgba(0,0,0,0.1)',
                              borderRadius: 10,
                          }
                        : undefined,
                ]}
                contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            />
        </TVFocusGuideView>
    );
};

export default ListFilm;
