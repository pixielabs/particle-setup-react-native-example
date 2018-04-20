// Require node library shims before everything else
import 'node-libs-react-native/globals';

import { AppRegistry } from 'react-native';
import App from './App';

// Ignore warning caused by react-navigation
// https://github.com/react-navigation/react-navigation/issues/3956
// And a couple of others too...
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Module RNRandomBytes']);

AppRegistry.registerComponent('ParticleSoftapReactNativeExample', () => App);
