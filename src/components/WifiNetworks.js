import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { ListItem, Paper } from 'react-native-paper';

// Internal: A representation of a Wifi network.
//
// TODO: Should probably show signal strength
const Network = ({ssid, onPress}) => {
  return (
    <ListItem
      title={ssid}
      description="A wifi network"
      onPress={onPress}
    />
  );
}

// Internal: List of wifi networks.
//
// networks: Array of networks from Softap.scan
// loaded: Has the scan finished?
// failed: Did the scan request fail?
export default class WifiNetworks extends Component {

  render() {
    const {networks, loaded, failed} = this.props;

    let content = null;

    if (!loaded) {
      content = <Text>Loading...</Text>;
    } else if (failed) {
      content = <Text>Failed. Go back and try again.</Text>;
    } else if (networks.length === 0) {
      content = <Text>No networks found. Enter details manually.</Text>;
    } else {
      content = networks.map((network, i) => {
        return <Network onPress={() => this.props.onPress(network)} key={i} {...network} />
      });
    }

    return (
      <ScrollView style={styles.list}>
        <Paper style={{minHeight: 200}}>
          { content }
        </Paper>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    height: 200,
    marginTop: 15,
    marginBottom: 15,
  }
});
