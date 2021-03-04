import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { createStackNavigator } from '@react-navigation/stack';

import BottomNavigator from './bottom-navigator';

const Stack = createStackNavigator();

const AppStack = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 100);
  }, []);

  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Bottom" component={BottomNavigator} />
    </Stack.Navigator>
  );
};

export default AppStack;
