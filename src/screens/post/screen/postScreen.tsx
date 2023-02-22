import React, { useState, useRef, useEffect } from 'react';
import { View } from 'react-native';

// Components
import { BasicHeader, IconButton, PostDisplay, PostOptionsModal } from '../../../components';
import styles from '../styles/postScreen.styles';


// Component
import { postQueries } from '../../../providers/queries';


const PostScreen = ({
  navigation,
  route
}) => {

  const params = route.params || {};


  // // refs
  const isNewPost = useRef(route.params?.isNewPost).current;
  const postOptionsModalRef = useRef<typeof PostOptionsModal | null>(null);

  const [author, setAuthor] = useState(params.content?.author || params.author);
  const [permlink, setPermlink] = useState(params.content?.permlink || params.permlink);


  const getPostQuery = postQueries.useGetPostQuery(author, permlink);
  const getParentPostQuery = postQueries.useGetPostQuery();

  // useEffect(()=>{
  //   //TODO: remove before PR, only for testing
  //   const timer = setTimeout(()=>{

  //     navigation.goBack();
  //     dispatch({
  //       type:"inc-scroll-index"
  //     })
  //   }, 300)

  //   return ()=> {
  //     if(timer){
  //       clearTimeout(timer)
  //     }
  //   }
  // }, [])

  useEffect(() => {
    const post = getPostQuery.data;
    if (post) {
      if (post && post.depth > 0 && post.parent_author && post.parent_permlink) {
        getParentPostQuery.setAuthor(post.parent_author);
        getParentPostQuery.setPermlink(post.parent_permlink);
      }
    }
  }, [getPostQuery.data]);

  // // Component Functions
  const _loadPost = async (_author = null, _permlink = null) => {
    if (_author && _permlink && _author !== author && _permlink !== _permlink) {
      setAuthor(_author);
      setPermlink(_permlink);
    }
    getPostQuery.refetch();
  };

  // // useEffect(() => {
  // //   const { isFetch: nextIsFetch } = route.params ?? {};
  // //   if (nextIsFetch) {
  // //     const { author: _author, permlink } = route.params;
  // //     _loadPost(_author, permlink);
  // //   }
  // // }, [route.params.isFetch]);

  const _isPostUnavailable = !getPostQuery.isLoading && getPostQuery.error;


  const _onPostOptionsBtnPress = (content = getPostQuery.data) => {
    if (postOptionsModalRef.current) {
      postOptionsModalRef.current.show(content);
    }
  }

  const _postOptionsBtn = (
    <IconButton
      iconStyle={styles.optionsIcon}
      iconType="MaterialCommunityIcons"
      name="dots-vertical"
      onPress={_onPostOptionsBtnPress}
      size={24}
    />

  )


  return (
    <View style={styles.container} >
      <BasicHeader
        isHasDropdown={true}
        title="Post"
        content={getPostQuery.data}
        dropdownComponent={_postOptionsBtn}
        isNewPost={isNewPost}
      />
      <PostDisplay
        author={author}
        isPostUnavailable={_isPostUnavailable}
        fetchPost={_loadPost}
        isFetchComments={true}
        isNewPost={isNewPost}
        parentPost={getParentPostQuery.data}
        post={getPostQuery.data}
      />
      <PostOptionsModal
        ref={postOptionsModalRef}
      />
    </View>

    // <ScrollView>
    //   <Text>{params.content.body}</Text>
    // </ScrollView>
  );
};

export default PostScreen;
