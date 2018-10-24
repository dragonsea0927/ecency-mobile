import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getAuthStatus } from '../../../realm/realm';
// Component
import { SideMenuView } from '..';

/*
  *               Props Name                              Description
  *@props -->     props name here                         description here
  *
  */

class SideMenuContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  // Component Life Cycle Functions

  componentWillMount() {
    getAuthStatus().then((res) => {
      this.setState({ isLoggedIn: res });
    });
  }

  // Component Functions

  _navigateToRoute = (route = null) => {
    const { navigation } = this.props;
    navigation.navigate(route);
  };

  render() {
    const { isLoggedIn } = this.state;

    return (
      <SideMenuView
        navigateToRoute={this._navigateToRoute}
        isLoggedIn={isLoggedIn}
        userAvatar={null}
      />
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state,
});

export default connect(mapStateToProps)(SideMenuContainer);
