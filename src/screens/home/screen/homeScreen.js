import React, { PureComponent, Fragment } from 'react';
import { View } from 'react-native';
import ScrollableTabView from '@esteemapp/react-native-scrollable-tab-view';

// STEEM

// Components
import { TabBar } from '../../../components/tabBar';
import { Posts } from '../../../components/posts';
import { Header } from '../../../components/header';
// Styles
import styles from './homeStyles';

export default class HomeScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'search') {
      // Navigation.showOverlay({
      //   component: {
      //     name: 'navigation.eSteem.Search',
      //   },
      //   options: {
      //     overlay: {
      //       interceptTouchOutside: true,
      //     },
      //   },
      // });
    }
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  render() {
    const { componentId, isLoggedIn, currentAccount } = this.props;
    const _filterOptions = ['NEW POSTS', 'VOTES', 'REPLIES', 'MENTIONS', 'FOLLOWS', 'REBLOGS'];

    return (
      <Fragment>
        <Header
          userName={currentAccount && currentAccount.name}
          reputation={currentAccount && currentAccount.reputation}
          avatar={
            currentAccount && currentAccount.about && currentAccount.about.profile.profile_image
          }
        />
        <View style={styles.root} key="overlay">
          <ScrollableTabView
            style={styles.tabView}
            renderTabBar={() => (
              <TabBar
                style={styles.tabbar}
                tabUnderlineDefaultWidth={80}
                tabUnderlineScaleX={2}
                activeColor="#357ce6"
                inactiveColor="#222"
                tabBarPosition="overlayTop"
              />
            )}
          >
            {isLoggedIn && (
              <View tabLabel="Feed" style={styles.tabbarItem}>
                <Posts
                  filterOptions={_filterOptions}
                  isLoginMust
                  getFor="feed"
                  tag={currentAccount.name}
                  user={currentAccount}
                  isLoggedIn={isLoggedIn}
                  componentId={componentId}
                />
              </View>
            )}
            <View tabLabel="Hot" style={styles.tabbarItem}>
              <Posts
                filterOptions={_filterOptions}
                getFor="hot"
                user={currentAccount}
                isLoggedIn={isLoggedIn}
                componentId={componentId}
              />
            </View>
            <View tabLabel="Popular" style={styles.tabbarItem}>
              <Posts
                filterOptions={_filterOptions}
                getFor="trending"
                user={currentAccount}
                isLoggedIn={isLoggedIn}
                componentId={componentId}
              />
            </View>
          </ScrollableTabView>
          <View style={styles.buttonContainer} />
        </View>
      </Fragment>
    );
  }
}
