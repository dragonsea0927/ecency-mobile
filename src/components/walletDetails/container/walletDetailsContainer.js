import React, { PureComponent } from 'react';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

// Constants
import ROUTES from '../../../constants/routeNames';

import { openPinCodeModal } from '../../../redux/actions/applicationActions';

// Component
import WalletDetailsView from '../view/walletDetailsView';

/**
 *            Props Name        Description                                     Value
 * @props --> intl              Function for language support                   function
 * @props --> walletData        User wallet data                                object
 *
 */

class WalletContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Component Life Cycle Functions

  // Component Functions
  _navigate = () => {
    const { dispatch, setPinCodeState, navigation } = this.props;

    navigation.navigate(ROUTES.SCREENS.TRANSFER, {
      transferType: 'transferToSaving',
      fundType: 'STEEM',
    });

    // setPinCodeState({ navigateTo: ROUTES.SCREENS.TRANSFER, navigateParams: {transferType: 'sbd'} });
    // dispatch(openPinCodeModal());
  };

  render() {
    const { intl, walletData } = this.props;

    return <WalletDetailsView intl={intl} walletData={walletData} navigate={this._navigate} />;
  }
}

export default connect()(withNavigation(WalletContainer));
