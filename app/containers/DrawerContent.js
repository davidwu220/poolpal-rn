import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes, Button } from 'react-native';
import { SafeAreaView } from 'react-navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'red',
  },
  safeContainer: {
    flex: 1,
  },
});

class DrawerContent extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    sceneStyle: ViewPropTypes.style,
    title: PropTypes.string,
  };

  static contextTypes = {
    drawer: PropTypes.object,
  };

  render() {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <Text>Drawer Content</Text>
          <Button title="Close" onPress={() => this.props.navigation.goBack()} />
          <Text>Title: {this.props.title} Name: {this.props.name}</Text>
          <Button title="Learn More" onPress={() => this.props.navigation.navigate('Second')} />
        </View>
      </SafeAreaView>
    );
  }
}

export default DrawerContent;