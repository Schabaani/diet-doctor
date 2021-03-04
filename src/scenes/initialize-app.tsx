import React, { Component } from 'react';
import { Platform, Dimensions, StyleSheet, Animated } from 'react-native';
import SInfo from 'react-native-sensitive-info';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { InitStackParamList } from '_navigations/router';
import { MySafeView } from '_src/components';

const { width } = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<InitStackParamList, 'InitApp'>;
  route: RouteProp<InitStackParamList, 'InitApp'>;
};

type State = {};

const duration = Math.floor(2 + Math.random() * 3) * 1000;

class InitApp extends Component<Props, State> {
  private animationFunc: Animated.CompositeAnimation;
  constructor(props: Props) {
    super(props);
    this.state = {
      isNetErrorModalVisible: false,
      isNetErrorModalMount: false,
      updateInfo: {},
      iosUpdate: false,
      iosForceUpdate: false,
      androidUpdate: false,
      androidForceUpdate: false,
      isConfigReady: false,
      isReadyToGo: false
    };
    this.animationFunc = Animated.timing(this.transX, {
      toValue: -width * 0.1,
      useNativeDriver: true
    });
  }

  transX = new Animated.Value(-width * 0.1);
  transY = new Animated.Value(-width * 0.1);

  componentDidMount() {
    this.moveBg();
    SplashScreen.hide();

    setTimeout(() => {
      this.setState({
        isReadyToGo: true
      });
    }, 1000);

    const devMode =
      this.props.route.params?.devMode === 'DEVELOPMENT'
        ? 'DEVELOPMENT'
        : 'PRODUCTION';
    SInfo.setItem('devMode', devMode, {});
    if (__DEV__) {
      console.log('devMode', 'DEVELOPMENT');
    }
  }

  moveBg = () => {
    this.animationFunc.stop();
    this.animationFunc = Animated.parallel([
      Animated.timing(this.transX, {
        toValue: Math.floor(Math.random() * 0.1 * width * -1),
        duration,
        useNativeDriver: true
      }),
      Animated.timing(this.transY, {
        toValue: Math.floor(Math.random() * 0.1 * width * -1),
        duration,
        useNativeDriver: true
      })
    ]);
    this.animationFunc.start(() => this.moveBg());
  };

  render() {
    return (
      <MySafeView
        headerColor={'#fff'}
        barStyle="dark-content"
        style={styles.safeView}
      ></MySafeView>
    );
  }
}

export default connect(null, null)(InitApp);

const styles = StyleSheet.create({
  safeView: { backgroundColor: '#fff', alignItems: 'center' },
  container: {
    width: width * 1,
    alignItems: 'center',
    paddingTop: 15
  },
  btn: {
    width: '60%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 15
  },
  btnInner: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e4e8f1',
    borderRadius: 10
  },
  updateRow: {
    width: '60%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    flexDirection: Platform.OS == 'ios' ? 'row-reverse' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  storeIcon: {
    marginLeft: 10
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center'
  },
  animatedBg: {
    position: 'absolute'
  },
  transparentBg: {
    backgroundColor: '#ffffff50',
    borderRadius: 15,
    padding: 5,
    marginBottom: 10
  },
  logo: {
    backgroundColor: '#fff',
    borderRadius: 15
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    paddingBottom: 5
  },
  indicator: {
    paddingTop: 30
  },
  version: {
    position: 'absolute',
    bottom: 30,
    paddingTop: 40
  }
});
