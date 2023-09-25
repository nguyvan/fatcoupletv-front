import Svg, { Path, SvgProps } from 'react-native-svg';

const SVGNext = (props: SvgProps) => (
    <Svg
        fill="white"
        height="80"
        width="80"
        id="Layer_1"
        viewBox="0 0 512 512"
        {...props}>
        <Path d="M0,381.4l237.7-118.9L0,143.6V381.4z M237.7,262.5v118.9l237.7-118.9L237.7,143.6V262.5z M475.4,143.6v118.9v118.9H512 V143.6H475.4z" />
    </Svg>
);
export default SVGNext;
