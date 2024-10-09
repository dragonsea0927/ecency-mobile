import React, { Fragment, useState, useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform, useWindowDimensions, View } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useIntl } from 'react-intl';
import EStyleSheet from 'react-native-extended-stylesheet';
import RNFetchBlob from 'rn-fetch-blob';
import ActionSheetView from 'react-native-actions-sheet';

// Services and Actions
import { useNavigation } from '@react-navigation/native';
import { writeToClipboard } from '../../../../utils/clipboard';
import {
  handleDeepLink,
  showProfileModal,
  toastNotification,
} from '../../../../redux/actions/uiAction';

// Constants
import { default as ROUTES } from '../../../../constants/routeNames';
import { OptionsModal } from '../../../atoms';
import { isCommunity } from '../../../../utils/communityValidation';
import { GLOBAL_POST_FILTERS_VALUE } from '../../../../constants/options/filters';
import { ImageViewer, PostHtmlRenderer, VideoPlayer } from '../../..';
import { useAppDispatch } from '../../../../hooks';
import { isHiveUri } from '../../../../utils/hive-uri';

const PostBody = ({ body, metadata, onLoadEnd, width }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const dims = useWindowDimensions();
  const contentWidth = width || dims.width - 32;

  const [selectedLink, setSelectedLink] = useState(null);
  const [html, setHtml] = useState('');
  const [youtubeVideoId, setYoutubeVideoId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoStartTime, setVideoStartTime] = useState(0);

  const actionLink = useRef(null);
  const imageViewerRef = useRef(null);
  const youtubePlayerRef = useRef(null);

  useEffect(() => {
    if (body) {
      setHtml(body.replace(/<a/g, '<a target="_blank"'));
    }
  }, [body]);

  const _handleYoutubePress = (videoId, startTime) => {
    if (videoId && youtubePlayerRef.current) {
      setYoutubeVideoId(videoId);
      setVideoStartTime(startTime);
      youtubePlayerRef.current.show();
    }
  };

  const _handleVideoPress = (embedUrl) => {
    if (embedUrl && youtubePlayerRef.current) {
      setVideoUrl(embedUrl);
      setVideoStartTime(0);
      youtubePlayerRef.current.show();
    }
  };

  const handleLinkPress = (ind) => {
    if (ind === 1) {
      // open link
      if (selectedLink) {
        navigation.navigate({
          name: ROUTES.SCREENS.WEB_BROWSER,
          params: {
            url: selectedLink,
          },
          key: selectedLink,
        });
      }
    }
    if (ind === 0) {
      // copy to clipboard
      writeToClipboard(selectedLink).then(() => {
        dispatch(
          toastNotification(
            intl.formatMessage({
              id: 'alert.copied',
            }),
          ),
        );
      });
    }

    setSelectedLink(null);
  };

  const _handleTagPress = (tag, filter = GLOBAL_POST_FILTERS_VALUE[0]) => {
    if (tag) {
      const name = isCommunity(tag) ? ROUTES.SCREENS.COMMUNITY : ROUTES.SCREENS.TAG_RESULT;
      const key = `${filter}/${tag}`;
      navigation.navigate({
        name,
        params: {
          tag,
          filter,
          key,
        },
      });
    }
  };

  const _handleOnPostPress = (permlink, author) => {
    if (permlink) {
      // snippets checks if there is anchored post inside permlink and use that instead
      const anchoredPostRegex = /(.*?\#\@)(.*)\/(.*)/;
      const matchedLink = permlink.match(anchoredPostRegex);
      if (matchedLink) {
        [, , author, permlink] = matchedLink;
      }

      // check if permlink has trailing query param, remove that if is the case
      const queryIndex = permlink.lastIndexOf('?');
      if (queryIndex > -1) {
        permlink = permlink.substring(0, queryIndex);
      }

      navigation.navigate({
        name: ROUTES.SCREENS.POST,
        params: {
          author,
          permlink,
        },
        key: permlink,
      });
    }
  };

  const _handleOnUserPress = (username) => {
    if (username) {
      dispatch(showProfileModal(username));
    } else {
      dispatch(
        toastNotification(
          intl.formatMessage({
            id: 'post.wrong_link',
          }),
        ),
      );
    }
  };

  const checkAndroidPermission = async () => {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      await PermissionsAndroid.request(permission);
      Promise.resolve();
    } catch (error) {
      Promise.reject(error);
    }
  };

  const _downloadImage = async (uri) => {
    return RNFetchBlob.config({
      fileCache: true,
      appendExt: 'jpg',
    })
      .fetch('GET', uri)
      .then((res) => {
        const { status } = res.info();

        if (status == 200) {
          return res.path();
        } else {
          Promise.reject();
        }
      })
      .catch((errorMessage) => {
        Promise.reject(errorMessage);
      });
  };

  const _saveImage = async (uri) => {
    try {
      if (Platform.OS === 'android') {
        await checkAndroidPermission();
        uri = `file://${await _downloadImage(uri)}`;
      }
      CameraRoll.saveToCameraRoll(uri)
        .then((res) => {
          dispatch(
            toastNotification(
              intl.formatMessage({
                id: 'post.image_saved',
              }),
            ),
          );
        })
        .catch((error) => {
          dispatch(
            toastNotification(
              intl.formatMessage({
                id: 'post.image_saved_error',
              }),
            ),
          );
        });
    } catch (error) {
      dispatch(
        toastNotification(
          intl.formatMessage({
            id: 'post.image_saved_error',
          }),
        ),
      );
    }
  };

  const _handleLoadEnd = () => {
    if (onLoadEnd) {
      onLoadEnd();
    }
  };

  const _handleSetSelectedLink = (link) => {
    if (isHiveUri(link)) {
      dispatch(handleDeepLink(link));
    } else {
      setSelectedLink(link);
      actionLink.current.show();
    }
  };

  const _handleSetSelectedImage = (imageLink, postImgUrls) => {
    if (imageViewerRef.current) {
      imageViewerRef.current.show(imageLink, postImgUrls);
    }
  };

  return (
    <Fragment>
      <ImageViewer ref={imageViewerRef} />

      <ActionSheetView
        ref={youtubePlayerRef}
        gestureEnabled={true}
        hideUnderlay
        containerStyle={{ backgroundColor: 'black' }}
        indicatorStyle={{ backgroundColor: EStyleSheet.value('$primaryWhiteLightBackground') }}
        onClose={() => {
          setYoutubeVideoId(null);
          setVideoUrl(null);
        }}
      >
        <VideoPlayer
          mode={youtubeVideoId ? 'youtube' : 'uri'}
          youtubeVideoId={youtubeVideoId}
          uri={videoUrl}
          startTime={videoStartTime}
        />
      </ActionSheetView>

      <OptionsModal
        ref={actionLink}
        options={[
          intl.formatMessage({ id: 'post.copy_link' }),
          intl.formatMessage({ id: 'alert.external_link' }),
          intl.formatMessage({ id: 'alert.cancel' }),
        ]}
        title={intl.formatMessage({ id: 'post.link' })}
        cancelButtonIndex={2}
        onPress={(index) => {
          handleLinkPress(index);
        }}
      />
      <View>
        <PostHtmlRenderer
          key={`html_content_${contentWidth}`} // makes sure html content is rerendered on width update
          body={html}
          metadata={metadata}
          contentWidth={contentWidth}
          onLoaded={_handleLoadEnd}
          setSelectedImage={_handleSetSelectedImage}
          setSelectedLink={_handleSetSelectedLink}
          handleOnPostPress={_handleOnPostPress}
          handleOnUserPress={_handleOnUserPress}
          handleTagPress={_handleTagPress}
          handleVideoPress={_handleVideoPress}
          handleYoutubePress={_handleYoutubePress}
        />
      </View>
    </Fragment>
  );
};

const areEqual = (prevProps, nextProps) => {
  if (prevProps.body === nextProps.body) {
    return true;
  }
  return false;
};

export default React.memo(PostBody, areEqual);
