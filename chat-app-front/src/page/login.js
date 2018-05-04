import React, { Component } from 'react';

import Cookies from 'universal-cookie';
import IpList from '../config/ip';
import axios from 'axios';
// var axios = require('axios')

const cookies = new Cookies();

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: ""
		};
	}

	handleNamechange = (evt) => {
		this.setState({ username: evt.target.value });
	}

	handleLogin = (e) => {
		e.preventDefault();
		console.log("handleLogin",this.state.username);
    cookies.set('isLogin', 'true', { path: '/', maxAge: 60 * 60 * 24 });
    cookies.set('username', this.state.username, { path: '/', maxAge: 60 * 60 * 24 });
    window.location = '/main';
	}

	render() {

		return(
			<div className='wrap'>
  				Login
   				<form onSubmit={this.handleLogin}>
        		<input value={this.state.name} onChange={this.handleNamechange} className="loginput" type='text' name='username' placeholder='Yourname'></input>
						<button className="logbutton" type="submit">LOG IN</button>

    			</form>

			</div>

		);
	}
}
