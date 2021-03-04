import { Dimensions, Platform, StatusBar } from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height: W_HEIGHT, width: W_WIDTH } = Dimensions.get('window');

let isIX = false;

if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
	isIX =
		(W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) ||
		(W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT);
}
export const isIPhoneX = isIX;
export function getStatusBarHeight() {
	return Platform.select({
		ios: isIPhoneX ? 44 : 20,
		android: StatusBar.currentHeight,
		default: 0
	});
}

export const statusBarHeight = getStatusBarHeight();
export const screenTopPadding = Platform.OS == 'android' ? 0 : statusBarHeight;
export const screenHeight =
	Platform.OS == 'android' ? W_HEIGHT - statusBarHeight : W_HEIGHT;
export const screenWidth = W_WIDTH;
