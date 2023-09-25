/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { CurrentEpisodeI } from './dtos/episode.dto';
import CommonRoute from './routes/common.route';
import { StatusBar, View, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AppContext from './contexts/app.context';

function App(): JSX.Element {
    const [currentEp, setCurrentEp] = React.useState<CurrentEpisodeI>();
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    return (
        <AppContext.Provider value={{ currentEp, setCurrentEp }}>
            <View className="flex-1">
                <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    backgroundColor={backgroundStyle.backgroundColor}
                />
                <CommonRoute />
            </View>
        </AppContext.Provider>
    );
}
export default App;
