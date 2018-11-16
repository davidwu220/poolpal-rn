import React, { Component } from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import Router from './config/Router'

// This app doesn't use actual APIs or dynamic data currently,
// but feel free to take this app as a starting point and build it out
const initialState = {
  recentLocations: [
    {id: 'ChIJZQ9c8IW8woARN0gTXFiTqSU', icon: 'home', title: 'Home', subtitle: 'Los Angeles, CA'},
    {id: '1', icon: 'recent', title: 'Zynga HQ', subtitle: '699 8th St, San Francisco'},
    {id: '2', icon: 'recent', title: 'Facebook HQ', subtitle: '888 Brannan St, San Francisco, CA'},
    {id: '3', icon: 'recent', title: '123 Apple Road', subtitle: 'Cupertino, CA'},
    {id: '4', icon: 'recent', title: '445 1st St', subtitle: 'Sunnyvale, CA'},
  ],
  savedContacts: [
    {id: '0', name: "User One", address: "123 Example Street.", profilePic: "", coordinate: {latitude: 34.043030, longitude: -118.481784}},
    {id: '1', name: "User Two", address: "123 Example Street.", profilePic: "", coordinate: {latitude: 34.058443, longitude: -118.419642}},
    {id: '2', name: "User Three", address: "123 Example Street.", profilePic: "", coordinate: {latitude: 34.043098, longitude: -118.446087}},
    {id: '3', name: "User Four", address: "123 Example Street.", profilePic: "", coordinate: {latitude: 34.031938, longitude: -118.456669}},
  ]
}

const store = createStore((state) => state, initialState)

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    )
  }
}