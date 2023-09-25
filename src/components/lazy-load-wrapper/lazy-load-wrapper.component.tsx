import React, { Suspense } from 'react';
import { Text } from 'react-native';
interface LazyLoadWrapperI {
    children: JSX.Element;
}

const Loading = () => {
    return <Text>Loading</Text>;
};

const LazyLoadWrapper = ({ children }: LazyLoadWrapperI) => {
    return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default LazyLoadWrapper;
