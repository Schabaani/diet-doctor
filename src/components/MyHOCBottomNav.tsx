import React from 'react';
import { BottomNavParamList } from '_navigations/router';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import FooterMenu from './FooterMenu';
import MySafeView from './MySafeView';

interface IProps {
  name?: string;
  navigation: BottomTabNavigationProp<BottomNavParamList>;
  activeRoute: keyof BottomNavParamList;
  showFooter?: boolean;
}

export default class MyHOCBottomNav extends React.PureComponent<IProps> {
  render() {
    const { showFooter = true } = this.props;
    return (
      <MySafeView style={Styles.container}>
        <View style={{ flex: 1 }}>{this.props.children}</View>
        {showFooter && (
          <FooterMenu
            navigation={this.props.navigation}
            activeRoute={this.props.activeRoute}
          />
        )}
      </MySafeView>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
