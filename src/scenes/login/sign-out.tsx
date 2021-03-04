import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import SInfo from 'react-native-sensitive-info';
import { Colors } from '_styles/index';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { InitStackParamList } from '_navigations/router';
import { MySafeView } from '_src/components';
import { setAxiosToken } from '_api/index';

type Props = {
	navigation: StackNavigationProp<InitStackParamList, 'SignOut'>;
	route: RouteProp<InitStackParamList, 'SignOut'>;
};

class SignOut extends Component<Props> {
	componentDidMount() {
		const { route } = this.props;
		SInfo.getItem('devMode', {}).then((devMode) => {
			const tokenKey =
				devMode === 'DEVELOPMENT' ? 'devUserToken' : 'userToken';
			SInfo.setItem(tokenKey, '', {});
			setAxiosToken('');
			if (route.params?.forgetPassword === true) {
				SInfo.setItem(
					'app-lock-info',
					JSON.stringify({
						pin: '',
						isActivePin: false,
						isEnabledFaceID: false,
						isEnabledTouchID: false
					}),
					{}
				);
			}
			this.props.navigation.replace('Login', {});
		});
	}

	render() {
		return (
			<MySafeView>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<ActivityIndicator size="large" color={Colors.PRIMARY} />
				</View>
			</MySafeView>
		);
	}
}

export default SignOut;
