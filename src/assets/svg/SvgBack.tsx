import Svg, { Path, SvgProps } from 'react-native-svg';

const SVGBack = (props: SvgProps) => (
    <Svg
        fill="white"
        height="80"
        width="80"
        id="Layer_1"
        viewBox="0 0 512 512"
        {...props}>
        <Path d="M274.3,262.5L512,381.4V143.6L274.3,262.5z M36.6,262.5l237.7,118.9V262.5V143.6L36.6,262.5z M0,143.6v237.7h36.6V262.5 V143.6H0z" />
    </Svg>
);
export default SVGBack;
