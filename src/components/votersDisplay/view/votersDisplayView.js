import React, { PureComponent } from 'react';
import { View, FlatList, Text } from 'react-native';

// Constants

// Components
import { UserListItem } from '../../basicUIElements';
// Styles
// eslint-disable-next-line
import styles from './votersDisplayStyles';

class VotersDisplayView extends PureComponent {
  /* Props
    * ------------------------------------------------
    *   @prop { type }    name                - Description....
    */

  // Component Functions
  _renderItem = (item, index) => {
    const { handleOnUserPress } = this.props;
    const reputation = `(${item.reputation})`;
    const value = `$ ${item.value}`;
    const percent = `${item.percent}%`;

    return (
      <UserListItem
        handleOnUserPress={handleOnUserPress}
        avatar={item.avatar}
        index={index}
        username={item.voter}
        reputation={reputation}
        description={item.created}
        isHasRightItem
        isRightColor={item.is_down_vote}
        rightText={value}
        subRightText={percent}
      />
    );
  };

  render() {
    const { votes } = this.props;

    return (
      <View style={styles.container}>
        {votes.length > 0 ? (
          <FlatList
            data={votes}
            keyExtractor={item => item.voter}
            removeClippedSubviews={false}
            renderItem={({ item, index }) => this._renderItem(item, index)}
          />
        ) : (
          <Text style={styles.text}>No user found.</Text>
        )}
      </View>
    );
  }
}

export default VotersDisplayView;
