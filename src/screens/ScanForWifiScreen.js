// Internal: Displays the wifi networks that the connected particle button can
// see. The user can pick one, or enter some manual details.

import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Headline, Text, TextInput, Button } from 'react-native-paper';
import ModalSelector from 'react-native-modal-selector';
import { find, isNumber } from 'lodash';

import Softap from '../softap';
import WifiNetworks from '../components/WifiNetworks';

const securityOptions = [
  {key: 'label1', section: true, label: 'Common types'},
  {key: Softap.WPA2_AES_PSK, label: 'WPA2 AES (most common)'},
  {key: Softap.WEP_PSK, label: 'WEP (old)'},
  {key: Softap.OPEN, label: 'None (open Wifi)'},
  {key: 'label2', section: true, label: 'Unusual types'},
  {key: Softap.WPA2_MIXED_PSK, label: 'WPA2 Mixed'},
  {key: Softap.WPA2_TKIP_PSK, label: 'WPA2 TKIP'},
  {key: Softap.WPA_AES_PSK, label: 'WPA1 AES'},
  {key: Softap.WPA_TKIP_PSK, label: 'WPA1 TKIP'},
  {key: Softap.WEP_SHARED, label: 'WEP open'}
];

export default class ScanForWifiScreen extends Component {
  static navigationOptions = {
    title: 'Configure Wifi'
  }

  constructor() {
    super();
    this.state = {
      loaded: false,
      failed: false,
      networks: []
    }
  }

  async componentDidMount() {
    let networks = [];
    try {
      networks = await Softap.scan();
    } catch(e) {
      this.setState({failed: true, loaded: true});
      return
    }

    this.setState({networks: networks, loaded: true, failed: false});
  }

  async connect() {
    try {
      await Softap.configure({
        ssid: this.state.ssid,
        security: this.state.security,
        password: this.state.password
      });
    } catch(e) {
      this.setState({error: 'Unable to configure, go back and try again'});
      return
    }

    alert('Done!');
    this.props.navigation.popToTop();
  }

  handleNetworkPress(network) {
    this.setState({
      ssid: network.ssid,
      security: network.sec
    });
  }

  render() {
    if (this.state.error) {
      <View style={styles.view}><Headline>{this.state.error}</Headline></View>
    }

    const selectedSecurityOption = isNumber(this.state.security) && find(securityOptions, {key: this.state.security});

    return (
      <ScrollView contentContainerStyle={styles.view}>
        <Headline>Available wifi:</Headline>
        <WifiNetworks onPress={this.handleNetworkPress.bind(this)} {...this.state} />

        <Text>Tap a network above or enter details manually</Text>

        <TextInput
          label='Network name'
          autoCorrect={false}
          autoCapitalize='none'
          value={this.state.ssid}
          onChangeText={(ssid) => this.setState({ssid})}
        />

        <View style={{paddingTop: 30}}>
          <ModalSelector
            data={securityOptions}
            initValue={selectedSecurityOption ? selectedSecurityOption.label : "Tap to select Wifi security"}
            onChange={(option) => this.setState({security: option.key})} />
        </View>

        <TextInput
          label='Password'
          value={this.state.password}
          onChangeText={(password) => this.setState({password})}
          secureTextEntry
        />

        <Button primary raised onPress={this.connect.bind(this)}>Connect</Button>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  view: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginLeft: 50,
    marginRight: 50
  }
});
