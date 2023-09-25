import Svg, { Line, Circle, SvgProps } from 'react-native-svg';

export const SVGSearchWhite = (props: SvgProps) => (
    <Svg
        fill="white"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        id="search"
        data-name="Line Color"
        className="icon line-color"
        {...props}>
        <Line
            id="secondary"
            x1={21}
            y1={21}
            x2={15}
            y2={15}
            fill="none"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
        />
        <Circle
            id="primary"
            cx={10}
            cy={10}
            r={7}
            fill="none"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
        />
    </Svg>
);
export const SVGSearchBlack = (props: SvgProps) => (
    <Svg
        fill="black"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        id="search"
        data-name="Line Color"
        className="icon line-color"
        {...props}>
        <Line
            id="secondary"
            x1={21}
            y1={21}
            x2={15}
            y2={15}
            fill="none"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
        />
        <Circle
            id="primary"
            cx={10}
            cy={10}
            r={7}
            fill="none"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
        />
    </Svg>
);
