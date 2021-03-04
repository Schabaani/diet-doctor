import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Keyboard } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { InitStackParamList } from '_navigations/router';
import Api from '_api/index';
import {
  MyText,
  MyImage,
  MyTextInput,
  Row,
  MyButton,
  MySafeView,
  MyKeyboardView,
  MySvgImage,
  AlertBox
} from '_components/index';
import publicApi from '_src/services/api/publicApi';
import { Colors } from '_styles/index';
import { toEnglishDigit } from '_src/utils/formatters';
import { isValidMobileNumber, toRegularMobileNumber } from '_src/utils/mobile';
import { extractFaultMessage } from '_src/scenes/recipes/node_modules/_src/utils/shopp';

const { width } = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<InitStackParamList, 'Login'>;
  route: RouteProp<InitStackParamList, 'Login'>;
};

type State = {
  mobile: string;
  referralCode: string;
  // isReferralCodeValid: boolean;
  loading: boolean;
  mobileIsValid: boolean;
  // isTermsModalVisible: boolean;
  // isTermsModalMount: boolean;
  // isRefCodeModalVisible: boolean;
  // isRefCodeModalMount: boolean;
};
export default class Login extends Component<Props, State> {
  alert = React.createRef<AlertBox>();
  modalAlert = React.createRef<AlertBox>();
  constructor(props: Props) {
    super(props);
    this.state = {
      mobile: '',
      referralCode: '',
      // isReferralCodeValid: false,
      mobileIsValid: true,
      loading: false
      // isTermsModalVisible: false,
      // isTermsModalMount: false,
      // isRefCodeModalVisible: false
      // isRefCodeModalMount: false
    };
  }

  componentDidMount() {
    const { mobile, refCode } = this.props.route.params || {};
    this.setState({
      mobile: mobile || '',
      referralCode: refCode || ''
    });
    SplashScreen.hide();
  }

  onPressLogin = () => {
    const { mobile, referralCode } = this.state;
    const { navigation } = this.props;
    if (!isValidMobileNumber(mobile)) {
      this.setState({ mobileIsValid: false });
    } else {
      this.setState({ mobileIsValid: true, loading: true });
      publicApi
        .getVerifyCode(toRegularMobileNumber(mobile))
        .then((response) => {
          if (response.status == 200) {
            Keyboard.dismiss();
            setTimeout(() => {
              navigation.replace('Verify', {
                mobile
              });
            }, 1);
          } else {
            this.alert.current?.show(
              extractFaultMessage(response, 'خطا در دریافت کد')
            );
          }
          this.setState({ loading: false });
        });
    }
  };

  verfiyInvitationCode = (referralCode: string) => {
    if (referralCode == '') return;
    this.setState({ loading: true });
    Api.User.verfiyInvitationCode(referralCode).then((response) => {
      if (response.status == 200 && response.data === true) {
        this.setState({
          referralCode
          // isReferralCodeValid: true,
          // isRefCodeModalVisible: false
        });
      } else if (response.status == 200) {
        // this.setState({ isReferralCodeValid: false });
        this.modalAlert.current?.show('کد معرف نامعتبر است');
      } else if (response.status == 422) {
        this.modalAlert.current?.show(response.data.persianErrorMessage);
      } else {
        this.modalAlert.current?.show('خطا در برقراری ارتباط با سرور');
      }
      this.setState({ loading: false });
    });
  };

  render() {
    const { mobile, mobileIsValid, loading } = this.state;
    return (
      <MySafeView>
        <MyKeyboardView behavior="padding" style={styles.container}>
          <Row style={styles.BgContainer}>
            <MySvgImage
              source="PatternLoginBg"
              width="100%"
              height={350}
              style={styles.BgImage}
            />
          </Row>
          <Row style={styles.BgCircles}>
            <MySvgImage source="LoginCircles" width={330} height={250} />
          </Row>
          <View style={styles.topSpacer} />
          <View style={styles.box}>
            <View style={styles.logo}>
              <MyImage source="ShoppMarketLogo" width={85} height={95} />
              <MyText weight="800" style={styles.topText}>
                اپلیکیشن شاپ بیز
              </MyText>
              <MyText weight="400" style={styles.bottomText}>
                برای ورود٬ شماره موبایل خود را وارد نمایید
              </MyText>
              <MyTextInput
                autoAlign
                clearBtn
                boxStyle={
                  mobileIsValid ? undefined : { borderColor: Colors.ALERT }
                }
                label="شماره موبایل"
                labelStyle={mobileIsValid ? undefined : { color: Colors.ALERT }}
                placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                style={styles.input}
                maxLength={14}
                value={mobile}
                onChangeText={(val) => {
                  const engNum = toEnglishDigit(val)
                    .toString()
                    .replace(/[^\d]/g, '');
                  this.setState({ mobile: engNum });
                }}
                keyboardType="decimal-pad"
              />
              <Row style={styles.btnsRow}>
                <MyButton
                  text="ارسال کد ورود"
                  loading={loading}
                  onPress={this.onPressLogin}
                  width="100%"
                />
              </Row>
            </View>
          </View>
          <Row style={styles.timerRow} />
        </MyKeyboardView>

        <AlertBox ref={this.alert} />
      </MySafeView>
    );
  }
}

const styles = StyleSheet.create({
  BgContainer: {
    width: '100%',
    height: 300,
    position: 'absolute',
    top: 0,
    backgroundColor: '#ffff',
    overflow: 'hidden',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50
  },
  BgImage: {
    opacity: 0.7
  },
  BgCircles: {
    position: 'absolute',
    top: 0,
    zIndex: 10000,
    width: '100%',
    justifyContent: 'center'
  },
  topSpacer: {
    flex: 1
  },
  box: {
    transform: [{ translateY: 80 }]
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start'
  },
  input: {
    paddingHorizontal: 10
  },
  refCodeBtn: {
    width: '35%',
    backgroundColor: '#fff',
    borderColor: '#c0cfde',
    borderWidth: 1
  },
  refCodeinputBox: {
    width: '100%',
    textAlign: 'center',
    marginBottom: 20
  },
  refCodeinput: {
    textAlign: 'center'
  },
  logo: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topText: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 5,
    color: '#202746'
  },
  bottomText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 15,

    color: '#394258'
  },
  btnsRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40
  },
  termsRow: {
    justifyContent: 'center',
    marginTop: 20
  },
  showTermsBtn: {
    paddingHorizontal: 20,
    paddingBottom: 8
  },
  termsText: {
    color: Colors.BLUE
  },
  modal: {
    padding: 0,
    margin: 0
  },
  modalCoantainer: {
    width: width * 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  refModal: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 0,
    margin: 0
  },
  refModalCoantainer: {
    width: width * 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 20
  },
  narrowBar: {
    height: 4,
    width: '20%',
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginBottom: 10
  },
  timerRow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 20
  }
});
