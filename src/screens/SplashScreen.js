// Internal: The splash screen gives the user some instructions to set up
// their Particle device, e.g. press the button to put it in set up mode

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default class SplashScreen extends Component {
  static navigationOptions = {
    title: 'Get ready...'
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.view}>
        <Text>To get started, put a Particle device in setup mode</Text>
        <Button raised primary onPress={() => navigate('WaitForDevice')}>
          Done that!
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
