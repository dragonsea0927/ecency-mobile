import React, { PureComponent, Fragment } from 'react';
import { injectIntl } from 'react-intl';
import get from 'lodash/get';

import { ProfileEditContainer } from '../../../containers';

import AvatarHeader from '../../../components/avatarHeader/avatarHeaderView';
import ProfileEditForm from '../../../components/profileEditForm/profileEditFormView';

class ProfileEditScreen extends PureComponent {
  /* Props
   * ------------------------------------------------
   *   @prop { type }    name                - Description....
   */

  constructor(props) {
    super(props);
    this.state = {};
  }

  // Component Life Cycles

  // Component Functions

  render() {
    return (
      <ProfileEditContainer>
        {({ currentAccount }) => (
          <Fragment>
            <AvatarHeader
              username={get(currentAccount, 'name')}
              name={get(currentAccount, 'about.profile.name')}
              reputation={get(currentAccount, 'reputation')}
              avatarUrl={null}
            />
            <ProfileEditForm
              about={get(currentAccount, 'about.profile.about')}
              name={get(currentAccount, 'about.profile.name')}
              location="location"
              website="website"
              coverUrl={get(currentAccount, 'reputation')}
              avatarUrl={null}
            />
          </Fragment>
        )}
      </ProfileEditContainer>
    );
  }
}

export default injectIntl(ProfileEditScreen);
