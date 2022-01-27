import React from 'react';
import { View, FlatList, Text } from "react-native"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { UserAvatar } from '../..';
import styles from './markdownEditorStyles';

interface Props {
    usernames:Array<string>;
    onUserSelect:(username:string)=>void;
}

export const UsersBar = ({usernames, onUserSelect}:Props) => {

    const _renderItem = ({item}:{item:string}) => {
        const username = item;
        return (
            <TouchableOpacity onPress={()=>{onUserSelect(username)}}>
                <View style={styles.userBubble}>
                    <UserAvatar username={username}/>
                    <Text style={styles.userBubbleText}>{username}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
      <View style={styles.searchAccountsContainer}>
        <FlatList 
              horizontal={true}
              data={usernames}
              showsHorizontalScrollIndicator={false}
              renderItem={_renderItem}
            />
      </View>
    )
  }
