import { SET_USER, SET_MOBILE, TUserState } from '_redux/reducers/user';

export const setUserMobile = (mobile: string) => {
	return { type: SET_MOBILE, payload: mobile };
};

export const setUser = (user: TUserState) => {
	return { type: SET_USER, payload: user };
};
