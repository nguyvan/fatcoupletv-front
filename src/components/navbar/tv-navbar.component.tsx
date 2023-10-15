import {
    TVFocusGuideView,
    TouchableOpacity,
    View,
    Text,
    Image,
    Platform,
} from 'react-native';
import { typeMovie } from '../../constants/type-movie.constant';
import React from 'react';
// @ts-ignore
import icon from '../../assets/icon.png';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamsList } from '../../types/props.type';
import { hp, wp } from '../../utils/responsive';
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
        <TVFocusGuideView
            className={
                Platform.OS === 'android'
                    ? ''
                    : 'px-5 flex-row w-11/12 h-1/5 self-center justify-between items-center bg-transparent'
            }
            style={
                Platform.OS === 'android'
                    ? {
                          width: wp(100),
                          flexDirection: 'row',
                          paddingHorizontal: wp(5),
                          height: hp(20),
                          alignSelf: 'center',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: 'transparent',
                      }
                    : undefined
            }>
            <View
                className={
                    Platform.OS === 'android'
                        ? ''
                        : 'flex-row w-1/5 h-1/5 justify-between items-center'
                }
                style={
                    Platform.OS === 'android'
                        ? {
                              width: wp(20),
                              flexDirection: 'row',
                              height: hp(20),
                              justifyContent: 'space-between',
                              alignItems: 'center',
                          }
                        : undefined
                }>
                {buttons.map(button => (
                    <TouchableOpacity
                        key={button.label}
                        onPress={() => setType(button.type)}
                        tvParallaxProperties={{
                            magnification: 1.2,
                        }}
                        hasTVPreferredFocus={true}
                        activeOpacity={Platform.OS === 'android' ? 0.2 : 1}>
                        <Text
                            style={{
                                fontSize: wp(2),
                                fontWeight: 'bold',
                                color: 'white',
                                opacity: type === button.type ? 1 : 0.5,
                            }}>
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
            <View
                className={
                    Platform.OS === 'android'
                        ? ''
                        : 'flex-row w-1/5 h-1/5 justify-end items-center'
                }
                style={
                    Platform.OS === 'android'
                        ? {
                              flexDirection: 'row',
                              width: wp(20),
                              height: hp(20),
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                          }
                        : undefined
                }>
                <TouchableOpacity
                    onPress={handleChangeSearch}
                    style={
                        Platform.OS === 'android'
                            ? {
                                  transform: [{ scale: 0.8 }],
                              }
                            : undefined
                    }>
                    <SVGSearchWhite />
                </TouchableOpacity>
            </View>
        </TVFocusGuideView>
    );
};

export default TVNavbar;
