import React, { Component } from 'react';
import { Dimensions, StatusBar } from 'react-native';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Main from '../containers/Main';
import DrawerContent from '../containers/DrawerContent';

const { width } = Dimensions.get('window');

const MainStack = createStackNavigator(
  {
    Home: Main,
    Second: {
      screen: DrawerContent,
    }
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

const RootStack = createDrawerNavigator(
  {
    Main: MainStack,
  },
  {
    initialRouteName: 'Main',
    contentComponent: DrawerContent,
    drawerWidth: (width * 0.8),
    drawerLockMode: 'locked-closed'
  }
);

const defaultGetStateForAction = RootStack.router.getStateForAction;

RootStack.router.getStateForAction = (action, state) => {
  if(state && action.type === 'Navigation/DRAWER_CLOSED') {
    StatusBar.setHidden(false, 'slide');
  }

  if(state && action.type === 'Navigation/OPEN_DRAWER') {
    StatusBar.setHidden(true, 'slide');
  }

  return defaultGetStateForAction(action, state);
};

export default class AppRouter extends Component {
  render() {
    return <RootStack />;
  }
}