import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	Dimensions,
	InputAccessoryView
} from 'react-native';
import SInfo from 'react-native-sensitive-info';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { InitStackParamList } from '_navigations/router';
import analytics from '_services/analytics';
import { toEnglishDigit } from '_utils/formatters';
import {
	MyText,
	MyImage,
	MyTextInput,
	Row,
	MySafeView,
	MyKeyboardView,
	AlertBox,
	MySvgImage
} from '_components/index';
import { Colors } from '_styles/index';
import Api, { setAxiosToken } from '_api/index';
import publicApi from '_src/services/api/publicApi';
import { extractFaultMessage } from '_src/scenes/recipes/node_modules/_src/utils/shopp';
const { width, height } = Dimensions.get('window');

type Props = {
	navigation: StackNavigationProp<InitStackParamList, 'Verify'>;
	route: RouteProp<InitStackParamList, 'Verify'>;
};

type State = {
	mobile: string;
	// referralCode: string | null;
	loading: boolean;
	codeIsValid: boolean;
	counter: number;
	inputValue: string[];
};

class Verify extends Component<Props, State> {
	inputRef1 = React.createRef<TextInput>();
	inputRef2 = React.createRef<TextInput>();
	inputRef3 = React.createRef<TextInput>();
	inputRef4 = React.createRef<TextInput>();
	inputRef5 = React.createRef<TextInput>();
	alert = React.createRef<AlertBox>();
	timerHandler = 0;

	constructor(props: Props) {
		super(props);
		this.state = {
			counter: 60,
			mobile: '',
			// referralCode: null,
			inputValue: ['', '', '', '', ''],
			codeIsValid: true,
			loading: false
		};
	}

	componentDidMount() {
		const { route } = this.props;
		const mobile = route.params?.mobile || '';
		// const refCode = route.params?.refCode || null;
		this.setState({
			mobile
			// referralCode: refCode
		});
		setTimeout(() => {
			this.inputRef1.current?.focus();
			// this.inputRef1.current?.;
		}, 300);
		this.startCountDown();
	}

	startCountDown = () => {
		clearInterval(this.timerHandler);
		this.timerHandler = setInterval(() => {
			this.setState((prevState) => {
				if (prevState.counter > 1) {
					return {
						counter: prevState.counter - 1
					};
				} else {
					clearInterval(this.timerHandler);
					return { counter: 0 };
				}
			});
		}, 1000);
	};

	componentWillUnmount() {
		clearInterval(this.timerHandler);
	}

	checkVerifyCode = async () => {
		const code = toEnglishDigit(this.state.inputValue.join('')).toString();

		if (code != '') {
			const { mobile } = this.state;
			this.setState({ loading: true });
			publicApi.validateVerifyCode(mobile, code).then((response) => {
				if (response.status == 200) {
					const token = response.data.id_token;
					setAxiosToken(token);
					publicApi
						.getAccountInfo()
						.then((response) => {
							if (response.status !== 200) {
								this.alert.current?.show(
									extractFaultMessage(response)
								);
								return;
							}
							const { data } = response;
							const accountInfo = {
								activated: data.activated,
								createdDate: data.createdDate,
								extraData: data.extraData,
								id: data.id
							};
							SInfo.setItem(
								'accountInfo',
								JSON.stringify(accountInfo),
								{}
							);
							SInfo.getItem('devMode', {}).then((mode) => {
								const tokenKey =
									mode === 'DEVELOPMENT'
										? 'devUserToken'
										: 'userToken';
								SInfo.setItem(tokenKey, token, {});
								SInfo.setItem('mobile', mobile, {});
								this.props.navigation.replace('AppNavigator');
							});
						})
						.catch((e) => {
							console.log(e);
						});
				} else if (response.status == 400) {
					this.alert.current?.show(extractFaultMessage(response));
					this.setState({ codeIsValid: false });
				} else {
					this.alert.current?.show(
						extractFaultMessage(
							response,
							'خطا در برقراری ارتباط با سرور'
						)
					);
				}
				this.setState({ loading: false });
			});
		}
	};

	resentVerifyCode = () => {
		const { mobile } = this.state;
		publicApi.getVerifyCode(mobile).then((response) => {
			if (response.status == 200) {
				this.setState(
					{
						counter: 62
					},
					this.startCountDown
				);
			} else if (response.status == 400) {
				this.alert.current?.show(extractFaultMessage(response));
			} else {
				this.alert.current?.show(
					extractFaultMessage(
						response,
						'خطا در برقراری ارتباط با سرور'
					)
				);
			}
			this.setState({ loading: false });
		});
	};

	onInputChange = (index: number, value: string) => {
		this.setState(
			(prevState) => {
				const newInputValue = prevState.inputValue;
				newInputValue[index - 1] = value;
				return {
					inputValue: newInputValue
				};
			},
			() => {
				if (value != '') {
					switch (index) {
						case 1:
							this.inputRef2.current?.focus();
							break;

						case 2:
							this.inputRef3.current?.focus();
							break;

						case 3:
							this.inputRef4.current?.focus();
							break;

						case 4:
							this.inputRef5.current?.focus();
							break;
						case 5:
							this.checkVerifyCode();
							break;

						default:
							break;
					}
				}
			}
		);
	};

	render() {
		const {
			mobile,
			referralCode,
			codeIsValid,
			loading,
			counter
		} = this.state;
		const { navigation } = this.props;
		return (
			<MySafeView>
				<MyKeyboardView behavior="padding" style={styles.container}>
					<Row style={styles.BgContainer}>
						<MySvgImage
							style={styles.BgImage}
							source="PatternLoginBg"
							width="100%"
							height={350}
						/>
					</Row>
					<Row style={styles.BgCircles}>
						<MySvgImage
							source="LoginCircles"
							width={330}
							height={250}
						/>
					</Row>
					<View style={styles.topSpacer} />
					<View style={styles.box}>
						<View style={styles.logo}>
							<MyImage
								source="ShoppMarketLogo"
								width={85}
								height={95}
							/>
							{/* <MyImage
								source="ShoppLogo"
								width={80}
								height={80}
							/> */}
							<MyText weight="800" style={styles.topText}>
								ارسال کد به شماره
							</MyText>
							<Row style={styles.topRow}>
								<MyText weight="400" style={styles.topText}>
									{mobile}
								</MyText>
								<TouchableOpacity
									onPress={() =>
										navigation.replace('Login', {
											mobile,
											refCode: referralCode
										})
									}
									style={styles.editBtn}
								>
									<MyText
										weight="light"
										style={styles.editText}
									>
										ویرایش شماره
									</MyText>
								</TouchableOpacity>
							</Row>
						</View>
						{/*
						<MyTextInput
							autoFocus
							style={styles.input}
							maxLength={6}
							keyboardType="decimal-pad"
							selectTextOnFocus
							returnKeyType="done"
							onChangeText={(val) => {
								this.setState({ codeIsValid: true });
								const engNum = toEnglishDigit(val)
									.toString()
									.replace(/\D/g, '');
								if (engNum?.length == 6) {
									this.checkVerifyCode2(engNum);
								}
							}}
							onKeyPress={({ nativeEvent: { key } }) => {
								if (key == 'Enter') {
									this.inputRef2.current?.focus();
								}
							}}
							blurOnSubmit={false}
						/> */}

						<Row style={[styles.inputRow]}>
							<MyTextInput
								autoFocus
								boxStyle={[
									styles.inputBox,
									codeIsValid
										? null
										: { borderColor: Colors.ALERT }
								]}
								style={styles.input}
								ref={this.inputRef1}
								maxLength={4}
								keyboardType="decimal-pad"
								selectTextOnFocus
								returnKeyType="done"
								onChangeText={(val) => {
									this.setState({ codeIsValid: true });
									const engNum = toEnglishDigit(val)
										.toString()
										.replace(/\D/g, '');
									if (engNum.length == 4) {
										this.onInputChange(
											1,
											engNum.substr(0, 1)
										);
										this.onInputChange(
											2,
											engNum.substr(1, 1)
										);
										this.onInputChange(
											3,
											engNum.substr(2, 1)
										);
										this.onInputChange(
											4,
											engNum.substr(3, 1)
										);
									} else {
										this.onInputChange(
											1,
											engNum.substr(0, 1)
										);
									}
								}}
								onKeyPress={({ nativeEvent: { key } }) => {
									if (key == 'Enter') {
										this.inputRef2.current?.focus();
									}
								}}
								value={this.state.inputValue[0]}
								onSubmitEditing={() =>
									this.inputRef2.current?.focus()
								}
								blurOnSubmit={false}
							/>
							<MyTextInput
								boxStyle={[
									styles.inputBox,
									codeIsValid
										? null
										: { borderColor: Colors.ALERT }
								]}
								style={styles.input}
								ref={this.inputRef2}
								maxLength={1}
								keyboardType="decimal-pad"
								selectTextOnFocus
								returnKeyType="done"
								onChangeText={(val) => {
									this.setState({ codeIsValid: true });
									const engNum = toEnglishDigit(val)
										.toString()
										.replace(/\D/g, '');
									this.onInputChange(2, engNum);
								}}
								value={this.state.inputValue[1]}
								onKeyPress={({ nativeEvent: { key } }) => {
									if (key == 'Backspace') {
										this.inputRef1.current?.focus();
									} else if (key == 'Enter') {
										this.inputRef3.current?.focus();
									}
								}}
								onSubmitEditing={() =>
									this.inputRef3.current?.focus()
								}
								blurOnSubmit={false}
							/>
							<MyTextInput
								boxStyle={[
									styles.inputBox,
									codeIsValid
										? null
										: { borderColor: Colors.ALERT }
								]}
								style={styles.input}
								ref={this.inputRef3}
								maxLength={1}
								keyboardType="decimal-pad"
								selectTextOnFocus
								returnKeyType="done"
								onChangeText={(val) => {
									this.setState({ codeIsValid: true });
									const engNum = toEnglishDigit(val)
										.toString()
										.replace(/\D/g, '');
									this.onInputChange(3, engNum);
								}}
								value={this.state.inputValue[2]}
								onKeyPress={({ nativeEvent: { key } }) => {
									if (key == 'Backspace') {
										this.inputRef2.current?.focus();
									} else if (key == 'Enter') {
										this.inputRef4.current?.focus();
									}
								}}
								onSubmitEditing={() =>
									this.inputRef4.current?.focus()
								}
								blurOnSubmit={false}
							/>
							<MyTextInput
								boxStyle={[
									styles.inputBox,
									codeIsValid
										? null
										: { borderColor: Colors.ALERT }
								]}
								style={styles.input}
								ref={this.inputRef4}
								maxLength={1}
								selectTextOnFocus
								keyboardType="decimal-pad"
								textContentType="oneTimeCode"
								returnKeyType="done"
								onChangeText={(val) => {
									this.setState({ codeIsValid: true });
									const engNum = toEnglishDigit(val)
										.toString()
										.replace(/\D/g, '');
									this.onInputChange(4, engNum);
								}}
								onKeyPress={({ nativeEvent: { key } }) => {
									if (key == 'Backspace') {
										this.inputRef3.current?.focus();
									}
								}}
								value={this.state.inputValue[3]}
								blurOnSubmit={false}
							/>
							<MyTextInput
								boxStyle={[
									styles.inputBox,
									codeIsValid
										? null
										: { borderColor: Colors.ALERT }
								]}
								style={styles.input}
								ref={this.inputRef5}
								maxLength={1}
								selectTextOnFocus
								keyboardType="decimal-pad"
								textContentType="oneTimeCode"
								returnKeyType="done"
								onChangeText={(val) => {
									this.setState({ codeIsValid: true });
									const engNum = toEnglishDigit(val)
										.toString()
										.replace(/\D/g, '');
									this.onInputChange(5, engNum);
								}}
								onKeyPress={({ nativeEvent: { key } }) => {
									if (key == 'Backspace') {
										this.inputRef4.current?.focus();
									}
								}}
								value={this.state.inputValue[4]}
								blurOnSubmit={false}
							/>
						</Row>
					</View>
					<Row style={styles.timerRow}>
						{counter > 60 && <MyText>کد فعالسازی ارسال شد</MyText>}
						{counter > 0 && counter <= 60 && (
							<TouchableOpacity
								style={styles.resendBtn}
								onPress={this.resentVerifyCode}
							>
								<MyText weight="light" color="#fff">
									{`ارسال مجدد ${counter
										.toString()
										.padStart(2, '0')} : 00`}
								</MyText>
							</TouchableOpacity>
						)}
						{counter < 1 && (
							<TouchableOpacity
								style={styles.resendBtn}
								onPress={this.resentVerifyCode}
							>
								<MyText color="#fff">
									ارسال مجدد کد فعالسازی
								</MyText>
							</TouchableOpacity>
						)}
					</Row>
				</MyKeyboardView>
				<AlertBox ref={this.alert} />
			</MySafeView>
		);
	}
}

export default Verify;

const styles = StyleSheet.create({
	BgContainer: {
		width: '100%',
		height: 300,
		position: 'absolute',
		top: 0,
		backgroundColor: '#fff',
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
	container: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: '#fff'
	},
	box: {
		transform: [{ translateY: 20 }]
	},
	topSpacer: {
		flex: 1
	},
	inputRow: {
		justifyContent: 'center',
		flexDirection: 'row'
	},
	inputBox: {
		width: 50,
		marginHorizontal: 10
	},
	input: {
		textAlign: 'center',
		height: 50
	},
	refCodeinput: {
		width: '35%',
		textAlign: 'center'
	},
	logo: {
		alignItems: 'center'
	},
	topRow: {
		alignItems: 'center',
		marginBottom: 40
	},
	topText: {
		fontSize: 18,
		marginTop: 5
	},
	bottomText: {
		textAlign: 'center',
		marginBottom: 30
	},
	timerRow: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-end',
		marginTop: 20
	},
	btnsRow: {
		justifyContent: 'center',
		marginTop: 20
	},
	editBtn: {
		paddingHorizontal: 10,
		paddingVertical: 8
	},
	resendBtn: {
		height: 30,
		borderRadius: 15,
		justifyContent: 'center',
		backgroundColor: Colors.ORANGE,
		marginHorizontal: 10,
		paddingHorizontal: 15,
		paddingVertical: 2
	},
	editText: {
		color: '#0079FB'
	}
});
