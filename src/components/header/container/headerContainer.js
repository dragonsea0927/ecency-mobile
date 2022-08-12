import React from 'react';
import { withNavigation } from 'react-navigation';
import get from 'lodash/get';
import has from 'lodash/has';

// Component
import { useDispatch } from 'react-redux';
import HeaderView from '../view/headerView';

import { AccountContainer, ThemeContainer } from '../../../containers';
import { parseReputation } from '../../../utils/user';
import { toggleQRModal } from '../../../redux/actions/uiAction';

const HeaderContainer = ({
  selectedUser,
  isReverse,
  navigation,
  handleOnBackPress,
  hideUser,
  enableViewModeToggle,
}) => {
  const dispatch = useDispatch();

  const _handleOpenDrawer = () => {
    if (has(navigation, 'openDrawer') && typeof get(navigation, 'openDrawer') === 'function') {
      navigation.openDrawer();
    }
  };

  const _handleOnPressBackButton = () => {
    if (handleOnBackPress) {
      handleOnBackPress();
    }

    navigation.goBack();
  };

  const _handleQRPress = () => {
    dispatch(toggleQRModal(true));
  };

  return (
    <ThemeContainer>
      {({ isDarkTheme }) => (
        <AccountContainer>
          {({ currentAccount, isLoggedIn, isLoginDone }) => {
            const _user = isReverse && selectedUser ? selectedUser : currentAccount;

            const reputation = parseReputation(get(_user, 'reputation'));
            return (
              <HeaderView
                displayName={get(_user, 'display_name')}
                handleOnPressBackButton={_handleOnPressBackButton}
                handleOnQRPress={_handleQRPress}
                handleOpenDrawer={_handleOpenDrawer}
                isDarkTheme={isDarkTheme}
                isLoggedIn={isLoggedIn}
                isLoginDone={isLoginDone}
                isReverse={isReverse}
                reputation={reputation}
                username={get(_user, 'name')}
                hideUser={hideUser}
                enableViewModeToggle={enableViewModeToggle}
              />
            );
          }}
        </AccountContainer>
      )}
    </ThemeContainer>
  );
};

export default withNavigation(HeaderContainer);
