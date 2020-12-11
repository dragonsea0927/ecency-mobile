import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import userAvatar, { UserAvatar } from '../../userAvatar';

import styles from './communityCardStyles';

const CommunityCardView = ({ community, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.communityCard, style]} onPress={() => onPress(community)}>
      <UserAvatar username={community.name} noAction />
      <Text style={styles.text}>{community.title}</Text>
    </TouchableOpacity>
  );
};

export default CommunityCardView;
