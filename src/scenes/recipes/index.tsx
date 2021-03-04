import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';

import { BottomNavParamList } from '_navigations/router';
import { MyHOCBottomNav } from '_src/components';

interface IProps {
  navigation: BottomTabNavigationProp<BottomNavParamList, 'Recipes'>;
}

interface IState {}
export default class Dashboard extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <MyHOCBottomNav
        activeRoute="Recipes"
        navigation={this.props.navigation}
      ></MyHOCBottomNav>
    );
  }
}

const Styles = StyleSheet.create({});
