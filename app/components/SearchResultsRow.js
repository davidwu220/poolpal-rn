import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native'

import AssetMap from '../config/AssetMap'

export default class SearchResultsRow extends Component {

  onPress = () => {
    this.props.onRowPress(this.props.id);
  }

  render() {
    const {icon, title, subtitle} = this.props

    return (
      <TouchableHighlight 
        onPress={this.onPress}
        underlayColor={'rgba(0,0,0,0.025)'}
        delayPressIn={0}
        delayPressOut={0}
      >
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Image
              style={styles.icon}
              source={AssetMap[icon]}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {title}
            </Text>
            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    minHeight: 56,
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: 24,
    justifyContent: 'center',
  },
  icon: {
    width: 15,
    height: 15,
  },
  textContainer: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    color: 'black',
  },
  subtitle: {
    fontSize: 12.5,
    color: '#A4A4AC',
  },
})
