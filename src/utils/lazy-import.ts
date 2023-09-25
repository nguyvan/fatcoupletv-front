import React from 'react';

export function lazyImport<
    T extends React.ComponentType<any>,
    I extends { [K2 in K]: T },
    K extends keyof I,
>(factory: () => Promise<I>, name: K) {
    return Object.create({
        [name]: React.lazy(() =>
            factory().then(module => ({ default: module[name] })),
        ),
    });
}
