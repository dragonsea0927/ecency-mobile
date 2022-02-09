import React, { memo } from 'react';
import RenderHTML, { CustomRendererProps, Element, TNode } from 'react-native-render-html';
import styles from './postHtmlRendererStyles';
import { LinkData, parseLinkData } from './linkDataParser';
import VideoThumb from './videoThumb';
import { AutoHeightImage } from '../autoHeightImage/autoHeightImage';
import { useHtmlIframeProps, iframeModel } from '@native-html/iframe-plugin';
import WebView from 'react-native-webview';
import { VideoPlayer } from '..';
import { Platform } from 'react-native';

interface PostHtmlRendererProps {
  contentWidth: number;
  body: string;
  isComment?: boolean;
  onLoaded?: () => void;
  setSelectedImage: (imgUrl: string) => void;
  setSelectedLink: (url: string) => void;
  onElementIsImage: (imgUrl: string) => void;
  handleOnPostPress: (permlink: string, authro: string) => void;
  handleOnUserPress: (username: string) => void;
  handleTagPress: (tag: string, filter?: string) => void;
  handleVideoPress: (videoUrl: string) => void;
  handleYoutubePress: (videoId: string, startTime: number) => void;
}

export const PostHtmlRenderer = memo(
  ({
    contentWidth,
    body,
    isComment,
    onLoaded,
    setSelectedImage,
    setSelectedLink,
    onElementIsImage,
    handleOnPostPress,
    handleOnUserPress,
    handleTagPress,
    handleVideoPress,
    handleYoutubePress,
  }: PostHtmlRendererProps) => {
    //new renderer functions
    body = body.replace(/<center>/g, '<div class="text-center">').replace(/<\/center>/g, '</div>');

    console.log('Comment body:', body);

    const _handleOnLinkPress = (data: LinkData) => {
      if (!data) {
        return;
      }

      const {
        type,
        href,
        author,
        permlink,
        tag,
        youtubeId,
        startTime,
        filter,
        videoHref,
        community,
      } = data;

      try {
        switch (type) {
          case '_external':
          case 'markdown-external-link':
            setSelectedLink(href);
            break;
          case 'markdown-author-link':
            if (handleOnUserPress) {
              handleOnUserPress(author);
            }
            break;
          case 'markdown-post-link':
            if (handleOnPostPress) {
              handleOnPostPress(permlink, author);
            }
            break;
          case 'markdown-tag-link':
            if (handleTagPress) {
              handleTagPress(tag, filter);
            }
            break;

          case 'markdown-video-link':
            if (handleVideoPress) {
              handleVideoPress(videoHref);
            }
            break;
          case 'markdown-video-link-youtube':
            if (handleYoutubePress) {
              handleYoutubePress(youtubeId, startTime);
            }

            break;

          //unused cases
          case 'markdown-witnesses-link':
            setSelectedLink(href);
            break;

          case 'markdown-proposal-link':
            setSelectedLink(href);
            break;

          case 'markdown-community-link':
            //tag press also handles community by default
            if (handleTagPress) {
              handleTagPress(community, filter);
            }
            break;

          default:
            break;
        }
      } catch (error) {}
    };

    const _onElement = (element: Element) => {
      if (element.tagName === 'img' && element.attribs.src) {
        const imgUrl = element.attribs.src;
        console.log('img element detected', imgUrl);
        onElementIsImage(imgUrl);
      }
    };

    const _anchorRenderer = ({ InternalRenderer, tnode, ...props }: CustomRendererProps<TNode>) => {
      const parsedTnode = parseLinkData(tnode);
      const _onPress = () => {
        console.log('Link Pressed:', tnode);
        const data = parseLinkData(tnode);
        _handleOnLinkPress(data);
      };
      

      //process video link
      if(tnode.classes?.indexOf('markdown-video-link') >= 0){

        //TODO: remove android check when fix for react-native-weview scroll crash is available
        //ref: https://github.com/react-native-webview/react-native-webview/issues/2364
        if(isComment || Platform.OS === 'android'){
          const imgElement = tnode.children.find((child) => {
            return child.classes.indexOf('video-thumbnail') > 0 ? true : false;
          });
          if (!imgElement) {
            return <VideoThumb contentWidth={contentWidth} onPress={_onPress} />;
          }
        } else {
          return (
            <VideoPlayer
              mode={parsedTnode.youtubeId ? 'youtube' : 'source'}
              contentWidth={contentWidth}
              source={parsedTnode.videoHref}
              youtubeVideoId={parsedTnode.youtubeId}
              startTime={parsedTnode.startTime}
              disableAutoplay={true}
            />
          );
        }
      }


      return <InternalRenderer tnode={tnode} onPress={_onPress} {...props} />;
    };


    //this method checks if image is a child of table column
    //and calculates img width accordingly,
    //returns full width if img is not part of table
    const getMaxImageWidth = (tnode: TNode) => {
      //return full width if not parent exist
      if (!tnode.parent || tnode.parent.tagName === 'body') {
        return contentWidth;
      }

      //return divided width based on number td tags
      if (tnode.parent.tagName === 'td') {
        const cols = tnode.parent.parent.children.length;
        return contentWidth / cols;
      }

      //check next parent
      return getMaxImageWidth(tnode.parent);
    };

    const _imageRenderer = ({ tnode }: CustomRendererProps<TNode>) => {
      const imgUrl = tnode.attributes.src;
      const _onPress = () => {
        console.log('Image Pressed:', imgUrl);
        setSelectedImage(imgUrl);
      };

      const isVideoThumb = tnode.classes?.indexOf('video-thumbnail') >= 0;
      const isAnchored = tnode.parent?.tagName === 'a';

      if (isVideoThumb) {
        return <VideoThumb contentWidth={contentWidth} uri={imgUrl} />;
      } else {
        const maxImgWidth = getMaxImageWidth(tnode);
        return (
          <AutoHeightImage
            contentWidth={maxImgWidth}
            imgUrl={imgUrl}
            isAnchored={isAnchored}
            onPress={_onPress}
          />
        );
      }
    };

    /**
     * the para renderer is designd to remove margins from para
     * if it's a direct child of li tag as the added margin causes
     * a weired misalignment of bullet and content
     * @returns Default Renderer
     */
    const _paraRenderer = ({ TDefaultRenderer, ...props }: CustomRendererProps<TNode>) => {
      props.style = props.tnode.parent.tagName === 'li' ? styles.pLi : styles.p;

      return <TDefaultRenderer {...props} />;
    };


    // iframe renderer for rendering iframes in body
    const _iframeRenderer = function IframeRenderer(props) {
      const iframeProps = useHtmlIframeProps(props);

       //TODO: remove android check logic when fix for react-native-webiew scrollview crash is available
       //ref: https://github.com/react-native-webview/react-native-webview/issues/2364
      if(isComment || Platform.OS === 'android'){
        const _onPress = () => {
          console.log('iframe thumb Pressed:', iframeProps);
          if (handleVideoPress) {
            handleVideoPress(iframeProps.source.uri);
          }
        };
        return (
          <VideoThumb contentWidth={contentWidth} onPress={_onPress} />
        )
      }else{
        return (

          <VideoPlayer 
            mode='source'
            source={iframeProps.source.uri}
            contentWidth={contentWidth}
          />
        );
      }

    };

    return (
      <RenderHTML
        source={{ html: body }}
        contentWidth={contentWidth}
        baseStyle={{ ...styles.baseStyle, width: contentWidth }}
        classesStyles={{
          phishy: styles.phishy,
          'text-justify': styles.textJustify,
          'text-center': styles.textCenter,
        }}
        tagsStyles={{
          body: styles.body,
          a: styles.a,
          img: styles.img,
          th: styles.th,
          tr: { ...styles.tr, width: contentWidth }, //center tag causes tr to have 0 width if not exclusivly set, contentWidth help avoid that
          div:{width:contentWidth},
          td: styles.td,
          blockquote: styles.blockquote,
          code: styles.code,
          li: styles.li,
          p: styles.p,
          table: styles.table,
        }}
        domVisitors={{
          onElement: _onElement,
        }}
        renderers={{
          img: _imageRenderer,
          a: _anchorRenderer,
          p: _paraRenderer,
          iframe: _iframeRenderer,
        }}
        onHTMLLoaded={onLoaded && onLoaded}
        defaultTextProps={{
          selectable: true,
        }}
        customHTMLElementModels={{
          iframe: iframeModel,
        }}
        renderersProps={{
          iframe: {
            scalesPageToFit: true,
            webViewProps: {
              /* Any prop you want to pass to iframe WebViews */
            },
          },
        }}
        WebView={WebView}
      />
    );
  },
  (next, prev) => next.body === prev.body,
);
