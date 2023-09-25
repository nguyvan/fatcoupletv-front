import { TouchableOpacity, View, Text, ScrollView } from 'react-native';
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
                <Text className="text-6xl text-white font-bold">
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
                        <Text className="text-3xl flex-wrap font-semibold text-white/60">
                            {film.description}
                        </Text>
                    </ScrollView>
                </View>
            </View>
            <TouchableOpacity
                className="bg-[#943001] flex-row items-center justify-start rounded-[50px] opacity-20"
                style={{
                    width: wp(12),
                    height: hp(8),
                }}
                activeOpacity={1}
                onPress={onPress}>
                <View className="scale-50">
                    <SVGPlay />
                </View>
                <Text
                    className="text-white text-2xl font-semibold"
                    style={{
                        marginLeft: 9,
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
