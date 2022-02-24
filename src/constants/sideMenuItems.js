import { default as ROUTES } from './routeNames';

const authMenuItems = [
  {
    name: 'Profile',
    route: ROUTES.TABBAR.PROFILE,
    icon: 'user',
    id: 'profile',
  },
  {
    name: 'Bookmarks',
    route: ROUTES.SCREENS.BOOKMARKS,
    icon: 'star',
    id: 'bookmarks',
  },
  {
    name: 'Drafts',
    route: ROUTES.SCREENS.DRAFTS,
    icon: 'docs',
    id: 'drafts',
  },
  {
    name: 'Communities',
    route: ROUTES.SCREENS.COMMUNITIES,
    icon: 'people',
    id: 'communities',
  },
  {
    name: 'QR Scan',
    route: ROUTES.SCREENS.QR,
    icon: 'qrcode-scan',
    iconType: 'MaterialCommunityIcons',
    id: 'qr',
  },
  {
    name: 'Refer $ Earn',
    route: ROUTES.SCREENS.REFER,
    icon: 'share',
    id: 'refer',
  },
  {
    name: 'Settings',
    route: ROUTES.SCREENS.SETTINGS,
    icon: 'settings',
    id: 'settings',
  },
  {
    name: 'Logout',
    route: '',
    icon: 'power',
    id: 'logout',
  },
];

const noAuthMenuItems = [
  {
    name: 'Add Account',
    route: ROUTES.SCREENS.LOGIN,
    icon: 'user-follow',
    id: 'add_account',
  },
  {
    name: 'Settings',
    route: ROUTES.SCREENS.SETTINGS,
    icon: 'settings',
    id: 'settings',
  },
];

export default {
  AUTH_MENU_ITEMS: authMenuItems,
  NO_AUTH_MENU_ITEMS: noAuthMenuItems,
};
