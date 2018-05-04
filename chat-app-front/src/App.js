import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login'
import Main from './Main'
import { Route,Link,NavLink } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div>
          <Route exact path="/" render={()=><Login />} />
          <Route path="/Main" render={()=><Main />} />
        </div>
    );
  }
}

export default App;
