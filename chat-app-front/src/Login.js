import React, { Component } from 'react';




export default class Login extends Component {



	render() {



		return(
			<div className='wrap'>
  				Login
   				<form action="/login" method="post">
        		<input className="loginput" type='text' name='username' placeholder='Yourname' /><button className="logbutton">LOG IN</button>
    			</form>

			</div>

		);
	}
}