declare module 'moment/src/locale/fa';
declare module 'react-native-persian-calendar-picker';

declare module '*.svg' {
	import { SvgProps } from 'react-native-svg';

	const content: React.FC<
		SvgProps & {
			fillSecond?: string;
		}
	>;
	export default content;
}

declare module '*.png' {
	import { ImageProps } from 'react-native';

	const content: ImageProps;
	export default content;
}
