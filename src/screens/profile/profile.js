import * as React from 'react';
import { StatusBar, Image, Dimensions, AsyncStorage } from 'react-native';

import moment from 'moment';
import FastImage from 'react-native-fast-image';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustomTabBar from '../home/FeedTabs';
import DiscoverPage from '../discover/Discover';
import { getAccount, getFollows } from '../../providers/steem/Dsteem';

import {
    Content,
    Card,
    CardItem,
    Thumbnail,
    View,
    Header,
    Left,
    Body,
    Right,
    Button,
    Icon,
    Title,
    Text,
} from 'native-base';

class ProfilePage extends React.Component {
    constructor() {
        super();
        this.state = {
            user: [],
            about: {},
            follows: {},
            isLoggedIn: false,
        };
    }

    async componentWillMount() {
        let isLoggedIn;
        await AsyncStorage.getItem('isLoggedIn').then(result => {
            isLoggedIn = JSON.parse(result);
            if (isLoggedIn == true) {
                this.setState({
                    isLoggedIn: true,
                });
            } else {
            }
        });
    }

    componentDidMount() {
        let user;
        let info;
        let json_metadata;
        AsyncStorage.getItem('user')
            .then(result => {
                if (!result) {
                    return false;
                }
                user = JSON.parse(result);
            })
            .then(() => {
                getAccount(user.username).then(account => {
                    json_metadata = JSON.parse(account[0].json_metadata);
                    info = json_metadata.profile;
                    this.setState({
                        user: account[0],
                        about: info,
                    });
                });
            })
            .then(() => {
                getFollows(user.username)
                    .then(result => {
                        this.setState({
                            follows: result,
                        });
                    })
                    .catch(err => {
                        alert(err);
                    });
            })
            .catch(err => {
                alert(err);
            });
    }

    render() {
        return (
            <View style={{ flex: 1, top: StatusBar.currentHeight }}>
                {this.state.isLoggedIn ? (
                    <View style={{ flex: 1 }}>
                        <Header
                            style={{
                                backgroundColor: 'transparent',
                                position: 'absolute',
                                top: StatusBar.currentHeight,
                            }}
                        >
                            <Left>
                                <Button transparent>
                                    <Icon name="menu" />
                                </Button>
                            </Left>
                            <Body>
                                <Title>{this.state.user.name}</Title>
                            </Body>
                            <Right>
                                <Button transparent>
                                    <Icon name="search" />
                                </Button>
                                <Button transparent>
                                    <Icon name="heart" />
                                </Button>
                                <Button transparent>
                                    <Icon name="more" />
                                </Button>
                            </Right>
                        </Header>
                        <Content
                            style={{ flex: 1, backgroundColor: '#f9f9f9' }}
                        >
                            <FastImage
                                style={{
                                    width: Dimensions.get('window').width,
                                    height: 160,
                                }}
                                source={{
                                    uri: this.state.about.cover_image,
                                    priority: FastImage.priority.high,
                                }}
                            />
                            <FastImage
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 50,
                                    top: -50,
                                    borderWidth: 1,
                                    borderColor: 'white',
                                    alignSelf: 'center',
                                }}
                                source={{
                                    uri: this.state.about.profile_image,
                                    priority: FastImage.priority.high,
                                }}
                            />
                            <Body style={{ top: -40 }}>
                                <Text style={{ fontWeight: 'bold' }}>
                                    {this.state.user.name}
                                </Text>
                                <Text>{this.state.about.about}</Text>
                            </Body>
                            <Card
                                style={{
                                    marginTop: 0,
                                    marginLeft: 0,
                                    marginRight: 0,
                                    marginBottom: 0,
                                }}
                            >
                                <CardItem
                                    style={{
                                        borderColor: 'lightgray',
                                        borderTopWidth: 1,
                                        borderBottomWidth: 1,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View style={{ flex: 0.3 }}>
                                        <Text>
                                            {this.state.user.post_count} Posts
                                        </Text>
                                    </View>
                                    <View style={{ flex: 0.4 }}>
                                        <Text>
                                            {this.state.follows.follower_count}{' '}
                                            Followers
                                        </Text>
                                    </View>
                                    <View style={{ flex: 0.4 }}>
                                        <Text>
                                            {this.state.follows.following_count}{' '}
                                            Following
                                        </Text>
                                    </View>
                                </CardItem>

                                <CardItem
                                    style={{
                                        flexDirection: 'row',
                                        borderBottomWidth: 0,
                                    }}
                                >
                                    <View style={{ flex: 0.5 }}>
                                        <Text
                                            style={{
                                                marginLeft: 20,
                                                alignSelf: 'flex-start',
                                            }}
                                        >
                                            <Icon
                                                style={{
                                                    fontSize: 20,
                                                    alignSelf: 'flex-start',
                                                }}
                                                name="md-pin"
                                            />
                                            {this.state.about.location}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 0.5 }}>
                                        <Text>
                                            <Icon
                                                style={{
                                                    fontSize: 20,
                                                    marginRight: 10,
                                                }}
                                                name="md-calendar"
                                            />
                                            {moment
                                                .utc(this.state.user.created)
                                                .local()
                                                .fromNow()}
                                        </Text>
                                    </View>
                                </CardItem>
                            </Card>
                            <View>
                                <ScrollableTabView
                                    style={{
                                        alignSelf: 'center',
                                        backgroundColor: 'transparent',
                                    }}
                                    renderTabBar={() => (
                                        <CustomTabBar
                                            style={{
                                                alignSelf: 'center',
                                                height: 40,
                                                backgroundColor: '#fff',
                                            }}
                                            tabUnderlineDefaultWidth={30} // default containerWidth / (numberOfTabs * 4)
                                            tabUnderlineScaleX={3} // default 3
                                            activeColor={'#222'}
                                            inactiveColor={'#222'}
                                        />
                                    )}
                                >
                                    <View
                                        tabLabel="Blog"
                                        style={{
                                            paddingHorizontal: 7,
                                            backgroundColor: '#f9f9f9',
                                            flex: 1,
                                            minWidth:
                                                Dimensions.get('window').width /
                                                1,
                                        }}
                                    />
                                    <View
                                        tabLabel="Comments"
                                        style={{
                                            paddingHorizontal: 7,
                                            backgroundColor: '#f9f9f9',
                                            flex: 1,
                                            minWidth:
                                                Dimensions.get('window').width /
                                                1,
                                        }}
                                    />
                                    <View
                                        tabLabel="Replies"
                                        style={{
                                            paddingHorizontal: 7,
                                            backgroundColor: '#f9f9f9',
                                            flex: 1,
                                            minWidth:
                                                Dimensions.get('window').width /
                                                1,
                                        }}
                                    />
                                    <View
                                        tabLabel="Wallet"
                                        style={{
                                            paddingHorizontal: 7,
                                            backgroundColor: '#f9f9f9',
                                            flex: 1,
                                            minWidth:
                                                Dimensions.get('window').width /
                                                1,
                                        }}
                                    />
                                </ScrollableTabView>
                            </View>
                        </Content>
                    </View>
                ) : (
                    <View>
                        <Header style={{}}>
                            <Left>
                                <Button transparent>
                                    <Icon name="menu" />
                                </Button>
                            </Left>
                            <Body>
                                <Title />
                            </Body>
                            <Right>
                                <Button transparent>
                                    <Icon name="more" />
                                </Button>
                            </Right>
                        </Header>
                        <DiscoverPage />
                    </View>
                )}
            </View>
        );
    }
}

export default ProfilePage;
