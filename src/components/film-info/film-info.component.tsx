import {
    TouchableOpacity,
    View,
    Text,
    ScrollView,
    Platform,
} from 'react-native';
import { FilmI } from '../../dtos/movie.dto';
import { hp, wp } from '../../utils/responsive';
import SVGPlay from '../../assets/svg/SvgPlay';

interface FilmInfoProps {
    film?: FilmI;
    onClickPlayButton: (film: FilmI) => void;
}

const FilmInfo = ({ film, onClickPlayButton }: FilmInfoProps) => {
    const onPress = () => {
        onClickPlayButton(film!);
    };

    return film ? (
        <View
            className="bg-transparent flex-col self-start items-start justify-between"
            style={{
                width: wp(50),
                height: hp(35),
                marginLeft: wp(5),
            }}>
            <View className="flex-col" style={{ height: hp(25) }}>
                <Text
                    style={{
                        fontSize: wp(3),
                        color: 'white',
                        fontWeight: 'bold',
                    }}>
                    {film.name}
                </Text>
                <View
                    className="grow shrink"
                    style={{
                        marginTop: hp(2),
                        maxHeight: hp(16),
                    }}>
                    <ScrollView
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                        isTVSelectable={true}>
                        <Text
                            style={{
                                fontSize: wp(1.5),
                                color: 'rgba(255,255,255,0.6)',
                                flexWrap: 'wrap',
                                fontWeight: '600',
                            }}>
                            {film.description}
                        </Text>
                    </ScrollView>
                </View>
            </View>
            <TouchableOpacity
                style={{
                    width: wp(12),
                    height: hp(8),
                    backgroundColor: '#943001',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 50,
                    opacity: 0.2,
                }}
                activeOpacity={Platform.OS === 'android' ? 0.2 : 1}
                onPress={onPress}>
                <View
                    style={{
                        transform: [{ scale: 0.4 }],
                        left: Platform.OS === 'android' ? -16 : 0,
                    }}>
                    <SVGPlay />
                </View>
                <Text
                    style={{
                        color: 'white',
                        fontSize: wp(1.5),
                        fontWeight: '600',
                        left: Platform.OS === 'android' ? -36 : 0,
                    }}>
                    Xem phim
                </Text>
            </TouchableOpacity>
        </View>
    ) : (
        <></>
    );
};

export default FilmInfo;
