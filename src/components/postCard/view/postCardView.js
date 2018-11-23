import React, { Component } from 'react';
import {
  Image, TouchableOpacity, Text, View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { PostHeaderDescription } from '../../postElements';
import { DropdownButton } from '../../dropdownButton';
import { Icon } from '../../icon';
import { IconButton } from '../../iconButton';
import { LineBreak } from '../../basicUIElements'

// STEEM
import { Upvote } from '../../upvote';
// Styles
import styles from './postCardStyles';

class PostCard extends Component {
  /* Props
    * ------------------------------------------------
    *   @prop { string }     description       - Description texts.
    *   @prop { string }     iconName          - For icon render name.
    *
    */
  constructor(props) {
    super(props);

    this.state = {};
  }

  // Component Lifecycle Functions

  // Component Functions

  _handleOnUserPress = () => {
    const { handleOnUserPress, content, user } = this.props;

    if (handleOnUserPress && content && content.author !== user.name) {
      handleOnUserPress(content.author, content.author);
    }
  };

  _handleOnContentPress = () => {
    const { handleOnContentPress, content } = this.props;

    handleOnContentPress(content.author, content.permlink);
  };

  _handleOnVotersPress = () => {
    const { handleOnVotersPress, content } = this.props;

    handleOnVotersPress(content.active_votes);
  };

  _handleOnDropdownSelect = () => {
    // alert('This feature implementing...');
  };

  render() {
    const { content, isLoggedIn, user } = this.props;
    const likersText = `@${content.top_likers[0]}, @${content.top_likers[1]}, @${
      content.top_likers[2]
    }`;
    const otherLikers = ` & ${content.vote_count - content.top_likers.length} others like this`;
    const likesCount = `${content.vote_count} likes`;

    return (
      <View style={styles.post}>
        <View style={styles.bodyFooter}>
          <PostHeaderDescription
            date={content.created}
            profileOnPress={this._handleOnUserPress}
            name={content.author}
            reputation={content.author_reputation}
            tag={content.category}
            avatar={content && content.avatar}
            size={32}
          />
          <DropdownButton
            isHasChildIcon
            iconName="md-more"
            // options={['BOOKMARK', 'REBLOG', 'REPLY']}
            options={['This', 'feature', 'implementing']}
            onSelect={this._handleOnDropdownSelect}
          />
        </View>
        <View style={styles.postBodyWrapper}>
          <TouchableOpacity
            style={[{ flexDirection: 'column' }]}
            onPress={() => this._handleOnContentPress()}
          >
            <Image
              source={{ uri: content && content.image }}
              defaultSource={require('../../../assets/no_image.png')}
              style={styles.image}
            />
            <View style={[styles.postDescripton]}>
              <Text style={styles.title}>{content.title}</Text>
              <Text style={styles.summary}>{content.summary}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.bodyFooter}>
          <View style={styles.leftFooterWrapper}>
            <Upvote isShowpayoutValue content={content} user={user} isLoggedIn={isLoggedIn} />
            <TouchableOpacity style={styles.commentButton}>
              <Icon style={[styles.commentIcon, { marginLeft: 25}]} iconType="MaterialIcons" name="people" />
              <Text style={styles.comment}>{content.vote_count}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.commentButton}>
            <Icon style={[styles.commentIcon]} iconType="MaterialIcons" name="chat" />
            <Text style={styles.comment}>{content.children}</Text>
          </TouchableOpacity>
        </View>
        <LineBreak height={8} />
        {/* {content && content.top_likers ? (
          <TouchableOpacity
            style={styles.likersWrapper}
            onPress={() => this._handleOnVotersPress()}
          >
            <View style={styles.topLikers}>
              {content.top_likers.map((liker, i) => (
                <FastImage
                  source={{
                    uri: `https://steemitimages.com/u/${liker}/avatar/small`,
                  }}
                  style={[styles.liker, i !== 0 && { marginLeft: -3 }]}
                />
              ))}
              <Text style={styles.footer}>
                {likersText}
                {otherLikers}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View>
            <Text style={styles.footer}>{likesCount}</Text>
          </View>
        )} */}
      </View>
    );
  }
}

export default PostCard;
