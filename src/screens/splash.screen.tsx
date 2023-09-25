import { View, Text, Image } from 'react-native';
import { SplashProps } from '../types/props.type';
import React from 'react';
import Animated, {
    useSharedValue,
    withTiming,
    Easing,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    runOnJS,
} from 'react-native-reanimated';
import { hp, wp } from '../utils/responsive';
//@ts-ignore
import pig from '../assets/icon.png';

const APP_TITLE = 'FatCoupleTV';
const ANGLE = 9;
const TIME = 500;
const DELAY = 250;

const EASING = Easing.elastic(1.5);

export const SplashScreen = ({ navigation, route }: SplashProps) => {
    const [text, setText] = React.useState<string>('');
    const [currentIndex, setCurrentIndex] = React.useState<number>(0);
    const rotation = useSharedValue(1);
    const navigateToHome = () => {
        navigation.navigate('Home');
    };

    const style = useAnimatedStyle(() => {
        return {
            transform: [{ rotateZ: `${rotation.value}deg` }],
        };
    });

    React.useEffect(() => {
        if (currentIndex < APP_TITLE.length) {
            const timeout = setTimeout(() => {
                setText(prevText => prevText + APP_TITLE[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, DELAY);

            return () => clearTimeout(timeout);
        } else {
            rotation.value = withSequence(
                withTiming(-ANGLE, { duration: TIME / 2, easing: EASING }),
                withRepeat(
                    withTiming(ANGLE, {
                        duration: TIME,
                        easing: EASING,
                    }),
                    3,
                    true,
                ),
                withTiming(
                    0,
                    { duration: TIME / 2, easing: EASING },
                    finished => {
                        if (finished) runOnJS(navigateToHome)();
                    },
                ),
            );
        }
    }, [currentIndex, text]);
    return (
        <View className="flex-1 flex-row items-center justify-center bg-black">
            <Animated.View
                className="self-center round-2xl items-center justify-center"
                style={style}>
                <Image
                    source={pig}
                    style={{
                        height: hp(40),
                        resizeMode: 'contain',
                        width: wp(15),
                    }}
                />
            </Animated.View>
            <Text
                className="text-[#f7b99c] text-7xl font-bold"
                style={{ marginLeft: wp(2) }}>
                {text}
            </Text>
        </View>
    );
};
