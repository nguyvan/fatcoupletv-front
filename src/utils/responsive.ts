import { Dimensions } from 'react-native';

export function wp(percentage: number) {
    return (Dimensions.get('window').width * percentage) / 100;
}

export function hp(percentage: number) {
    return (Dimensions.get('window').height * percentage) / 100;
}
