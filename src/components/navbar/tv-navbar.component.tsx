import {
    TVFocusGuideView,
    TouchableOpacity,
    View,
    Text,
    Image,
} from 'react-native';
import { typeMovie } from '../../constants/type-movie.constant';
import React from 'react';
// @ts-ignore
import icon from '../../assets/icon.png';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamsList } from '../../types/props.type';
import { hp } from '../../utils/responsive';
import { SVGSearchWhite } from '../../assets/svg/SvgSearch';

interface TVNavbarProps {
    type: typeMovie;
    setType: React.Dispatch<React.SetStateAction<typeMovie>>;
    navigation: NativeStackNavigationProp<
        RootStackParamsList,
        'Home',
        undefined
    >;
}

const buttons = [
    {
        label: 'Movies',
        type: typeMovie.MOVIE,
    },
    {
        label: 'Animes',
        type: typeMovie.ANIME,
    },
];

const TVNavbar = ({ type, setType, navigation }: TVNavbarProps) => {
    const handleChangeSearch = () => {
        navigation.navigate('Search');
    };
    return (
        <TVFocusGuideView className="px-5 flex-row w-11/12 h-1/5 self-center justify-between items-center bg-transparent">
            <View className="flex-row w-1/5 h-1/5 justify-between items-center">
                {buttons.map(button => (
                    <TouchableOpacity
                        key={button.label}
                        onPress={() => setType(button.type)}
                        tvParallaxProperties={{
                            magnification: 1.2,
                        }}
                        hasTVPreferredFocus={true}
                        activeOpacity={1}>
                        <Text
                            className={`text-white text-3xl font-bold ${
                                type === button.type
                                    ? 'opacity-100'
                                    : 'opacity-50'
                            }`}>
                            {button.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Image
                source={icon}
                style={{
                    height: hp(10),
                    tintColor: '#f7b99c',
                    resizeMode: 'contain',
                }}
            />
            <View className="flex-row w-1/5 h-1/5 justify-end items-center">
                <TouchableOpacity onPress={handleChangeSearch}>
                    <SVGSearchWhite />
                </TouchableOpacity>
            </View>
        </TVFocusGuideView>
    );
};

export default TVNavbar;
