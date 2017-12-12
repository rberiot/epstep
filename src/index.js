import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Switch,
  Route,
  withRouter,
  HashRouter
} from 'react-router-dom';

import './index.css';
import {App,Login,Stats,BottomNav} from './App';

import { Router } from 'react-router';
import createHistory from 'history/createHashHistory';

import registerServiceWorker from './registerServiceWorker';

const baseUrl = process.env.PUBLIC_URL;
//const baseUrl = '.';
const history = createHistory();

ReactDOM.render(
    <Router history={history}>
    	<div>
      		<Route exact path={"/"} component={Login} />
      		<Route path={"/App"} component={App}  />
      		<Route path={"/Login"} component={Login} />
      		<Route path={"/Stats"} component={Stats} />
    	</div>
    </Router>
, document.getElementById('root'));

/*
ReactDOM.render(
    <BottomNav history={history} logged={true} />
, document.getElementById('bottomnav'));
*/


registerServiceWorker();
