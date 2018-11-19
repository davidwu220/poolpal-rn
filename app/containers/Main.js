import React, { Component } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-navigation';
import { Haptic } from 'expo';
import MapView from 'react-native-maps';
import { connect } from 'react-redux'
import AssetMap from '../config/AssetMap'

import {
  LocationButtonGroup,
  LocationSearchHeader,
  LocationSearchResults,
  SearchResultsList,
  NavigationIcon,
  LocateButton,
} from '../components'

import ContactCarousel from '../components/ContactCarousel'

import MapViewDirections from 'react-native-maps-directions';

const mapStateToProps = (state) => ({
  recentLocations: state.recentLocations,
  savedContacts: state.savedContacts,
  shortcutLocations: state.recentLocations.slice(0, 3),
})

const GOOGLE_MAPS_API_KEY = "AIzaSyCjoSnExkHFCAHQayRetiW4w-dnSWCdeR0";
const { width, height } = Dimensions.get('window');

const getDelta = (lat, lon, distance) => {
  const oneDegreeOfLatitudeInMeters = 111.32 * 1000;

  const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
  const longitudeDelta = distance / (oneDegreeOfLatitudeInMeters * Math.cos(lat * (Math.PI / 180)));

  return result = {
      latitude: lat,
      longitude: lon,
      latitudeDelta,
      longitudeDelta,
  }
}

class Main extends Component {

  state = {
    searchResultsOpen: false,
    pickingPassengers: false,
    sourceText: 'Current Location',
    destinationText: '',
    coordinates: [],
    origin: null,
    waypoints: [],
    destination: null,
    go: false,
    accuracy: 0,
    heading: null,
    followsUserLocation: true,
    search: false,
    searchedList: [],
  }

  mapView = null;

  pastPredictionData = [];

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      let { latitude, longitude, accuracy } = coords;
      let region = getDelta(latitude, longitude, (accuracy*46));

      this.setState({ region });
    });
    this.watchID = navigator.geolocation.watchPosition(({ coords }) => {
      this.setState({
        posEst: coords
      });
    });
  }

  componentWillUnmount(){
    navigator.geolocation.clearWatch(this.watchID);
  }

  onGoButtonPress = () => {
    this.setState({
      go: true
    });
  }

  toggleSearchResults = () => {
    this.setState((state) => ({ 
      searchResultsOpen: !state.searchResultsOpen,
    }))
  }

  onSourceTextChange = (sourceText) => {
    this.setState({sourceText})
  }

  googlePlaceAutocompleteAPI = async (destinationText) => {
    try {
      let response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${destinationText}&key=${GOOGLE_MAPS_API_KEY}&components=country:us&location=${this.state.posEst.latitude},${this.state.posEst.longitude}&radius=500`
      );
      let responseJson = await response.json();

      return responseJson.predictions;
    } catch (error) {
      console.error(error);
    }
  }

  populateAutocompleteData = async (destinationText) => {
    let predictions = await this.googlePlaceAutocompleteAPI(destinationText);

    let searchedListWithPredictions = [];

    predictions.forEach((location) => {
      searchedListWithPredictions.push({
        id: location.place_id,
        icon: 'marker',
        title: location.structured_formatting.main_text,
        subtitle: (location.structured_formatting.secondary_text.replace(/, USA$/i, '')),
      })
    });

    this.setState({
      predictions: searchedListWithPredictions,
    });
  }

  onDestinationTextChange = (destinationText) => {
    // first filter local recent destinations
    // TODO: filter starting from beginning of a word
    let searchedList = this.props.recentLocations.filter(({title, subtitle}) => RegExp(destinationText, 'i').test(title) || RegExp(destinationText, 'i').test(subtitle));

    // then async concat autocompletetion data
    this.populateAutocompleteData(destinationText);

    this.setState({
      destinationText,
      search: destinationText !== '',
      searchedList,
    });
  }

  onMapPress = (e) => {
    let cloneWaypoints = this.state.waypoints.slice(0);
    cloneWaypoints.push(e.nativeEvent.coordinate);
    this.setState({
      waypoints: cloneWaypoints
    })
  }

  onMapDrag = () => {
    this.setState({ followsUserLocation: false });
  }

  onFollowUserPress = () => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      this.mapView.animateToCoordinate(coords);
      this.setState({ followsUserLocation: true });
    })
  }

  googlePlaceDetailAPI = async (place_id) => {
    try {
      let response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_MAPS_API_KEY}&placeid=${place_id}&fields=geometry`
      );
      let responseJson = await response.json();

      return responseJson.result;
    } catch (error) {
      console.error(error);
    }
  }

  onResultPress = async (place_id) => {
    let result = await this.googlePlaceDetailAPI(place_id);

    this.setState({
      origin: this.state.posEst,
      destination: {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng
      },
      waypoints: [],
      followsUserLocation: false,
      go: true,
      pickingPassengers: true
    });

    this.toggleSearchResults();
  }

  cancelPicking = () => {
    this.setState({
      origin: null,
      destination: null,
      waypoints: [],
      followsUserLocation: true,
      go: false,
      pickingPassengers: false
    });

    let coordsWithDelta = getDelta(this.state.posEst.latitude, this.state.posEst.longitude, (this.state.posEst.accuracy*46))
    this.mapView.animateToRegion(coordsWithDelta, 500);
  }

  highlightPassenger = (index) => {
    this.props.savedContacts.forEach((contact) => {
      if(contact.id == index) {
        this.mapView.fitToCoordinates([this.state.origin, ...this.state.waypoints, contact.coordinate, this.state.destination], {
          edgePadding: {
            top: (height * 0.05),
            right: (width * 0.1),
            bottom: (height * 0.5),
            left: (width * 0.1),
          }
        });
      }
    })
  }

  onPassengerSelect = (coord) => {
    this.setState(({waypoints}) => {
      let cloneWaypoints = waypoints.slice(0);
      cloneWaypoints.push(coord);
      return { waypoints: cloneWaypoints };
    });
  }

  render() {
    const {recentLocations, shortcutLocations, savedContacts} = this.props
    const {searchResultsOpen, pickingPassengers, sourceText, destinationText, region, go, followsUserLocation, search, searchedList, predictions, origin, waypoints, destination} = this.state

    return (
      <View style={styles.container}>
        <MapView
          // provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          // onPress={this.onMapPress}
          mapType={'mutedStandard'}
          showsUserLocation={true}
          showsCompass={true}
          followsUserLocation={followsUserLocation}
          showsMyLocationButton={!followsUserLocation}
          onMoveShouldSetResponder={this.onMapDrag}
          onMapReady={() => Haptic.notification(Haptic.NotificationTypes.Success)}
          // legalLabelInsets={pickingPassengers ? {bottom: (height * 0.4)} : null}
          loadingEnabled={true}
          ref={c => this.mapView = c}
        >
          {waypoints.map((coordinate, index) =>
            <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} />
          )}
          {savedContacts.map(({id, coordinate, activePin}) => (
            <MapView.Marker key={id} coordinate={coordinate} pinColor={activePin ? 'red' : 'gray'} />
          ))}
          {go && (
            <MapViewDirections
              origin={ origin }
              waypoints={ (waypoints.length > 0) ? waypoints : null }
              optimizeWaypoints={true}
              destination={destination}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={3}
              onReady={(result) => {
                this.mapView.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: (width * 0.05),
                    bottom: (height * 0.5),
                    left: (width * 0.05),
                    top: (height * 0.05),
                  }
                });
              }}
            />
          )}
        </MapView>
        <SafeAreaView style={styles.safeContainer}>
          {!pickingPassengers ? (
            <NavigationIcon
              icon={searchResultsOpen ? 'arrow-left' : 'hamburger'}
              onPress={searchResultsOpen ? this.toggleSearchResults : this.props.navigation.openDrawer}
            />
          ) : (
            <NavigationIcon
              icon={'arrow-left'}
              onPress={this.cancelPicking}
            />
          )}
          
          <LocationSearchHeader
            onPress={this.toggleSearchResults}
            hide={pickingPassengers}
            expanded={searchResultsOpen}
            sourceText={sourceText}
            destinationText={destinationText}
            onSourceTextChange={this.onSourceTextChange}
            onDestinationTextChange={this.onDestinationTextChange}
          />
          <LocateButton
            visible={!searchResultsOpen && !followsUserLocation}
            onPressLocation={this.onFollowUserPress}
            // locations={shortcutLocations}
          />
          <LocationSearchResults visible={searchResultsOpen}>
            <SearchResultsList 
              list={search && predictions ? searchedList.concat(predictions) : recentLocations}
              onRowPress={this.onResultPress}
            />
          </LocationSearchResults>
          <ContactCarousel
            contacts={savedContacts}
            hide={!pickingPassengers}
            highlightPassenger={this.highlightPassenger}
            onPassengerSelect={this.onPassengerSelect}
          />
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    zIndex: -1
  },
  safeContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  debug: {
    backgroundColor: 'rgba(0,0,0,0.20)',
    top: 500,
  },
})

export default connect(mapStateToProps)(Main);
