import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';

import './index.css';
import {App,Login,Stats,BottomNav} from './App';

import createHistory from 'history/createHashHistory';

import registerServiceWorker from './registerServiceWorker';

const baseUrl = process.env.PUBLIC_URL;
//const baseUrl = '.';
const history = createHistory();



const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100)
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to='/Login' />
  )} />
)


export default function Main () {
  return (
    <Router>
      <div>
          <Route exact path='/' component={Login} />
          <PrivateRoute path='/App' component={App} />
          <Route path='/Login' component={Login} />
          <Route path='/Stats' component={Stats} />
      </div>
    </Router>
  )
}



ReactDOM.render(
    <Main />
, document.getElementById('root'));


registerServiceWorker();
