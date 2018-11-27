import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addLocaleData } from 'react-intl';
// Constants
import en from 'react-intl/locale-data/en';
import tr from 'react-intl/locale-data/tr';

import { getUserData, getAuthStatus, getSettings } from '../../../realm/realm';
import { getUser } from '../../../providers/steem/dsteem';

// Actions
import { addOtherAccount, updateCurrentAccount } from '../../../redux/actions/accountAction';
import {
  activeApplication,
  login,
  openPinCodeModal,
  setLanguage,
  isNotificationOpen,
  setCurrency,
  setApi,
  isDarkTheme,
} from '../../../redux/actions/applicationActions';

// Container
import { ApplicationScreen } from '..';

addLocaleData([...en, ...tr]);
// symbol polyfills
global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');

// collection fn polyfills
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');

class ApplicationContainer extends Component {
  constructor() {
    super();
    this.state = {
      isRenderRequire: true,
    };
  }

  componentDidMount = () => {
    this._getUserData();
    this._getSettings();
  };

  componentWillReceiveProps(nextProps) {
    const { isDarkTheme, selectedLanguage } = this.props;

    if (isDarkTheme !== nextProps.isDarkTheme || selectedLanguage !== nextProps.selectedLanguage) {
      this.setState({ isRenderRequire: false }, () => this.setState({ isRenderRequire: true }));
    }
  }

  _getUserData = () => {
    const { dispatch } = this.props;
    getAuthStatus().then((res) => {
      if (res.isLoggedIn) {
        getUserData().then((response) => {
          if (response.length > 0) {
            response.forEach((accountData) => {
              dispatch(
                addOtherAccount({ username: accountData.username, avatar: accountData.avatar }),
              );
            });
            getUser(response[response.length - 1].username)
              .then((accountData) => {
                const realmObject = response[response.length - 1];
                accountData.realm_object = realmObject;

                dispatch(updateCurrentAccount(accountData));
                dispatch(activeApplication());
                dispatch(login());
                if (__DEV__ === false) {
                  dispatch(openPinCodeModal());
                }
              })
              .catch((err) => {
                alert(err);
              });
          }
        });
      } else {
        dispatch(activeApplication());
      }
    });
  };

  _getSettings = () => {
    const { dispatch } = this.props;

    getSettings().then((response) => {
      if (response) {
        response.isDarkTheme && dispatch(isDarkTheme(response.isDarkTheme));
        response.language && dispatch(setLanguage(response.language));
        response.currency && dispatch(setCurrency(response.currency));
        response.notification && dispatch(isNotificationOpen(response.currency));
        response.server && dispatch(setApi(response.currency));
      }
    });
  };

  render() {
    const { selectedLanguage } = this.props;
    const { isRenderRequire } = this.state;

    const locale = (navigator.languages && navigator.languages[0])
      || navigator.language
      || navigator.userLanguage
      || selectedLanguage;

    if (isRenderRequire) {
      return <ApplicationScreen locale={locale} {...this.props} />;
    }
    return null;
  }
}

const mapStateToProps = state => ({
  isDarkTheme: state.application.isDarkTheme,
  selectedLanguage: state.application.language,
});

export default connect(mapStateToProps)(ApplicationContainer);
