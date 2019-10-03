import { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { injectIntl } from 'react-intl';
import { withNavigation } from 'react-navigation';

// Providers
import { gameStatusCheck, gameClaim } from '../providers/esteem/ePoint';

class RedeemContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      nextDate: null,
      gameRight: 1,
    };
  }

  // Component Life Cycle Functions

  async componentDidMount() {
    const { username } = this.props;

    await gameStatusCheck(username, 'spin')
      .then(res => {
        this.setState({
          gameRight: get(res, 'status') !== 3 ? 1 : get(res, 'status') !== 18 ? 5 : 0,
        });
      })
      .catch(err => {
        if (err) {
          Alert.alert(get(err, 'message') || err.toString());
        }
      });
  }

  // Component Functions

  _startGame = async type => {
    const { username } = this.props;
    let gameStatus;

    await gameStatusCheck(username, type)
      .then(res => {
        gameStatus = res;
      })
      .catch(err => {
        if (err) {
          Alert.alert(get(err, 'message') || err.toString());
        }
      });

    if (get(gameStatus, 'status') !== 18) {
      await gameClaim(username, type, get(gameStatus, 'key'))
        .then(res => {
          this.setState({
            gameRight: get(gameStatus, 'status') !== 3 ? 0 : 5,
            score: get(res, 'score'),
          });
        })
        .catch(err => {
          if (err) {
            Alert.alert(get(err, 'message') || err.toString());
          }
        });
    } else {
      this.setState({ nextDate: get(gameStatus, 'next_date'), gameRight: 0 });
    }
  };

  _spin = () => {
    this._startGame('spin');
  };

  render() {
    const { children } = this.props;
    const { score, gameRight, nextDate } = this.state;

    return (
      children &&
      children({
        score,
        spin: () => this._startGame('spin'),
        startGame: this._startGame,
        gameRight,
        nextDate,
      })
    );
  }
}

const mapStateToProps = state => ({
  username: state.account.currentAccount.name,
});

export default withNavigation(connect(mapStateToProps)(injectIntl(RedeemContainer)));
