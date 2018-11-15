import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'

import AssetMap from '../config/AssetMap'

const transitionProps = ['top']

export default class LocateButton extends Component {

  static defaultProps = {
    visible: true,
    locations: [],
    onPressLocation: () => {},
  }

  render() {
    const { visible } = this.props
    const { height: windowHeight } = Dimensions.get('window')
    const { onPressLocation } = this.props

    const containerStyle = {
      top: visible ? windowHeight * 0.85 : windowHeight + 30,
    }

    return (
      <Animatable.View
        style={[styles.container, containerStyle]}
        easing={'ease-in-out'}
        duration={300}
        transition={transitionProps}
      >
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={onPressLocation}
          activeOpacity={0.5}
        >
          <Image
            style={styles.image}
            source={AssetMap['locate']}
          />
        </TouchableOpacity>
      </Animatable.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 30,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    shadowOpacity: 0.2,
  },
  image: {
    width: 22,
    height: 22,
  }
})
