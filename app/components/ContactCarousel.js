import React, { Component } from 'react'
import { Text, View, Dimensions, Button, StyleSheet } from 'react-native'
import Carousel from 'react-native-snap-carousel'

const sliderWidth = Dimensions.get('window').width;

export default class ContactCarousel extends Component {
  _renderItem = ({item, index}) => {
    const {name, address, profilePic, coordinate} = item;
    return (
      <View
        key={index}
        style={styles.slide}
      >
        <Text>{name}</Text>
        <Text>{address}</Text>
        <Button
          onPress={() => this.props.onPassengerSelect(coordinate)}
          title="Pick up"
          // color="dimgray"
        />
      </View>
    )
  }

  render() {
    return (
      <Carousel
        ref={(c) => { this._carousel = c; }}
        data={this.props.contacts}
        renderItem={this._renderItem}
        sliderWidth={sliderWidth}
        itemWidth={280}
        containerCustomStyle={ [styles.contactCarousel, this.props.hide ? {bottom: -300} : null] }
        useScrollView={true}
        enableMomentum={true}
        decelerationRate={0.9}
        onBeforeSnapToItem={this.props.highlightPassenger}
      />
    )
  }
}

const styles = StyleSheet.create({
  contactCarousel: {
    position: 'absolute',
    height: 240,
    bottom: 30,
  },
  slide: {
    height: 220,
    marginTop: 10,
    padding: 40,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    zIndex: 1,
  }
})


