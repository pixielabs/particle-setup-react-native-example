import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Provider as PaperProvider } from 'react-native-paper';

import SplashScreen from './src/screens/SplashScreen';
import WaitForDeviceScreen from './src/screens/WaitForDeviceScreen';
import ScanForWifiScreen from './src/screens/ScanForWifiScreen';


const RootStack = createStackNavigator({
  Splash: {
    screen: SplashScreen,
  },
  WaitForDevice: {
    screen: WaitForDeviceScreen
  },
  ScanForWifi: {
    screen: ScanForWifiScreen
  }
});

export default class App extends React.Component {
  render() {

    return (
      <PaperProvider>
        <RootStack />
      </PaperProvider>
    )
  }
}
