import React, { useCallback, useState } from 'react';
import { BackHandler } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';

import { Recipes } from '_src/scenes/recipes';
import Meals from '_src/scenes/meals';
import More from '_src/scenes/more';
import ShoppingList from '_src/scenes/shopping-list';
import { MyToast } from '_src/components';

const Tab = createBottomTabNavigator();
let timeOutHandler = 0;

const BottomTabs = () => {
  const [backCount, setBackCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setBackCount((val) => val + 1);
        clearTimeout(timeOutHandler);
        timeOutHandler = setTimeout(() => {
          setBackCount(0);
        }, 2000);
        return backCount < 1;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [backCount])
  );
  return (
    <>
      <MyToast
        isVisible={backCount > 0}
        message="For exit, please press back again!"
        duration={2000}
      />
      <Tab.Navigator tabBar={() => null} backBehavior="none">
        <Tab.Screen name="Recipes" component={Recipes} />
        <Tab.Screen name="Meals" component={Meals} />
        <Tab.Screen name="ShoppingList" component={ShoppingList} />
        <Tab.Screen name="More" component={More} />
      </Tab.Navigator>
    </>
  );
};

export default BottomTabs;
