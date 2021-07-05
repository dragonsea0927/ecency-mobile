import api from '../../config/api';
import ecencyApi from '../../config/ecencyApi';
import searchApi from '../../config/search';
import { upload } from '../../config/imageApi';
import serverList from '../../config/serverListApi';
import bugsnag from '../../config/bugsnag';
import { SERVER_LIST } from '../../constants/options/api';
import { parsePost } from '../../utils/postParser';

export const getCurrencyRate = (currency) =>
  api
    .get(`/market-data/currency-rate/${currency}/hbd?fixed=1`)
    .then((resp) => resp.data)
    .catch((err) => {
      bugsnag.notify(err);
      //TODO: save currency rate of offline values
      return 1;
    });

export const getCurrencyTokenRate = (currency, token) =>
  api
    .get(`/market-data/currency-rate/${currency}/${token}`)
    .then((resp) => resp.data)
    .catch((err) => {
      bugsnag.notify(err);
      return 0;
    });



/**
 * returns list of saved drafts on ecency server
 */
export const getDrafts = async () => {
  try{
    const res = await ecencyApi.post('/private-api/drafts');
    return res.data;
  }catch(error){
    bugsnag.notify(error);
    throw error;
  }
}
  


/**
 * @params draftId
 */
export const removeDraft = async (draftId:string) => {
  try{
    const data = { id:draftId }
    const res = await ecencyApi.post(`/private-api/drafts-delete`, data);
    return res.data
  }catch(error){
    bugsnag.notify(error);
    throw error;
  }
}


/**
 * @params title
 * @params body
 * @params tags
 */
export const addDraft = async (title:string, body:string, tags:string) => {
  try {
    const data = { title, body, tags }
    const res = await ecencyApi.post('/private-api/drafts-add', data)
    const { drafts } = res.data;
    if (drafts) {
      return drafts.pop(); //return recently saved last draft in the list
    } else {
      throw new Error('No drafts returned in response');
    }
  } catch(error){
    bugsnag.notify(error);
    throw error;
  }
}


/**
 * @params draftId
 * @params title
 * @params body
 * @params tags
 */
export const updateDraft = async (draftId:string, title:string, body:string, tags:string) => {
  try {
    const data = {id:draftId, title, body, tags }
    const res = await ecencyApi.post(`/private-api/drafts-update`, data)
    if(res.data){
      return res.data
    } else {
      throw new Error("No data returned in response")
    }
  } catch(error){
    bugsnag.notify(error);
    throw error;
  }
};



/** 
 * ************************************
 * BOOKMARKS ECENCY APIS IMPLEMENTATION 
 * ************************************
 */

/**
 * Adds post to user's bookmarks
 * @param author 
 * @param permlink 
 * @returns array of saved bookmarks
 */
export const addBookmark = async (author:string, permlink:string) => {
  try {
    const data = { author, permlink };
    const response = await ecencyApi.post(`/private-api/bookmarks-add`, data);
    return response.data;
  } catch(error) {
    console.warn("Failed to add bookmark", error)
    bugsnag.notify(error)
    throw error
  }
}

/**
 * fetches saved bookmarks of user
 * @returns array of saved bookmarks
 */
export const getBookmarks = async () => {
  try {
    const response = await ecencyApi.post(`/private-api/bookmarks`);
    return response.data;
  } catch(error) {
    console.warn("Failed to get saved bookmarks", error)
    bugsnag.notify(error)
    throw error
  }
}


/**
 * Deletes bookmark from user's saved bookmarks
 * @params bookmarkId
 * @returns array of saved bookmarks
 */
export const deleteBookmark = async (bookmarkId:string) => {
  try {
    const data = { id:bookmarkId}
    const response = await ecencyApi.post(`/private-api/bookmarks-delete`, data);
    return response.data;
  } catch(error) {
    console.warn("Failed to delete bookmark", error)
    bugsnag.notify(error)
    throw error
  }
}


export const addReport = (url) =>
  api
    .post('/report', {
      url,
    })
    .then((resp) => resp.data);


  /** 
 * ************************************
 * FAVOURITES ECENCY APIS IMPLEMENTATION 
 * ************************************
 */

/**
 * Fetches user favourites
 * @returns array of favourite accounts
 */
export const getFavorites = async () => {
  try{
    const response = await ecencyApi.post(`/private-api/favorites`)
    return response.data;
  } catch(error) {
    console.warn("Failed to get favorites", error);
    bugsnag.notify(error);
    throw error
  }
}

/**
 * Checks if user is precent in current user's favourites
 * @params targetUsername username
 * @returns boolean
 */
export const checkFavorite = async (targetUsername:string) => {
  try {
    const data = { account: targetUsername };
    const response = await ecencyApi.post(`/private-api/favorites-check`, data);
    return response.data || false;
  } catch(error) {
    console.warn("Failed to check favorite", error);
    bugsnag.notify(error);
  }
}

/**
 * Adds taget user to current user's favourites
 * @params target username
 * @returns array of user favourites
 */
export const addFavorite = async (targetUsername:string) => {
  try {
    const data = { account: targetUsername };
    const response = await ecencyApi.post(`/private-api/favorites-add`, data);
    return response.data;
  } catch(error) {
    console.warn("Failed to add user favorites", error);
    bugsnag.notify(error);
    throw error
  }
}


/**
 * Removes taget user to current user's favourites
 * @params target username
 * @returns array of user favourites
 */
export const deleteFavorite = async (targetUsername:string) => {
  try {
    const data = { account: targetUsername };
    const response = await ecencyApi.post(`/private-api/favorites-delete`, data);
    return response.data;
  } catch(error) {
    console.warn("Failed to add user favorites", error);
    bugsnag.notify(error);
    throw error;
  }
}


/** 
 * ************************************
 * SNIPPETS ECENCY APIS IMPLEMENTATION 
 * ************************************
 */


/**
 * Fetches all saved user fragments/snippets from ecency
 * @returns array of fragments
 */
export const getFragments = async () => {
  try {
    const response = await ecencyApi.post(`/private-api/fragments`);
    return response.data;
  } catch(error) {
    console.warn("Failed to get fragments", error);
    bugsnag.notify(error)
    throw error;
  }
}


/**
 * Adds new fragment/snippets to user's saved fragments/snippets
 * @params title title
 * @params body body
 * @returns array of fragments
 */

  export const addFragment = async (title: string, body: string) => {
    try{
      const data = { title, body };
      const response = await ecencyApi.post(`/private-api/fragments-add`, data);
      return response.data;
    } catch(error) {
      console.warn("Failed to add fragment", error);
      bugsnag.notify(error)
      throw error;
    }
  }

/**
 * Updates a fragment content using fragment id
 * @params fragmentId
 * @params title
 * @params body
 * @returns array of fragments
 */
 export const updateFragment = async (fragmentId:string, title: string, body: string) => {
  try{
    const data = { id:fragmentId, title, body };
    const response = await ecencyApi.post(`/private-api/fragments-update`, data);
    return response.data;
  } catch(error) {
    console.warn("Failed to update fragment", error);
    bugsnag.notify(error)
    throw error;
  }
}

/**
 * Deletes user saved fragment using specified fragment id
 * @params fragmentId
 * @returns array of fragments
 */
 export const deleteFragment = async (fragmentId:string) => {
  try{
    const data = { id:fragmentId };
    const response = await ecencyApi.post(`/private-api/fragments-delete`, data);
    return response.data;
  } catch(error) {
    console.warn("Failed to delete fragment", error);
    bugsnag.notify(error)
    throw error;
  }
}



  /** 
 * ************************************
 * ACTIVITES ECENCY APIS IMPLEMENTATION 
 * ************************************
 */

export const getLeaderboard = async (duration:'day'|'week'|'month') => {
  try{
    const response = await ecencyApi.get(`private-api/leaderboard/${duration}`)
    return response.data;
  } catch(error) {
    bugsnag.notify(error)
  }
}

export const getActivities = (data) =>
  new Promise((resolve, reject) => {
    let url = null;
    switch (data.type) {
      case 'activities':
        url = `/activities/${data.user}`;
        break;
      case 'votes':
        url = `/rvotes/${data.user}`;
        break;
      case 'replies':
        url = `/replies/${data.user}`;
        break;
      case 'mentions':
        url = `/mentions/${data.user}`;
        break;
      case 'follows':
        url = `/follows/${data.user}`;
        break;
      case 'reblogs':
        url = `/reblogs/${data.user}`;
        break;
      case 'transfers':
        url = `/transfers/${data.user}`;
        break;
      default:
        url = `/activities/${data.user}`;
        break;
    }
    api
      .get(url, {
        params: {
          since: data.since,
        },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        bugsnag.notify(error);
        reject(error);
      });
  });


  export const getUnreadNotificationCount = async () => {
    try {
      const response = await ecencyApi.post(`/private-api/notifications/unread`)
      return response.data ? response.data.count : 0;
    } catch(error) {
      bugsnag.notify(error);
      throw error;
    }
  }

  export const markNotifications = async (id: string | null = null) => {
    try{
      const data = id ? { id } : {};
      const response = await ecencyApi.post((`/private-api/notifications/mark`), data);
      return response.data
    }catch(error) {
      bugsnag.notify(error);
      throw error
    }
  };


export const setPushToken = (data) =>
  new Promise((resolve, reject) => {
    api
      .post('/rgstrmbldvc/', data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        bugsnag.notify(error);
        reject(error);
      });
  });

/** 
 * ************************************
 * SEARCH ECENCY APIS IMPLEMENTATION 
 * ************************************
 */

export const search = (data) =>
  new Promise((resolve, reject) => {
    searchApi
      .post('/search', data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        bugsnag.notify(error);
        reject(error);
      });
  });

export const searchPath = (q) =>
  new Promise((resolve, reject) => {
    searchApi
      .post('/search-path', {
        q,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        bugsnag.notify(error);
        reject(error);
      });
  });

export const searchAccount = (q = '', limit = 20, random = 0) =>
  new Promise((resolve, reject) => {
    searchApi
      .post('/search-account', {
        q,
        limit,
        random,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        bugsnag.notify(error);
        reject(error);
      });
  });

export const searchTag = (q = '', limit = 20, random = 0) =>
  new Promise((resolve, reject) => {
    searchApi
      .post('/search-tag', {
        q,
        limit,
        random,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        bugsnag.notify(error);
        reject(error);
      });
  });



/** 
 * ************************************
 * SCHEDULES ECENCY APIS IMPLEMENTATION 
 * ************************************
 */

/**
 * Adds new post to scheduled posts
 * @param permlink 
 * @param title 
 * @param body 
 * @param meta 
 * @param options 
 * @param scheduleDate 
 * @returns All scheduled posts
 */
export const addSchedule = async (
  permlink:string,
  title:string,
  body:string,
  meta:any,
  options:any,
  scheduleDate:string
) => {
  try {
    const data = {
      title,
      permlink,
      meta,
      body,
      schedule: scheduleDate,
      options,
      reblog: 0,
    }
    const response = await ecencyApi
    .post('/private-api/schedules-add', data)
    return response.data;
  } catch(error) {
    console.warn("Failed to add post to schedule", error)
    bugsnag.notify(error);
    throw error;
  }
}

/**
 * Fetches all scheduled posts against current user
 * @returns array of app scheduled posts
 */
export const getSchedules = async () => {
  try {
    const response = await ecencyApi.post(`/private-api/schedules`)
    return response.data;
  } catch(error){
    console.warn("Failed to get schedules")
    bugsnag.notify(error)
    throw error;
  }
}

/**
 * Removes post from scheduled posts using post id;
 * @param id 
 * @returns array of scheduled posts
 */
export const deleteScheduledPost = async (id:string) => {
  try {
    const data = { id };
    const response = await ecencyApi.post(`/private-api/schedules-delete`, data);
    return response;
  }catch(error){
    console.warn("Failed to delete scheduled post")
    bugsnag.notify(error)
    throw error;
  }
} 

/**
 * Moves scheduled post to draft using schedule id
 * @param id 
 * @returns Array of scheduled posts
 */
export const moveScheduledToDraft = async (id:string) => {
  try {
    const data = { id }
    const response = await ecencyApi.post(`/private-api/schedules-move`, data);
    return response.data;
  } catch(error) {
    console.warn("Failed to move scheduled post to drafts")
    bugsnag.notify(error)
    throw error;
  }
}

// Old image service
/** 
 * ************************************
 * IMAGES ECENCY APIS IMPLEMENTATION 
 * ************************************
 */


export const getImages = async () => {
  try {
    const response = await ecencyApi.post('/private-api/images')
    return response.data;
  } catch(error){
    console.warn('Failed to get images', error);
    bugsnag.notify(error);
  }
}

export const addImage = async (url:string) => {
  try {
    const data = { url };
    const response = await ecencyApi.post(`/private-api/images-add`, data);
    return response.data;
  } catch(error) {
    console.warn('Failed to add image', error);
    bugsnag.notify(error);
    throw error;
  }
}

export const deleteImage = async (id:string) => {
  try {
    const data = { id };
    const response = await ecencyApi.post(`/private-api/images-delete`, data);
    return response.data;
  } catch(error) {
    console.warn('Failed to delete image', error);
    bugsnag.notify(error);
    throw error;
  }
}

export const uploadImage = (media, username, sign) => {
  const file = {
    uri: media.path,
    type: media.mime,
    name: media.filename || `img_${Math.random()}.jpg`,
    size: media.size,
  };

  const fData = new FormData();
  fData.append('file', file);

  return upload(fData, username, sign);
};

// New image service

export const getNodes = () => serverList.get().then((resp) => resp.data.hived || SERVER_LIST);

export const getSCAccessToken = (code) =>
  new Promise((resolve, reject) => {
    ecencyApi
      .post('/auth-api/hs-token-refresh', {
        code,
      })
      .then((resp) => resolve(resp.data))
      .catch((e) => {
        bugsnag.notify(e);
        reject(e);
      });
  });

export const getPromotePosts = (username) => {
  try {
    console.log('Fetching promoted posts');
    return api.get('/promoted-posts?limit=10').then((resp) => {
      return resp.data.map(({ post_data }) =>
        post_data ? parsePost(post_data, username, true) : null,
      );
    });
  } catch (error) {
    bugsnag.notify(error);
    return error;
  }
};

export const purchaseOrder = (data) =>
  api
    .post('/purchase-order', data)
    .then((resp) => resp.data)
    .catch((error) => bugsnag.notify(error));



export const getPostReblogs = (data) =>
  api
    .get(`/post-reblogs/${data.author}/${data.permlink}`)
    .then((resp) => resp.data)
    .catch((error) => bugsnag.notify(error));



export const register = async (data) => {
  try {
    const res = await api.post('/signup/account-create', data);
    return res.data;
  } catch (error) {
    bugsnag.notify(error);
    throw error;
  }
};
