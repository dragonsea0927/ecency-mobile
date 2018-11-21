import {
  ACTIVE_APPLICATION,
  CLOSE_PIN_CODE_MODAL,
  LOGIN,
  LOGOUT,
  OPEN_PIN_CODE_MODAL,
  SET_API,
  SET_CURRENCY,
  SET_LANGUAGE,
  IS_NOTIFICATION_OPEN,
  IS_DARK_THEME,
} from '../constants/constants';

export const login = () => ({
  type: LOGIN,
});

export const logout = () => ({
  type: LOGOUT,
});

export const openPinCodeModal = () => ({
  type: OPEN_PIN_CODE_MODAL,
});

export const closePinCodeModal = () => ({
  type: CLOSE_PIN_CODE_MODAL,
});

export const activeApplication = () => ({
  type: ACTIVE_APPLICATION,
});

// Settings actions
export const setLanguage = payload => ({
  payload,
  type: SET_LANGUAGE,
});

export const setCurrency = payload => ({
  payload,
  type: SET_CURRENCY,
});

export const setApi = payload => ({
  payload,
  type: SET_API,
});

export const isNotificationOpen = payload => ({
  payload,
  type: IS_NOTIFICATION_OPEN,
});

export const isDarkTheme = payload => ({
  payload,
  type: IS_DARK_THEME,
});
