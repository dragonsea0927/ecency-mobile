import React, { useCallback, useEffect, useRef, useState, Fragment } from 'react';
import { View, Text, ScrollView, Dimensions, SafeAreaView, RefreshControl } from 'react-native';
import { injectIntl } from 'react-intl';
import get from 'lodash/get';

// Providers
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { userActivity } from '../../../providers/ecency/ePoint';

// Utils
import { getTimeFromNow } from '../../../utils/time';

// Components
import { PostHeaderDescription, PostBody, Tags } from '../../postElements';
import { PostPlaceHolder, StickyBar, TextWithIcon, NoPost } from '../../basicUIElements';
import { Upvote } from '../../upvote';
import { IconButton } from '../../iconButton';
import { CommentsDisplay } from '../../commentsDisplay';
import { ParentPost } from '../../parentPost';

// Styles
import styles from './postDisplayStyles';
import { OptionsModal } from '../../atoms';
import { orientations } from '../../../redux/constants/orientationsConstants';

const HEIGHT = Dimensions.get('window').width;
const WIDTH = Dimensions.get('window').width;

const PostDisplayView = ({
  currentAccount,
  isLoggedIn,
  isNewPost,
  fetchPost,
  handleOnEditPress,
  handleOnReplyPress,
  handleOnVotersPress,
  handleOnReblogsPress,
  post,
  intl,
  parentPost,
  isPostUnavailable,
  author,
  handleOnRemovePress,
  activeVotes,
  reblogs,
  activeVotesCount,
}) => {
  const insets = useSafeAreaInsets();

  const [postHeight, setPostHeight] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [cacheVoteIcrement, setCacheVoteIcrement] = useState(0);
  const [isLoadedComments, setIsLoadedComments] = useState(false);
  const actionSheet = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [postBodyLoading, setPostBodyLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [contentWidth, setContentWidth] = useState(WIDTH - 32);
  const deviceOrientation = useSelector((state) => state.ui.deviceOrientation);

  // Component Life Cycles
  useEffect(() => {
    if (
      deviceOrientation === orientations.LANDSCAPE_LEFT ||
      deviceOrientation === orientations.LANDSCAPE_RIGHT
    ) {
      setContentWidth(Dimensions.get('window').height - 128);
    } else {
      setContentWidth(Dimensions.get('window').width - 32);
    }
  }, [deviceOrientation]);

  useEffect(() => {
    if (isLoggedIn && get(currentAccount, 'name') && !isNewPost) {
      userActivity(10);
    }
  }, []);

  useEffect(() => {
    if (post) {
      const _tags = get(post.json_metadata, 'tags', []);
      if (post.category && _tags[0] !== post.category && Array.isArray(_tags)) {
        _tags.splice(0, 0, post.category);
      }
      setTags(_tags);
    }
  }, [post]);

  // Component Functions
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPost().then(() => setRefreshing(false));
  }, [refreshing]);

  const _handleOnScroll = (event) => {
    const { y } = event.nativeEvent.contentOffset;

    setScrollHeight(HEIGHT + y);
  };

  const _handleOnPostLayout = (event) => {
    const { height } = event.nativeEvent.layout;

    setPostHeight(height);
  };

  const _handleOnReblogsPress = () => {
    if (reblogs.length > 0 && handleOnReblogsPress) {
      handleOnReblogsPress();
    }
  };

  const _handleCacheVoteIncrement = () => {
    setCacheVoteIcrement(1);
  };

  const _getTabBar = (isFixedFooter = false) => {
    return (
      <SafeAreaView style={styles.tabBarSafeArea}>
        <StickyBar isFixedFooter={isFixedFooter}>
          <View style={styles.stickyWrapper}>
            <Upvote
              activeVotes={activeVotes}
              isShowPayoutValue
              content={post}
              handleCacheVoteIncrement={_handleCacheVoteIncrement}
            />
            <TextWithIcon
              iconName="heart-outline"
              iconStyle={styles.barIcons}
              iconType="MaterialCommunityIcons"
              isClickable
              onPress={() => handleOnVotersPress && handleOnVotersPress()}
              text={activeVotesCount + cacheVoteIcrement}
              textMarginLeft={20}
            />
            <TextWithIcon
              iconName="repeat"
              iconStyle={styles.barIcons}
              iconType="MaterialIcons"
              isClickable
              onPress={_handleOnReblogsPress}
              text={reblogs.length}
              textMarginLeft={20}
            />
            {isLoggedIn && (
              <TextWithIcon
                iconName="comment-outline"
                iconStyle={styles.barIcons}
                iconType="MaterialCommunityIcons"
                isClickable
                text={get(post, 'children', 0)}
                textMarginLeft={20}
                onPress={() => handleOnReplyPress && handleOnReplyPress()}
              />
            )}
            {!isLoggedIn && (
              <TextWithIcon
                iconName="comment-outline"
                iconStyle={styles.barIcons}
                iconType="MaterialCommunityIcons"
                isClickable
                text={get(post, 'children', 0)}
                textMarginLeft={20}
              />
            )}
            <View style={styles.stickyRightWrapper}>
              {get(currentAccount, 'name') === get(post, 'author') && (
                <Fragment>
                  {!get(post, 'children') && !activeVotes.length && (
                    <IconButton
                      iconStyle={styles.barIconRight}
                      iconType="MaterialIcons"
                      name="delete-forever"
                      onPress={() => actionSheet.current.show()}
                      style={styles.barIconButton}
                    />
                  )}
                  <IconButton
                    iconStyle={styles.barIconRight}
                    iconType="MaterialIcons"
                    name="create"
                    onPress={() => handleOnEditPress && handleOnEditPress()}
                    style={styles.barIconButton}
                  />
                </Fragment>
              )}
            </View>
          </View>
        </StickyBar>
      </SafeAreaView>
    );
  };

  const { name } = currentAccount;

  // const isPostEnd = scrollHeight > postHeight;
  const isGetComment = scrollHeight + 300 > postHeight;
  const formatedTime = post && getTimeFromNow(post.created);

  if (isGetComment && !isLoadedComments) {
    setIsLoadedComments(true);
  }

  if (isPostUnavailable) {
    return (
      <NoPost
        imageStyle={styles.noPostImage}
        defaultText={`${intl.formatMessage({
          id: 'post.removed_hint',
        })}`}
      />
    );
  }

  const _handleOnPostBodyLoad = () => {
    setPostBodyLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          // { paddingLeft: deviceOrientation === orientations.LANDSCAPE_LEFT ? insets.left : 0 },
        ]}
        onScroll={(event) => _handleOnScroll(event)}
        scrollEventThrottle={16}
        overScrollMode="never"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={{ width: WIDTH }}>
          {parentPost && <ParentPost post={parentPost} />}

          <View style={styles.header}>
            {!post ? (
              <PostPlaceHolder />
            ) : (
              <View onLayout={(event) => _handleOnPostLayout(event)}>
                {!!post.title && <Text style={styles.title}>{post.title}</Text>}
                <PostHeaderDescription
                  date={formatedTime}
                  name={author || post.author}
                  currentAccountUsername={name}
                  reputation={post.author_reputation}
                  size={40}
                  inlineTime={true}
                  customStyle={styles.headerLine}
                />
                <PostBody body={post.body} onLoadEnd={_handleOnPostBodyLoad} />
                {!postBodyLoading && (
                  <View style={styles.footer}>
                    <Tags tags={tags} />
                    <Text style={styles.footerText}>
                      Posted by
                      <Text style={styles.footerName}>{` ${author || post.author} `}</Text>
                      {formatedTime}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
          {post && !postBodyLoading && (isGetComment || isLoadedComments) && (
            <CommentsDisplay
              author={author || post.author}
              mainAuthor={author || post.author}
              permlink={post.permlink}
              commentCount={post.children}
              fetchPost={fetchPost}
              handleOnVotersPress={handleOnVotersPress}
              fetchedAt={post.post_fetched_at}
            />
          )}
        </View>
      </ScrollView>
      {post && _getTabBar(true)}
      <OptionsModal
        ref={actionSheet}
        options={[
          intl.formatMessage({ id: 'alert.delete' }),
          intl.formatMessage({ id: 'alert.cancel' }),
        ]}
        title={intl.formatMessage({ id: 'alert.remove_alert' })}
        cancelButtonIndex={1}
        onPress={(index) => (index === 0 ? handleOnRemovePress(get(post, 'permlink')) : null)}
      />
    </View>
  );
};

export default injectIntl(PostDisplayView);
