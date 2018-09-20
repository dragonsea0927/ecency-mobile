import React, { Component } from "react";
import { View, WebView } from "react-native";
import { loginWithSC2 } from "../../providers/steem/auth";
import { steemConnectOptions } from "./config";
import RNRestart from "react-native-restart";
import { Navigation } from "react-native-navigation";

export default class SteemConnect extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
    
	onNavigationStateChange(event) {
		let access_token;
		try {
			access_token = event.url.match(/\?(?:access_token)\=([\S\s]*?)\&/)[1];
		} catch (error) {
			console.log(error);
		}
		if(access_token) {
			loginWithSC2(access_token, "pinCode").then(result => {
				if(result === true) {
					// TODO: Handle pinCode and navigate to home page
					Navigation.dismissModal(this.props.componentId);
					RNRestart.Restart();
				} else {
					Navigation.dismissModal(this.props.componentId);
					// TODO: Error alert (Toast Message)
				}
			});
		}
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<WebView 
					onNavigationStateChange={state => this.onNavigationStateChange(state)}
					source={{ 
						uri: `${steemConnectOptions.base_url}?client_id=${steemConnectOptions.client_id}&redirect_uri=${steemConnectOptions.redirect_uri}&${steemConnectOptions.scope}`
					}}/>
			</View>
		);
	}
}
