// Internal: Screen that sits and waits for a device to appear by 
// regularly polling for something to answer back with a device ID.

import React, { Component } from 'react';
import {
  View,
  ActivityIndicator
} from 'react-native';
import { Headline, Text } from 'react-native-paper';
import Softap from '../softap';

export default class WaitForDeviceScreen extends Component {

  constructor() {
    super();
    this.state = {};
  }

  // Poll, try and find a device on the wifi.
  async pollForDevice() {
    console.log('[WaitForDeviceScreen] pollForDevice');
    let deviceId;
    try {
      deviceId = await Softap.deviceId();
    } catch(e) {
      if (e == 'no device') {
        console.log('[WaitForDeviceScreen] no device yet');
        this.poll = setTimeout(this.pollForDevice.bind(this), 5000);
      } else {
        console.log(e);
        this.setState({error: 'Something went wrong'});
      }
      return;
    }

    this.props.navigation.navigate('ScanForWifi');
  }

  // When this screen appears, start polling in a moment.
  componentDidMount() {
    this.poll = setTimeout(this.pollForDevice.bind(this), 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.poll);
  }

  render() {
    const { deviceId, error } = this.state;

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View>
          <ActivityIndicator size='large' color='#000000' />
          <Headline>
            Waiting for device...
          </Headline>

          { error ? <Text>{error}</Text> : null }
        </View>
      </View>
    );
  }

}
