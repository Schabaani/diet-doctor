import React, { useState, useRef, useEffect } from 'react';
import { Linking, Platform } from 'react-native';
import SInfo from 'react-native-sensitive-info';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import {
  NavigationContainer,
  NavigationContainerRef
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '_scenes/login';
import AppNavigator from './app-navigator';

const navigationRef = React.createRef<NavigationContainerRef>();
const Stack = createStackNavigator();

export function navigate(name: string, params?: { [k: string]: any }) {
  navigationRef.current?.navigate(name, params);
}

function AppNavigation() {
  const routeNameRef = useRef<string | undefined>();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          if (__DEV__) {
            console.log('currentRouteName', currentRouteName);
          }
        }

        routeNameRef.current = currentRouteName;
      }}
    >
      <Stack.Navigator headerMode="none">
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        <Stack.Screen name="AppNavigator" component={AppNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
