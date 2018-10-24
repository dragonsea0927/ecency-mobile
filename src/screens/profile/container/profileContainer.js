import React, { Component } from 'react';

// Components
import { ProfileScreen } from '..';

// Utilitites
import {
  getUser, getFollows, getPosts, getUserComments,
} from '../../../providers/steem/dsteem';
import { getUserData, getAuthStatus, getUserDataWithUsername } from '../../../realm/realm';
import { getFormatedCreatedDate } from '../../../utils/time';

class ProfileContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      posts: [],
      commments: [],
      replies: [],
      about: {},
      follows: {},
      isLoggedIn: false,
      isLoading: true,
    };
  }

  // componentWillMount() {
  //   console.log(this.props.navigation.state.params);
  // }

  async componentDidMount() {
    const { navigation } = this.props;

    // TODO: use from redux store.
    let isLoggedIn;
    let userData;

    const selectedUser = navigation.state.params;

    await getAuthStatus().then((res) => {
      isLoggedIn = res;
    });

    if (selectedUser) {
      const _userData = getUserDataWithUsername(selectedUser.username);
      console.log(selectedUser);

      console.log('holllyy');
      console.log(_userData);
      userData = _userData && _userData[0];
    } else if (isLoggedIn) {
      await getUserData().then((res) => {
        userData = Array.from(res)[0];
      });
    }

    if (isLoggedIn) {
      let user;
      let follows;
      let about;

      await getFollows(userData.username).then((res) => {
        follows = res;
      });

      user = await getUser(userData.username);

      about = user.json_metadata && JSON.parse(user.json_metadata);

      this.setState(
        {
          user,
          isLoggedIn,
          follows,
          about: about && about.profile,
        },
        () => {
          this._getBlog(userData.username);
          this._getComments(userData.username);
        },
      );
    }
  }

  _getBlog = (user) => {
    this.setState({ isLoading: true });
    getPosts('blog', { tag: user, limit: 10 }, user)
      .then((result) => {
        this.setState({
          isReady: true,
          posts: result,
          start_author: result[result.length - 1].author,
          start_permlink: result[result.length - 1].permlink,
          refreshing: false,
          isLoading: false,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  _getMore = async () => {
    const {
      posts, user, start_author, start_permlink,
    } = this.state;
    await getPosts(
      'blog',
      {
        tag: user.name,
        limit: 10,
        start_author,
        start_permlink,
      },
      user.name,
    ).then((result) => {
      const _posts = result;

      _posts.shift();
      this.setState({
        posts: [...posts, ..._posts],
        start_author: result[result.length - 1] && result[result.length - 1].author,
        start_permlink: result[result.length - 1] && result[result.length - 1].permlink,
        isLoading: false,
      });
    });
  };

  _getComments = async (user) => {
    await getUserComments({ start_author: user, limit: 10 })
      .then((result) => {
        this.setState({
          isReady: true,
          commments: result,
          refreshing: false,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const {
      about, commments, follows, isLoading, isLoggedIn, posts, user,
    } = this.state;

    return (
      <ProfileScreen
        about={about}
        commments={commments}
        follows={follows}
        getMorePost={this._getMore}
        isLoading={isLoading}
        isLoggedIn={isLoggedIn}
        posts={posts}
        user={user}
        {...this.props}
      />
    );
  }
}

export default ProfileContainer;
