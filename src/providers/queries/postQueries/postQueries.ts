import { renderPostBody } from '@ecency/render-helper';
import { Alert } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import { Platform } from 'react-native';
import { useAppSelector } from '../../../hooks';
import { getDiscussionCollection, getPost } from '../../hive/dhive';
import QUERIES from '../queryKeys';
import { Comment } from '../../../redux/reducers/cacheReducer';

/** hook used to return user drafts */
export const useGetPostQuery = (_author?: string, _permlink?: string) => {
  const currentAccount = useAppSelector((state) => state.account.currentAccount);

  const [author, setAuthor] = useState(_author);
  const [permlink, setPermlink] = useState(_permlink);

  const query = useQuery([QUERIES.POST.GET, author, permlink], async () => {
    if (!author || !permlink) {
      return null;
    }

    try {
      const post = await getPost(author, permlink, currentAccount?.username);
      if (post?.post_id > 0) {
        return post;
      }

      new Error('Post unavailable');
    } catch (err) {
      console.warn('Failed to get post', err);
      throw err;
    }
  });

  return {
    ...query,
    setAuthor,
    setPermlink,
  };
};

/**
 * //caches post data prior to fetch using pre existing data of post
 * @returns hook with cachePost method
 */

export const usePostsCachePrimer = () => {
  const queryClient = useQueryClient();

  const cachePost = async (post) => {
    if (!post || !post.author || !post.permlink || !post.body) {
      return;
    }

    console.log('priming data', post.author, post.permlink, post);
    post.body = renderPostBody({ ...post, last_update: post.updated }, true, Platform.OS !== 'ios');
    queryClient.setQueryData([QUERIES.POST.GET, post.author, post.permlink], post);
  };

  return {
    cachePost,
  };
};

/**
 * fetches and sectioned discussion to be used readily with sectioned flat list
 * also injects local cache to data if any
 * @param _author
 * @param _permlink
 * @returns raw query with commentsData as extra parameter
 */
export const useDiscussionQuery = (_author?: string, _permlink?: string) => {
  const currentAccount = useAppSelector((state) => state.account.currentAccount);
  const cachedComments:{[key:string]:Comment} = useAppSelector((state) => state.cache.commentsCollection);

  const [author, setAuthor] = useState(_author);
  const [permlink, setPermlink] = useState(_permlink);

  const [commentsData, setCommentsData] = useState([]);
  const [repliesMap, setRepliesMap] = useState([]);

  //inject cached comments here
  const _injectCachedComments = (_comments) => {

    console.log("updating with cache", _comments, cachedComments);
    if(!cachedComments || !_comments){
      return _comments;
    }

    for(const path in cachedComments){

      const currentTime = new Date().getTime();
      const cachedComment = cachedComments[path];
      const _parentPath = `${cachedComment.parent_author}/${cachedComment.parent_permlink}`;
      const cacheUpdateTimestamp = new Date(cachedComment.updated || 0).getTime();
      

      //check if commentKey already exist in comments map, 
      if(_comments && _comments[path]){
        //check if we should update comments map with cached map based on updat timestamp
        const remoteUpdateTimestamp = new Date(_comments[path].updated).getTime();

        if(cacheUpdateTimestamp > remoteUpdateTimestamp){
          _comments[path] = cachedComment;
        }
      } 
      //else if comment key do not exist, possiblky comment is a new comment, in this case, check if parent of comment exist in map
      else if (_comments[_parentPath]){
        //in this case add comment key in childern and inject cachedComment in commentsMap
        _comments[path] = cachedComment
        _comments[_parentPath].replies.push(path);
        _comments[_parentPath].children = _comments[_parentPath].children + 1;
        
        //if comment was created very recently enable auto reveal
        if(currentTime - cacheUpdateTimestamp < 5000){
          _comments[_parentPath].revealRepliesByDefault = true;
        }
   
      }
  
    }
    
    return {..._comments};
  };

  // traverse discussion collection to curate sections
  const parseCommentsData = async (commentsMap: any, author: string, permlink: string) => {
    const MAX_THREAD_LEVEL = 3;
    const comments: any = [];

    if (!commentsMap) {
      setCommentsData([]);
      return;
    }

    // set replies as data for a section, a single array with level indicating reply placement
    const parseReplies = (
      commentsMap: any,
      replyKeys: any[],
      commentKey: string,
      level: number,
      replies: any[] = [],
    ) => {
      if (replyKeys?.length > 0 && level <= MAX_THREAD_LEVEL) {
        replyKeys.forEach((pathKey) => {
          const comment = commentsMap[pathKey];
          if (comment) {
            comment.commentKey = commentKey;
            comment.level = level;
            replies.push(comment);
            replies = parseReplies(commentsMap, comment.replies, commentKey, level + 1, replies);
            return comment;
          }
        });
      } else if (level > MAX_THREAD_LEVEL) {
        // makes sure replies data is empty, used to compare with children to decide to show read more comments buttons
        replies.lastItem.replies = [];
      }
      return replies;
    };

    const _repliesMap: any = {};
    for (const key in commentsMap) {
      if (commentsMap.hasOwnProperty(key)) {
        const comment = commentsMap[key];

        // prcoess first level comment
        if (comment && comment.parent_author === author && comment.parent_permlink === permlink) {
          comment.commentKey = key;
          comment.level = 1;
          comments.push(comment);

          const _replies = parseReplies(commentsMap, comment.replies, key, 2);
          _repliesMap[key] = _replies || [];
        }
      }
    }

    setRepliesMap(_repliesMap);
    setCommentsData(comments);
  };

  const _fetchComments = async () => {
    console.log('fetching discussions');
    const response = await getDiscussionCollection(author, permlink);
    console.log('discussion response', response);
    return response;
  };

  const query = useQuery<{[key:string]:Comment}>([QUERIES.POST.GET_DISCUSSION, author, permlink], _fetchComments);

  const data = useMemo(() => _injectCachedComments(query.data), [query.data, cachedComments]);

  useEffect(() => {
    parseCommentsData(data, author, permlink);
  }, [data]);

  return {
    ...query,
    data,
    commentsData,
    repliesMap,
    setAuthor,
    setPermlink,
  };
};
