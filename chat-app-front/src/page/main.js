import React, { Component } from 'react';

import Cookies from 'universal-cookie';
import IpList from '../config/ip';
import axios from 'axios';

var $ = require('jquery')
const cookies = new Cookies();
const io = require('socket.io-client');

// const io = require('socket.io')();
// var socket = io();

// socket.on('connect', function () {

// 	socket.on('chat message', function(msg){

// 				console.log(msg.createdAt);
// 				var date = new Date(msg.createdAt);
//                 var dd = date.toDateString()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
// 				var sender = msg.user.username;
// 				if (sender == current_username){
// 					//$('#newchat').append($('<p>' + msg.user.username + ' | ' + dd + ' : ' + msg.text + '</p>'));
// 					$('#pagechat').append($('<div class=\"container\"><p class=\"w3-right\">' + msg.text + '</p><span class=\"time-right\">' + sender + ' | ' + dd + '</span></div>'));
// 				} else {
// 					$('#pagechat').append($('<div class=\"container darker\"><p class=\"w3-left\">' + msg.text + '</p><span class=\"time-left\">' + sender + ' | ' + dd + '</span></div>'));
// 				}
// 				$("html, body").animate({ scrollTop: $(document).height()-$(window).height() }, 0);
// 	});


// });

// function save(){
// 	current_username = $('#username').val();
// }

// function send(){
// 		//var text_box = document.getElementById('m');
// 		//socket.emit('chat message', text_box.value);
// 		if ($('#m').val().trim() !== ''){
// 			var data =  {user : current_username, message: $('#m').val()};
// 			socket.emit('send', {user: data.user, message: data.message});

// 			document.getElementById('m').value = '';
// 			$('#m').focus();
// 		}
// }

// var openTab = document.getElementById("firstTab");
// openTab.click();

export default class Main extends Component {
	constructor(props) {
		super(props);
		axios.post(IpList.loadBalancer + "/login/",cookies.get('username'))
		.then((response) => {

		}).catch((err) => {

		})
	}

	createGroup() {
		document.getElementById('id02').style.display='block';
	}

	closeGroup() {
		document.getElementById('id02').style.display='none';
	}

	createJoin() {
		document.getElementById('id01').style.display='block';
	}

	closeJoin() {
		document.getElementById('id01').style.display='none';
	}

	createChat() {
		document.getElementById('id03').style.display='block';
	}

	closeChat() {
		document.getElementById('id03').style.display='none';
	}

	render() {
		
		var current_username = cookies.get('username');
		var socket = io('http://localhost:3333');

		socket.on('connect', function () {
			socket.on('chat message', function(msg){
						console.log(msg.createdAt);
						var date = new Date(msg.createdAt);
						var dd = date.toDateString()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
						var sender = msg.user.username;
						if (sender === current_username){
							$('#pagechat').append($('<div class=\"container\"><p class=\"w3-right\">' + msg.text + '</p><span class=\"time-right\">' + sender + ' | ' + dd + '</span></div>'));
						} else {
							$('#pagechat').append($('<div class=\"container darker\"><p class=\"w3-left\">' + msg.text + '</p><span class=\"time-left\">' + sender + ' | ' + dd + '</span></div>'));
						}
						$("html, body").animate({ scrollTop: $(document).height()-$(window).height() }, 0);
			});
			
			
		});


		function send(){
				//var text_box = document.getElementById('m');
				//socket.emit('chat message', text_box.value);
				if ($('#m').val().trim() !== ''){
					var data =  {username : current_username, message: $('#m').val()};
					socket.emit('send', {username: data.username, message: data.message});
					
					document.getElementById('m').value = '';
					$('#m').focus();
				}
		}
		
		function logout(){
			window.location = '/';
			cookies.set('isLogin', 'false');
			cookies.set('username','');
		}
		
		function joinGroup(){
			var data =  {username : current_username, group : $('#group_name').val()};
			socket.emit('join group',{username : data.username, group: data.group});
			console.log(data);
			document.getElementById('id01').style.display='none';
		}
		
		function createGroup(){
			var data =  {username : current_username, group : $('#new_group_name').val()};
			socket.emit('create group',{username : data.username, group: data.group});
			console.log(data);
			document.getElementById('id02').style.display='none';
		}

		var navStyle = {
			zIndex:"3",
			width:"180px",
		};

		return(
			<div>
				<nav className="w3-sidebar w3-bar-block w3-collapse w3-white w3-top w3-animate-left w3-card acontainer" style={navStyle} id="mySidebar">
  					<a className="w3-bar-item w3-border-bottom w3-large"><i className="fa fa-user w3-margin-right"></i>Client</a>
  					<a href="#" className="w3-bar-item w3-button" onClick={this.createChat.bind(this)}><i className="fa fa-comment w3-margin-right"></i>Group Chat</a>
  					<a href="#" className="w3-bar-item w3-button" onClick={this.createJoin.bind(this)}><i className="fas fa-sign-in-alt w3-margin-right"></i>Join Group</a>
  					<a href="#" className="w3-bar-item w3-button" onClick={this.createGroup.bind(this)}><i className="fas fa-plus-circle w3-margin-right"></i>Create Group</a>
  					<a href="#" className="w3-bar-item w3-button" onClick={logout}><i className="fa fa-times-circle w3-margin-right"></i>Logout</a>
				</nav>

				<div id="id01" className="w3-modal" style={{zIndex:"4"}}>
  					<div className="w3-modal-content w3-animate-zoom">
    					<div className="w3-container w3-padding w3-blue">
       						<span onClick={this.closeJoin.bind(this)}
       						className="w3-button w3-blue w3-right w3-xxlarge"><i class="fa fa-remove"></i></span>
      						<h2>Join Group</h2>
    					</div>
    					<div class="w3-panel">
      						<label id="groupName">Group Name</label>
      						<input id ='group_name' className="w3-input w3-border w3-margin-bottom" type="text" />
      						<div className="w3-section">
        						<a></a>
        						<a className="w3-button w3-light-grey" onClick={joinGroup}>Join  <i className="fas fa-sign-in-alt w3-margin-right"></i></a>
      						</div>
    					</div>
  					</div>
				</div>

				<div id="id02" className="w3-modal" style={{zIndex:"4"}}>
  					<div className="w3-modal-content w3-animate-zoom">
    					<div className="w3-container w3-padding w3-blue">
       						<span onClick={this.closeGroup.bind(this)}
       						className="w3-button w3-blue w3-right w3-xxlarge"><i className="fa fa-remove"></i></span>
      						<h2>Create Group</h2>
    					</div>
    					<div className="w3-panel">
      						<label>New Group Name : </label>
      						<input id='new_group_name' className="w3-input w3-border w3-margin-bottom" type="text" />
      						<div className="w3-section">
        						<a></a>
        						<a className="w3-button w3-light-grey" onClick={createGroup}>Create  <i className="fas fa-plus-circle w3-margin-right"></i></a>
      						</div>
    					</div>
  					</div>
				</div>

				<div id="id03" className="w3-modal" style={{zIndex:"4"}}>
  					<div id="my_groups" className="w3-modal-content w3-animate-zoom">
    					<div className="w3-container w3-padding w3-blue">
       						<span onClick={this.closeChat.bind(this)}
       						className="w3-button w3-blue w3-right w3-xxlarge"><i class="fa fa-remove"></i></span>
      						<h2>Select Group</h2>
    					</div>
						'''append this more'''
        				<a className="w3-bar-item w3-button w3-mobile" onClick={this.closeChat.bind(this)}>Group1</a>
        				<a className="w3-bar-item w3-button w3-mobile" onClick={this.closeChat.bind(this)}>Group2</a>
        				<a className="w3-bar-item w3-button w3-mobile" onClick={this.closeChat.bind(this)}>Group3</a>
  					</div>
				</div>

				<div className="w3-overlay w3-hide-large w3-animate-opacity" onClick="w3_close()" style={{cursor:"pointer"}} title="Close Sidemenu" id="myOverlay"></div>

				<div id="pagechat" className="w3-main" style={{marginBottom:"100px",marginLeft:"200px",marginTop:"100px",width:"84%"}}>
  					<i class="fa fa-bars w3-button w3-white w3-hide-large w3-xlarge w3-margin-left w3-margin-top" onclick="w3_open()"></i>

  					<header className="w3-container w3-xlarge" style={{position:"fixed",top:"0",background:"#ffffff",marginBottom : "200px", width:"88vw"}}>
    					<p className="w3-left">Username : {cookies.get('username')}</p>
						<p className="w3-left w3-margin-left">Currently display Group : Group_NAME</p>
    					<a href="#" className="w3-blue w3-button w3-right w3-margin-top w3-margin-right">Block</a>
    					<a href="#" className="w3-blue w3-button w3-right w3-margin-top w3-margin-right">Get Unread</a>
  					</header>

				</div>
				<div className="w3-main" style={{background: "#ffffff",padding: "3px",marginLeft:"200px", width:"84%",position: "fixed", bottom: "0"}}>
  					<div className='text'>
    					<input id='m' style={{width:"93%",marginRight:"0.5%"}} type="text" placeholder="  Type message..."/><button className="w3-blue w3-button" onClick={send} style = {{padding:"10px",borderRadius:"20%"}}>Send</button>
  					</div>

				</div>


			</div>




		);
	}
}
